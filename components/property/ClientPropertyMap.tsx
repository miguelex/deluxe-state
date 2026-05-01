"use client";

import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("./PropertyMap"), {
  ssr: false,
});

interface ClientPropertyMapProps {
  locationString: string;
  lat: number;
  lng: number;
}

export default function ClientPropertyMap(props: ClientPropertyMapProps) {
  return <MapWithNoSSR {...props} />;
}
