"use client";

import { useEffect, useRef } from "react";

interface Props {
  latitude: number;
  longitude: number;
  deviceId: string;
}

export default function DeviceMap({ latitude, longitude, deviceId }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const L = require("leaflet");

    // Fix Leaflet icon issue on Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "/marker-icon.png",
      shadowUrl: "/marker-shadow.png",
    });

    const map = L.map(mapRef.current).setView([latitude, longitude], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map).bindPopup(deviceId);

    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
}
