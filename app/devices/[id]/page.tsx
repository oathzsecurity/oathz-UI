"use client";

import React, { useEffect, useState } from "react";
import DeviceMap from "@/components/DeviceMap";

interface DeviceEvent {
  device_id: string;
  latitude: number | null;
  longitude: number | null;
  gps_fix: boolean;
  movement_confirmed: boolean;
  state: string;
  event_type: string;
  last_seen: string;
}

export default function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const [DEVICE_ID, setDeviceId] = useState<string>("");
  const [events, setEvents] = useState<DeviceEvent[]>([]);
  const [latest, setLatest] = useState<{ lat: number | null; lng: number | null } | null>(null);

  // 🔓 Unwrap params PROMISE
  useEffect(() => {
    params.then((p) => {
      setDeviceId(p.id);
    });
  }, [params]);

  // 🔄 Fetch events whenever DEVICE_ID is ready
  useEffect(() => {
    if (!DEVICE_ID) return;

    async function loadEvents() {
      try {
        const res = await fetch(`https://api.oathzsecurity.com/device/${DEVICE_ID}/events`);
        const data = await res.json();

        setEvents(data);

        if (data.length > 0) {
          const last = data[data.length - 1];
          setLatest({
            lat: last.latitude,
            lng: last.longitude,
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    loadEvents();

    // ⏱ Poll every 3s for live updates
    const timer = setInterval(loadEvents, 3000);
    return () => clearInterval(timer);

  }, [DEVICE_ID]);

  return (
    <main style={{ padding: "24px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
        Device: {DEVICE_ID || "Loading..."}
      </h1>

      <section style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
          Live GPS Location
        </h2>

        <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #e5e5e5" }}>
          <DeviceMap latest={latest} events={events} />
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>Telemetry</h2>

        <div
          style={{
            background: "black",
            color: "#00ff66",
            fontFamily: "monospace",
            padding: "12px",
            borderRadius: 8,
            fontSize: 14,
            whiteSpace: "pre-wrap",
            minHeight: 120,
          }}
        >
          {!events.length ? "Loading...\n" : JSON.stringify(events, null, 2)}
        </div>
      </section>
    </main>
  );
}
