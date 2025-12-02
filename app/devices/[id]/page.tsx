"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DeviceMap from "@/components/DeviceMap";

interface DeviceEvent {
  id: number;
  device_id: string;
  latitude: number | null;
  longitude: number | null;
  timestamp: string;
}

export default function DeviceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [events, setEvents] = useState<DeviceEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Convert timestamp → "X seconds ago"
  function timeAgo(ts: string) {
    const diffMs = Date.now() - new Date(ts).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    return `${diffHr}h ago`;
  }

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(
          `https://api.oathzsecurity.com/device/${id}/events`,
          { cache: "no-store" }
        );
        const data = await res.json();

        // Ensure it's sorted newest → oldest
        const sorted = [...data].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime()
        );

        setEvents(sorted);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();

    // 🔥 Auto-refresh every 5 seconds
    const interval = setInterval(fetchEvents, 5000);

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Device: {id}</h1>
        <p>Loading events…</p>
      </main>
    );
  }

  if (!events || events.length === 0) {
    return (
      <main style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold" }}>Device: {id}</h1>
        <p>No events received yet.</p>
      </main>
    );
  }

  // Always use the latest event
  const latest = events[events.length - 1];

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 28, fontWeight: "bold" }}>
        Device: {id}
      </h1>

      <p style={{ marginTop: 4, color: "#888" }}>
        Last seen:{" "}
        <span style={{ fontWeight: "bold" }}>
          {timeAgo(latest.timestamp)}
        </span>
      </p>

      <div style={{ marginTop: 24 }}>
        <DeviceMap
          latitude={latest.latitude}
          longitude={latest.longitude}
          deviceId={id}
        />
      </div>

      <h2
        style={{
          marginTop: 32,
          fontSize: 22,
          fontWeight: "bold",
        }}
      >
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

      <h2
        style={{
          marginTop: 32,
          fontSize: 22,
          fontWeight: "bold",
        }}
      >
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
