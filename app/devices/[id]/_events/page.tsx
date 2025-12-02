"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";

export default function DeviceEventsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const json = await fetchAPI(`/device/${id}/events`);
        setEvents(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events for Device: {id}</h1>

      {loading && <p className="text-zinc-500">Loading…</p>}

      {!loading && events.length === 0 && (
        <p className="text-zinc-500">No events recorded yet.</p>
      )}

      {events.length > 0 && (
        <pre className="bg-black text-green-300 p-4 rounded-lg text-sm overflow-x-auto">
          {JSON.stringify(events, null, 2)}
        </pre>
      )}
    </main>
  );
}
