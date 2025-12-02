export async function fetchAPI(path: string, options: RequestInit = {}) {
  const base = "https://api.oathzsecurity.com";  // YOUR LIVE BACKEND

  const res = await fetch(base + path, {
    ...options,
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("API ERROR:", res.status, await res.text());
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}






