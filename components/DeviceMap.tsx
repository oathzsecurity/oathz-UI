"use client";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon paths on Vercel
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  latitude: number;
  longitude: number;
  deviceId: string;
  points?: { latitude: number; longitude: number }[];
}

export default function DeviceMap({
  latitude,
  longitude,
  deviceId,
  points = [],
}: Props) {
  useEffect(() => {
    const container = L.DomUtil.get("device-map") as any;
    if (container && container._leaflet_id) container._leaflet_id = null;

    const map = L.map("device-map").setView([latitude, longitude], 17);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map);

    if (points.length > 1) {
      const line = points.map((p) => [p.latitude, p.longitude]) as [
        number,
        number
      ][];
      L.polyline(line, {
        color: "red",
        weight: 3,
        opacity: 0.8,
      }).addTo(map);
    }

    return () => {
      map.remove();
    };
  }, [latitude, longitude, points]);

  return (
    <div
      id="device-map"
      style={{
        height: "420px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #333",
      }}
    />
  );
}
