"use client";

import { useEffect, useRef } from "react";

interface DeviceMapProps {
  latest: { lat: number | null; lng: number | null } | null;
  events: Array<any>;
}

export default function DeviceMap({ latest, events }: DeviceMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // ---------------------------------------------
  // INIT GOOGLE MAP (runs once)
  // ---------------------------------------------
  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstance.current) return; // already made

    mapInstance.current = new google.maps.Map(mapRef.current, {
      center: { lat: -37.815, lng: 144.963 }, // default Melbourne
      zoom: 14,
      mapId: "TRACKBLOCK_MAP",
    });

    markerRef.current = new google.maps.Marker({
      position: { lat: -37.815, lng: 144.963 },
      map: mapInstance.current,
      title: "Device",
    });
  }, []);

  // ---------------------------------------------
  // UPDATE MARKER WHEN NEW GPS COMES IN
  // ---------------------------------------------
  useEffect(() => {
    if (!mapInstance.current || !markerRef.current) return;
    if (!latest || latest.lat === null || latest.lng === null) return;

    const pos = { lat: latest.lat, lng: latest.lng };

    markerRef.current.setPosition(pos);
    mapInstance.current.panTo(pos);
  }, [latest]);

  // ---------------------------------------------
  // OPTIONAL ROUTE TRAIL
  // ---------------------------------------------
  useEffect(() => {
    if (!mapInstance.current) return;
    if (!events || events.length < 2) return;

    const coords = events
      .filter((e) => e.latitude && e.longitude)
      .map((e) => ({ lat: e.latitude, lng: e.longitude }));

    new google.maps.Polyline({
      path: coords,
      map: mapInstance.current,
      strokeColor: "#ff0000",
      strokeOpacity: 0.7,
      strokeWeight: 4,
    });
  }, [events]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: 8,
        overflow: "hidden",
      }}
    />
  );
}
