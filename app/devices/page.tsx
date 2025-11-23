"use client";

import { useEffect, useState } from "react";



interface DeviceStatus {
  device_id: string;
  last_seen: string;
  state: string;
  gps_fix: boolean;
  latitude: number | null;
  longitude: number | null;
  movement_confirmed: boolean;
  smsSent: boolean;
  callAttempts: number;
  callLock: boolean;
}

export default function DevicesPage() {
  const [data, setData] = useState<DeviceStatus | null>(null);

  // ⭐ Choose which device to display
  const DEVICE_ID = "TB-DEMO-001";

  // ⭐ Back-end route that returns ALL devices
  const API = `https://api.oathzsecurity.com/status`;

  async function fetchStatus() {
    try {
      const res = await fetch(API, { cache: "no-store" });
      const json = await res.json();

      // ⭐ PICK OUT ONE DEVICE FROM THE ARRAY
      const one = json.find((d: any) => d.device_id === DEVICE_ID);

      setData(one ?? null);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  }

  async function resetAlerts() {
    await fetch(
      `https://api.oathzsecurity.com/device/${DEVICE_ID}/reset`,
      { method: "POST" }
    );
    fetchStatus();
  }

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, 5000);
    return () => clearInterval(t);
  }, []);

  // Loading screen
  if (!data)
    return (
      <div className="p-10 text-xl font-mono animate-pulse">
        Loading live device status…
      </div>
    );

  return (
    <main className="p-10 font-mono space-y-6">
      <h1 className="text-3xl font-bold">🛰 TRACKBLOCK LIVE CONSOLE</h1>

      <div className="border rounded-xl p-6 bg-black text-green-400 shadow-xl space-y-2">

        <p>DEVICE: <b>{data.device_id}</b></p>
        <p>LAST SEEN: {data.last_seen}</p>

        <p>
          STATE:{" "}
          <span
            className={
              data.state?.includes("chase")
                ? "text-red-400 font-bold"
                : "text-green-400 font-bold"
            }
          >
            {data.state}
          </span>
        </p>

        <p>GPS FIX: {String(data.gps_fix)}</p>
        <p>LAT:  {data.latitude}</p>
        <p>LON:  {data.longitude}</p>

        <p>MOVEMENT: {String(data.movement_confirmed)}</p>
        <p>SMS SENT: {String(data.smsSent)}</p>
        <p>CALL ATTEMPTS: {data.callAttempts}</p>
        <p>CALL LOCK: {data.callLock ? "🔒" : "❌"}</p>

      </div>

      <button
        onClick={resetAlerts}
        className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-bold shadow-xl"
      >
        🔄 RESET ALERT ENGINE
      </button>
    </main>
  );
}
