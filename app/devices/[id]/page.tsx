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

  // ---------------------------------------------------
  // Helpers
  // ---------------------------------------------------

  function timeAgo(ts: string) {
    const diffMs = Date.now() - new Date(ts).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    return `${diffHr}h ago`;
  }

  // Haversine distance in meters
  function distanceMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  // ---------------------------------------------------
  // Data fetching
  // ---------------------------------------------------

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `https://api.oathzsecurity.com/device/${id}/events`,
          { cache: "no-store" }
        );
        const json = await res.json();

        // Sort oldest → newest
        const sorted = [...json].sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        setEvents(sorted);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [id]);

  // ---------------------------------------------------
  // Loading / empty states
  // ---------------------------------------------------

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold">Device: {id}</h1>
        <p>Loading events…</p>
      </main>
    );
  }

  if (!events || events.length === 0) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-bold">Device: {id}</h1>
        <p>No events yet.</p>
      </main>
    );
  }

  // ---------------------------------------------------
  // Determine Online / Chase / Breadcrumb
  // ---------------------------------------------------

  const gpsEvents = events.filter((e) => e.latitude !== null && e.longitude !== null);

  const latest = gpsEvents.length > 0
    ? gpsEvents[gpsEvents.length - 1]
    : events[events.length - 1];

  const latestTs = new Date(latest.timestamp).getTime();
  const isOnline = Date.now() - latestTs < 20_000;

  let isChaseMode = false;
  let breadcrumbPoints: { latitude: number; longitude: number }[] = [];

  if (isOnline && gpsEvents.length >= 2) {
    const totalDistance = distanceMeters(
      gpsEvents[0].latitude!,
      gpsEvents[0].longitude!,
      gpsEvents[gpsEvents.length - 1].latitude!,
      gpsEvents[gpsEvents.length - 1].longitude!
    );

    if (totalDistance >= 10) {
      isChaseMode = true;

      breadcrumbPoints = gpsEvents.map((e) => ({
        latitude: e.latitude!,
        longitude: e.longitude!,
      }));
    }
  }

  // If offline → always wipe trail
  if (!isOnline) {
    isChaseMode = false;
    breadcrumbPoints = [];
  }

  const hasGPS =
    latest.latitude !== null &&
    latest.longitude !== null &&
    !isNaN(latest.latitude) &&
    !isNaN(latest.longitude);

  // ---------------------------------------------------
  // Render
  // ---------------------------------------------------

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Device: {id}</h1>

      <p className="text-zinc-500 mt-1">
        Status:{" "}
        <span className={isOnline ? "text-green-500" : "text-red-500"}>
          {isOnline ? "ONLINE" : "OFFLINE"}
        </span>{" "}
        · Last seen <span className="font-bold">{timeAgo(latest.timestamp)}</span>
      </p>

      <p className="text-zinc-500">
        Mode: <span className="font-bold">{isChaseMode ? "CHASE" : "HEARTBEAT"}</span>
      </p>

      <div className="mt-6">
        {hasGPS ? (
          <DeviceMap
            latitude={latest.latitude!}
            longitude={latest.longitude!}
            deviceId={id}
            points={breadcrumbPoints}
          />
        ) : (
          <p>No GPS fix yet.</p>
        )}
      </div>

      <h2 className="mt-8 text-xl font-bold">Latest Event</h2>
      <pre className="mt-2 bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
        {JSON.stringify(latest, null, 2)}
      </pre>

      <h2 className="mt-8 text-xl font-bold">
        All Events ({events.length})
      </h2>
      <pre className="mt-2 bg-black text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
        {JSON.stringify(events, null, 2)}
      </pre>
    </main>
  );
}
