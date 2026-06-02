import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

export default async function AdminPropertiesPage() {
  const supabase = await createClient()

  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="text-red-500">Error loading properties: {error.message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Properties</h1>
        <button className="px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-medium text-sm">
          Add Property
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 dark:bg-zinc-950/50 text-zinc-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-4 font-medium">Property</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
              {properties?.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {property.images && property.images.length > 0 ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-zinc-800">
                          <Image
                            src={property.images[0]}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 shrink-0 border border-gray-200 dark:border-zinc-800" />
                      )}
                      <div>
                        <div className="font-medium text-zinc-900 dark:text-zinc-100">
                          {property.title}
                        </div>
                        <div className="text-zinc-500 text-xs mt-0.5">
                          {property.bedrooms} Beds • {property.bathrooms} Baths • {property.area} sqft
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                    {property.location}
                  </td>
                  <td className="px-6 py-4 text-zinc-900 dark:text-zinc-100 font-medium">
                    ${property.price.toLocaleString()}
                    {property.price_suffix && <span className="text-zinc-500 font-normal text-xs ml-1">{property.price_suffix}</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      property.type === 'SALE' 
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 ring-1 ring-inset ring-blue-700/10 dark:ring-blue-400/20'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/10 dark:ring-emerald-400/20'
                    }`}>
                      {property.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {(!properties || properties.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No properties found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
