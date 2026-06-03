import { getLocale } from '@/lib/getLocale'
import { getTranslations, resolvePath } from '@/lib/i18n'
import PropertyForm from '../../components/PropertyForm'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const supabase = await createClient()
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !property) {
    notFound()
  }

  const locale = await getLocale()
  const translations = getTranslations(locale)
  const t = (key: string) => resolvePath(translations, key)

  const formT = {
    basic_info: t('admin.property_form.basic_info'),
    property_title: t('admin.property_form.property_title'),
    property_title_placeholder: t('admin.property_form.property_title_placeholder'),
    price: t('admin.property_form.price'),
    price_suffix: t('admin.property_form.price_suffix'),
    status: t('admin.property_form.status'),
    status_sale: t('admin.property_form.status_sale'),
    status_rent: t('admin.property_form.status_rent'),
    type: t('admin.property_form.type'),
    type_apartment: t('admin.property_form.type_apartment'),
    type_house: t('admin.property_form.type_house'),
    type_villa: t('admin.property_form.type_villa'),
    type_commercial: t('admin.property_form.type_commercial'),
    is_featured: t('admin.property_form.is_featured'),
    description_title: t('admin.property_form.description_title'),
    description_placeholder: t('admin.property_form.description_placeholder'),
    gallery: t('admin.property_form.gallery'),
    click_or_drag: t('admin.property_form.click_or_drag'),
    max_file_size: t('admin.property_form.max_file_size'),
    main_image: t('admin.property_form.main_image'),
    add_more: t('admin.property_form.add_more'),
    location_title: t('admin.property_form.location_title'),
    address: t('admin.property_form.address'),
    address_placeholder: t('admin.property_form.address_placeholder'),
    latitude: t('admin.property_form.latitude'),
    longitude: t('admin.property_form.longitude'),
    details_title: t('admin.property_form.details_title'),
    area: t('admin.property_form.area'),
    bedrooms: t('admin.property_form.bedrooms'),
    bathrooms: t('admin.property_form.bathrooms'),
    parking: t('admin.property_form.parking'),
    amenities: t('admin.property_form.amenities'),
    amenity_pool: t('admin.property_form.amenity_pool'),
    amenity_garden: t('admin.property_form.amenity_garden'),
    amenity_ac: t('admin.property_form.amenity_ac'),
    amenity_smart_home: t('admin.property_form.amenity_smart_home'),
    cancel: t('admin.property_form.cancel'),
    saving: t('admin.property_form.saving'),
    save_property: t('admin.property_form.save_property'),
    error: t('admin.property_form.error')
  }

  // Parse parking from tags if exists
  let parkingCount = 0
  if (property.tags) {
    const parkingTag = property.tags.find((tag: string) => tag.includes('Parking') && /\d+/.test(tag))
    if (parkingTag) {
      parkingCount = parseInt(parkingTag.match(/\d+/)?.[0] || '0', 10)
    }
  }

  const initialData = {
    ...property,
    parking: parkingCount
  }

  return (
    <div>
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div className="space-y-4">
          <nav aria-label="Breadcrumb" className="flex">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 font-medium font-sf-pro">
              <li><Link href="/admin/properties" className="hover:text-[#006655] transition-colors">{t('admin.properties.title')}</Link></li>
              <li><span className="material-icons text-xs text-gray-400">chevron_right</span></li>
              <li aria-current="page" className="text-[#19322F]">{t('admin.property_form.title_edit')}</li>
            </ol>
          </nav>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#19322F] tracking-tight mb-2">
              {t('admin.property_form.title_edit')}
            </h1>
            <p className="text-base text-gray-500 max-w-2xl font-normal font-sf-pro">
              {property.title}
            </p>
          </div>
        </div>
      </header>

      <PropertyForm t={formT} initialData={initialData} />
    </div>
  )
}
