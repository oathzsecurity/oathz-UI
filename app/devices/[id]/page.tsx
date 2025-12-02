"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DeviceMap from "@/components/DeviceMap";

interface DeviceEvent {
  device_id: string;
  event_type: string;
  latitude: number | null;
  longitude: number | null;
  last_seen: string;
  gps_fix: boolean;
}

export default function DeviceDetailPage() {
  const params = useParams();
  const id = params.id as string;

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
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [id]);

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Device: {id}</h1>
        <p>Loading events...</p>
      </main>
    );
  }

  if (!events || events.length === 0) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Device: {id}</h1>
        <p>No events found yet for this device.</p>
      </main>
    );
  }

  const latest = events[events.length - 1];

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Device: {id}</h1>

      <div style={{ marginTop: 24 }}>
        <DeviceMap
          latitude={latest.latitude}
          longitude={latest.longitude}
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
