"use client";

import { useState, useEffect } from "react";

interface DeviceEvent {
  device_id: string;
  event_type: string;
  state: string;
  gps_fix: boolean;
  movement_confirmed: boolean;
  latitude: number;
  longitude: number;
  last_seen: string;
}

export default function DeviceDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [events, setEvents] = useState<DeviceEvent[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch(`https://api.oathzsecurity.com/device/${id}/events`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events:", err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [id]);

  if (loading) return <p style={{ padding: "24px" }}>Loading device data…</p>;
  if (!events || events.length === 0)
    return <p style={{ padding: "24px" }}>No data received yet for this device.</p>;

  return (
    <main style={{ padding: "24px" }}>
      <h1 className="text-3xl font-bold mb-6">Device: {id}</h1>

      <div className="text-sm opacity-70 mb-4">
        {events.length} events loaded
      </div>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: "16px",
          borderRadius: "8px",
          overflowX: "auto"
        }}
      >
        {JSON.stringify(events, null, 2)}
      </pre>
    </main>
  );
}
