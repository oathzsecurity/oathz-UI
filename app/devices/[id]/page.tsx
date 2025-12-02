"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --- FIX LEAFLET ICONS FOR NEXT.JS / VERCEL ---
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- TYPES ---
interface Point {
  latitude: number;
  longitude: number;
}

interface Props {
  deviceId: string;
  points: Point[];
}

export default function DeviceMap({ deviceId, points }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!points.length) return;

    const coords = points.map(
      (p) => [p.latitude, p.longitude] as [number, number]
    );

    const latest = coords[coords.length - 1];

    // --- INIT MAP ON FIRST RUN ---
    if (!mapRef.current) {
      mapRef.current = L.map("device-map").setView(latest, 17);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    const map = mapRef.current!;

    // --- BREADCRUMB POLYLINE ---
    if (!polylineRef.current) {
      polylineRef.current = L.polyline(coords, {
        color: "#3b82f6",
        weight: 4,
        opacity: 0.85,
      }).addTo(map);
    } else {
      polylineRef.current.setLatLngs(coords);
    }

    // --- ANIMATED MARKER ---
    if (!markerRef.current) {
      markerRef.current = L.marker(latest).addTo(map);
    } else {
      markerRef.current.setLatLng(latest);
    }

    // --- AUTO-FIT ROUTE ---
    map.fitBounds(polylineRef.current.getBounds(), {
      padding: [40, 40],
    });
  }, [deviceId, points]);

  return (
    <div
      id="device-map"
      style={{
        height: "380px",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #333",
      }}
    />
  );
}
