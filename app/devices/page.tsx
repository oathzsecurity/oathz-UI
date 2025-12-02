import { fetchAPI } from "@/lib/api";
import Link from "next/link";

interface DeviceStatus {
  device_id: string;
  last_seen: string | null;
}

export default async function DevicesPage() {
  let devices: DeviceStatus[] = [];

  try {
    devices = await fetchAPI("/devices");
  } catch (err) {
    console.error("Error loading devices:", err);
  }

  return (
    <main style={{ padding: "24px" }}>
      <h1 className="text-3xl font-bold mb-6">Your Devices</h1>

      {devices.length === 0 && <p>No devices reporting yet.</p>}

      <ul className="list-disc pl-6 space-y-4">
        {devices.map((dev) => (
          <li key={dev.device_id}>
            <Link
              href={`/devices/${dev.device_id}`}
              className="text-blue-600 underline"
            >
              {dev.device_id}
            </Link>
            <div className="text-sm opacity-70">
              Last seen: {dev.last_seen || "Never"}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
