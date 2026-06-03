'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createProperty, updateProperty } from '../actions'
import AdminMap from './AdminMap'

interface PropertyFormProps {
  initialData?: Record<string, unknown>
  t: Record<string, string>
}

export default function PropertyForm({ initialData, t }: PropertyFormProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'success' | 'error', message: string}>({
    isOpen: false,
    type: 'success',
    message: ''
  })
  
  // Form State
  const [title, setTitle] = useState(initialData?.title || '')
  const [price, setPrice] = useState(initialData?.price || '')
  const [priceSuffix, setPriceSuffix] = useState(initialData?.price_suffix || '')
  const [status, setStatus] = useState(initialData?.type || 'SALE')
  
  // We'll map "Property Type" from HTML to a tag
  const initialTags = (initialData?.tags as string[]) || []
  const propertyTypes = ['Apartment', 'House', 'Villa', 'Commercial']
  const initialTypeTag = propertyTypes.find(type => initialTags.includes(type)) || 'Apartment'
  const [propertyType, setPropertyType] = useState(initialTypeTag)
  
  const [description, setDescription] = useState(initialData?.description || '')
  const [location, setLocation] = useState(initialData?.location || '')
  const [latitude, setLatitude] = useState(initialData?.latitude || '')
  const [longitude, setLongitude] = useState(initialData?.longitude || '')
  const [area, setArea] = useState(initialData?.area || '')
  
  // The DB doesn't have year_built, we can ignore it or add to tags/metadata
  // Let's add it to tags if it's there
  
  const [bedrooms, setBedrooms] = useState(initialData?.bedrooms || 0)
  const [bathrooms, setBathrooms] = useState(initialData?.bathrooms || 0)
  const [parking, setParking] = useState(initialData?.parking || 0) // Parking doesn't exist in DB as field, we'll store as tag
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false)
  
  const amenitiesList = ['Swimming Pool', 'Garden', 'Air Conditioning', 'Smart Home', 'High-speed Wifi', 'Gym', 'Patio / Terrace']
  const initialAmenities = initialTags.filter((t: string) => amenitiesList.includes(t))
  const [amenities, setAmenities] = useState<string[]>(initialAmenities)
  
  // We will keep a unified state for images to avoid out-of-sync issues
  type ImageState = {
    url: string; // The existing URL or the local blob preview
    file?: File; // The actual file if it's a new upload
  };

  const [images, setImages] = useState<ImageState[]>(
    ((initialData?.images as string[]) || []).map((url: string) => ({ url }))
  );
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      
      const newImages = files.map(file => ({
        url: URL.createObjectURL(file),
        file
      }))
      
      setImages(prev => [...prev, ...newImages])
    }
  }
  
  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // 1. Upload new images
      const finalImages: string[] = []
      
      for (const img of images) {
        if (img.file) {
          // This is a new file, upload it
          const url = await handleImageUpload(img.file)
          finalImages.push(url)
        } else {
          // This is an existing URL
          finalImages.push(img.url)
        }
      }
      
      // Generate tags
      const tags = [...amenities, propertyType]
      if (parking > 0) tags.push(`${parking} Parking`)
      
      // Construct form data
      const formData = {
        title,
        price: parseFloat(price.toString()),
        price_suffix: priceSuffix || null,
        type: status,
        description,
        location,
        latitude: latitude ? parseFloat(latitude.toString()) : null,
        longitude: longitude ? parseFloat(longitude.toString()) : null,
        area: parseFloat(area.toString()) || 0,
        bedrooms: parseInt(bedrooms.toString()),
        bathrooms: parseInt(bathrooms.toString()),
        is_featured: isFeatured,
        tags,
        images: finalImages,
        image_alt: title,
        slug: initialData?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000)
      }
      
      if (initialData?.id) {
        const res = await updateProperty(initialData.id, formData)
        if (res.error) throw new Error(res.error)
      } else {
        const res = await createProperty(formData)
        if (res.error) throw new Error(res.error)
      }
      
      setModalState({
        isOpen: true,
        type: 'success',
        message: initialData?.id ? (t.success_edit || 'Property updated successfully!') : (t.success_add || 'Property created successfully!')
      });
    } catch (err: unknown) {
      console.error(err)
      const errorMessage = err instanceof Error ? err.message : (t.error || 'An error occurred');
      setError(errorMessage)
      setModalState({
        isOpen: true,
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const toggleAmenity = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative pb-20 md:pb-0">
      
      {error && (
        <div className="xl:col-span-12 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="xl:col-span-8 space-y-8">
        
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">info</span>
            </div>
            <h2 className="text-xl font-bold text-nordic">{t.basic_info}</h2>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="title">
                {t.property_title} <span className="text-red-500">*</span>
              </label>
              <input 
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-base px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro" 
                id="title" 
                placeholder={t.property_title_placeholder} 
                type="text"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="price">
                  {t.price} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-sf-pro text-sm">$</span>
                  <input 
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full pl-7 pr-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium font-sf-pro" 
                    id="price" 
                    placeholder="0.00" 
                    type="number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="priceSuffix">
                  {t.price_suffix}
                </label>
                <input 
                  value={priceSuffix}
                  onChange={e => setPriceSuffix(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-medium font-sf-pro" 
                  id="priceSuffix" 
                  placeholder="/month" 
                  type="text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="status">
                  {t.status}
                </label>
                <select 
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer" 
                  id="status"
                >
                  <option value="SALE">{t.status_sale}</option>
                  <option value="RENT">{t.status_rent}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="type">
                  {t.type}
                </label>
                <select 
                  value={propertyType}
                  onChange={e => setPropertyType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro cursor-pointer" 
                  id="type"
                >
                  <option value="Apartment">{t.type_apartment}</option>
                  <option value="House">{t.type_house}</option>
                  <option value="Villa">{t.type_villa}</option>
                  <option value="Commercial">{t.type_commercial}</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="w-5 h-5 text-mosque border-gray-300 rounded focus:ring-mosque" 
                />
                <span className="text-sm font-medium text-nordic font-sf-pro group-hover:text-mosque transition-colors">
                  {t.is_featured}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">description</span>
            </div>
            <h2 className="text-xl font-bold text-nordic">{t.description_title}</h2>
          </div>
          <div className="p-8">
            <div className="mb-3 flex gap-2 border-b border-gray-100 pb-2">
              <button className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors" type="button"><span className="material-icons text-lg">format_bold</span></button>
              <button className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors" type="button"><span className="material-icons text-lg">format_italic</span></button>
              <button className="p-1.5 text-gray-400 hover:text-nordic hover:bg-gray-50 rounded transition-colors" type="button"><span className="material-icons text-lg">format_list_bulleted</span></button>
            </div>
            <textarea 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-base font-sf-pro leading-relaxed resize-y min-h-[200px]" 
              id="description" 
              placeholder={t.description_placeholder}
            ></textarea>
            <div className="mt-2 text-right text-xs text-gray-400 font-sf-pro">
              {description.length} / 2000 characters
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-hint-green/30 flex justify-between items-center bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
                <span className="material-icons text-lg">image</span>
              </div>
              <h2 className="text-xl font-bold text-nordic">{t.gallery}</h2>
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded font-sf-pro">JPG, PNG, WEBP</span>
          </div>
          <div className="p-8">
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-10 text-center hover:bg-hint-green/10 hover:border-mosque/40 transition-colors cursor-pointer group">
              <input 
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                multiple 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-mosque group-hover:scale-110 transition-transform duration-300">
                  <span className="material-icons text-2xl">cloud_upload</span>
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-nordic font-sf-pro">{t.click_or_drag}</p>
                  <p className="text-xs text-gray-400 font-sf-pro">{t.max_file_size}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {images.map((img, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden relative group shadow-sm">
                  <Image fill alt="Property preview" className="object-cover" src={img.url} />
                  <div className="absolute inset-0 bg-nordic/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button 
                      onClick={() => handleRemoveImage(index)}
                      className="w-8 h-8 rounded-full bg-white text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors" 
                      type="button"
                    >
                      <span className="material-icons text-sm">delete</span>
                    </button>
                  </div>
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-mosque text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm font-sf-pro uppercase tracking-wider">
                      {t.main_image}
                    </span>
                  )}
                </div>
              ))}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-mosque hover:border-mosque hover:bg-hint-green/20 transition-all group" 
                type="button"
              >
                <span className="material-icons group-hover:scale-110 transition-transform">add</span>
                <span className="text-xs mt-1 font-medium font-sf-pro">{t.add_more}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <div className="xl:col-span-4 space-y-8">
        
        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">place</span>
            </div>
            <h2 className="text-lg font-bold text-nordic">{t.location_title}</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="location">
                {t.address}
              </label>
              <input 
                required
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro" 
                id="location" 
                placeholder={t.address_placeholder} 
                type="text"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="latitude">
                  {t.latitude}
                </label>
                <input 
                  value={latitude}
                  onChange={e => setLatitude(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro" 
                  id="latitude" 
                  placeholder="37.7749" 
                  type="number"
                  step="any"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-nordic mb-1.5 font-sf-pro" htmlFor="longitude">
                  {t.longitude}
                </label>
                <input 
                  value={longitude}
                  onChange={e => setLongitude(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-nordic placeholder-gray-400 focus:ring-1 focus:ring-mosque focus:border-mosque transition-all text-sm font-sf-pro" 
                  id="longitude" 
                  placeholder="-122.4194" 
                  type="number"
                  step="any"
                />
              </div>
            </div>
            
            {latitude !== '' && longitude !== '' && !isNaN(parseFloat(latitude.toString())) && !isNaN(parseFloat(longitude.toString())) && (
              <div className="pt-4 fade-in">
                <AdminMap 
                  lat={parseFloat(latitude.toString())} 
                  lng={parseFloat(longitude.toString())} 
                  onChange={(lat, lng) => {
                    setLatitude(lat.toFixed(6));
                    setLongitude(lng.toFixed(6));
                  }}
                />
                <p className="text-xs text-gray-500 mt-2 font-sf-pro">
                  {t.map_drag_help || "You can drag the marker to adjust the exact location."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-hint-green/30 flex items-center gap-3 bg-gradient-to-r from-hint-green/10 to-transparent">
            <div className="w-8 h-8 rounded-full bg-hint-green flex items-center justify-center text-nordic">
              <span className="material-icons text-lg">straighten</span>
            </div>
            <h2 className="text-lg font-bold text-nordic">{t.details_title}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="group">
              <label className="text-xs text-gray-500 font-medium font-sf-pro mb-1 block" htmlFor="area">{t.area}</label>
              <input 
                required
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full text-left px-3 py-2 rounded border border-gray-200 bg-gray-50 text-nordic focus:bg-white focus:ring-1 focus:ring-mosque focus:border-mosque transition-all font-sf-pro text-sm" 
                id="area" 
                placeholder="0" 
                type="number"
              />
            </div>
            
            <hr className="border-gray-100"/>
            
            <div className="space-y-4">
              {/* Bedrooms */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">bed</span> {t.bedrooms}
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button onClick={() => setBedrooms(Math.max(0, parseInt(bedrooms.toString()) - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100" type="button">-</button>
                  <input value={bedrooms} onChange={e => setBedrooms(e.target.value)} className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" type="text"/>
                  <button onClick={() => setBedrooms(parseInt(bedrooms.toString()) + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100" type="button">+</button>
                </div>
              </div>
              
              {/* Bathrooms */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">shower</span> {t.bathrooms}
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button onClick={() => setBathrooms(Math.max(0, parseInt(bathrooms.toString()) - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100" type="button">-</button>
                  <input value={bathrooms} onChange={e => setBathrooms(e.target.value)} className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" type="text"/>
                  <button onClick={() => setBathrooms(parseInt(bathrooms.toString()) + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100" type="button">+</button>
                </div>
              </div>

              {/* Parking */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-nordic font-sf-pro flex items-center gap-2">
                  <span className="material-icons text-gray-400 text-sm">directions_car</span> {t.parking}
                </label>
                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                  <button onClick={() => setParking(Math.max(0, parseInt(parking.toString()) - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-r border-gray-100" type="button">-</button>
                  <input value={parking} onChange={e => setParking(e.target.value)} className="w-10 text-center border-none bg-transparent text-nordic p-0 focus:ring-0 text-sm font-medium font-sf-pro" type="text"/>
                  <button onClick={() => setParking(parseInt(parking.toString()) + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors border-l border-gray-100" type="button">+</button>
                </div>
              </div>
            </div>
            
            <hr className="border-gray-100"/>
            
            {/* Amenities */}
            <div>
              <h3 className="text-sm font-bold text-nordic mb-3 font-sf-pro uppercase tracking-wider text-xs text-gray-500">{t.amenities}</h3>
              <div className="space-y-2">
                {[
                  { id: 'Swimming Pool', label: t.amenity_pool },
                  { id: 'Garden', label: t.amenity_garden },
                  { id: 'Air Conditioning', label: t.amenity_ac },
                  { id: 'Smart Home', label: t.amenity_smart_home }
                ].map(amenity => (
                  <label key={amenity.id} className="flex items-center gap-2.5 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={amenities.includes(amenity.id)}
                      onChange={() => toggleAmenity(amenity.id)}
                      className="w-4 h-4 text-mosque border-gray-300 rounded focus:ring-mosque" 
                    />
                    <span className="text-sm text-gray-700 font-sf-pro group-hover:text-nordic transition-colors">
                      {amenity.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex gap-3 sticky top-24">
          <button 
            type="button"
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-nordic font-medium font-sf-pro hover:bg-gray-50 transition-colors"
          >
            {t.cancel}
          </button>
          <button 
            disabled={isSubmitting}
            type="submit"
            className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium font-sf-pro flex justify-center items-center gap-2 hover:bg-nordic transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="material-icons animate-spin text-sm">refresh</span>
                {t.saving}
              </>
            ) : (
              <>
                <span className="material-icons text-sm">save</span>
                {t.save_property}
              </>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Sticky Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl md:hidden z-40 flex gap-3">
        <button 
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-nordic font-medium font-sf-pro"
        >
          {t.cancel}
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-lg bg-mosque text-white font-medium font-sf-pro flex justify-center items-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <span className="material-icons animate-spin text-sm">refresh</span>
              {t.saving}
            </>
          ) : (
            <>
              <span className="material-icons text-sm">save</span>
              {t.save_property}
            </>
          )}
        </button>
      </div>

      {/* Success/Error Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-nordic/40 backdrop-blur-sm fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden scale-in">
            <div className={`p-6 flex flex-col items-center text-center ${modalState.type === 'success' ? 'bg-hint-green/10' : 'bg-red-50'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${modalState.type === 'success' ? 'bg-hint-green text-nordic' : 'bg-red-100 text-red-600'}`}>
                <span className="material-icons text-3xl">
                  {modalState.type === 'success' ? 'check_circle' : 'error'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-nordic mb-2">
                {modalState.type === 'success' ? (t.success_title || 'Success!') : (t.error_title || 'Error')}
              </h3>
              <p className="text-gray-600 font-sf-pro">
                {modalState.message}
              </p>
            </div>
            <div className="p-4 bg-white border-t border-gray-100 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setModalState(prev => ({ ...prev, isOpen: false }));
                  if (modalState.type === 'success') {
                    router.push('/admin/properties');
                    router.refresh();
                  }
                }}
                className={`px-8 py-2.5 rounded-lg font-medium font-sf-pro transition-colors ${
                  modalState.type === 'success' 
                    ? 'bg-mosque text-white hover:bg-nordic' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {t.continue || 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

    </form>
  )
}
