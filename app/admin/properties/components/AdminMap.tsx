"use client";

import dynamic from "next/dynamic";

const AdminMapInner = dynamic(() => import("./AdminMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] rounded-lg border border-gray-200 bg-gray-50 flex flex-col items-center justify-center">
      <span className="material-icons animate-spin text-mosque mb-2">refresh</span>
      <span className="text-sm text-gray-500 font-sf-pro">Loading map...</span>
    </div>
  )
});

interface AdminMapProps {
  lat: number;
  lng: number;
  onChange?: (lat: number, lng: number) => void;
}

export default function AdminMap(props: AdminMapProps) {
  return <AdminMapInner {...props} />;
}
