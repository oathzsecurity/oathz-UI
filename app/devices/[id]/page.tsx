"use client";

import { useEffect, useState } from "react";
import DeviceMap from "@/components/DeviceMap";

interface DeviceEvent {
  device_id: string;
  event_type: string;
  latitude: number | null;
  longitude: number | null;
  last_seen: string;
  gps_fix: boolean;
}

export default function DeviceDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;

  const [events, setEvents] = useState<DeviceEvent[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(
          `https://api.oathzsecurity.com/device/${id}/events`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [id]);

  // Show spinner/loading while fetching
  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Device: {id}</h1>
        <p>Loading events...</p>
      </main>
    );
  }

  // Show "no data" message — BUT keep the UI container visible
  if (!events || events.length === 0) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Device: {id}</h1>
        <p>No events found yet for this device.</p>
      </main>
    );
  }

  // We have events now
  const latest = events[events.length - 1];
  const lat = latest.latitude;
  const lon = latest.longitude;

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Device: {id}</h1>

      <div style={{ marginTop: 24 }}>
        <DeviceMap
          latitude={lat}
          longitude={lon}
          deviceId={id}
        />
      </div>

      <h2 style={{ marginTop: 32, fontSize: 20, fontWeight: "bold" }}>
        Latest Event
      </h2>

      <pre
        style={{
          marginTop: 12,
          padding: 16,
          background: "#111",
          color: "#0f0",
          borderRadius: 8,
          overflowX: "auto",
        }}
      >
        {JSON.stringify(latest, null, 2)}
      </pre>

      <h2 style={{ marginTop: 32, fontSize: 20, fontWeight: "bold" }}>
        All Events ({events.length})
      </h2>

      <pre
        style={{
          marginTop: 12,
          padding: 16,
          background: "#111",
          color: "#0f0",
          borderRadius: 8,
          overflowX: "auto",
        }}
      >
        {JSON.stringify(events, null, 2)}
      </pre>
    </main>
  );
}
