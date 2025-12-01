"use client";

import { useEffect, useState } from "react";

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

export default function DeviceDetailPage({ params }: any) {
  const { id } = params;

  const [events, setEvents] = useState<DeviceEvent[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `https://api.oathzsecurity.com/device/${id}/events`
        );

        if (!res.ok) {
          console.error("API error:", res.status);
          setEvents(null);
          return;
        }

        const text = await res.text();

        // backend returns a JSON string so we must parse it
        const json = JSON.parse(text);

        setEvents(json);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <p>Loading device data…</p>
      </main>
    );
  }

  if (!events || events.length === 0) {
    return (
      <main style={{ padding: 24 }}>
        <p>No data received yet for this device.</p>
      </main>
    );
  }

  const latest = events[events.length - 1];

  return (
    <main style={{ padding: 24 }}>
      <h1 className="text-2xl font-bold mb-4">{id}</h1>

      <div className="space-y-2 text-lg">
        <div>State: {latest.state}</div>
        <div>GPS Fix: {latest.gps_fix ? "Yes" : "No"}</div>
        <div>Movement: {latest.movement_confirmed ? "Yes" : "No"}</div>
        <div>
          Location: {latest.latitude}, {latest.longitude}
        </div>
        <div>Last Seen: {latest.last_seen}</div>
      </div>
    </main>
  );
}
