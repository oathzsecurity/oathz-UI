"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/devices/TB-DEMO-001");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 420, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>
        OATHZ Dashboard Login
      </h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            fontSize: 16,
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginBottom: 12,
            fontSize: 16,
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 12,
            background: "#111",
            color: "white",
            fontSize: 16,
            borderRadius: 6,
          }}
        >
          Sign In
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: 16 }}>
          {error}
        </p>
      )}
    </div>
  );
}
