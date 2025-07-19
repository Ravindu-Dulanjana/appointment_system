'use client';
import { useState } from "react";
import { adminLogin } from "../lib/api";
import axios from "axios";

export default function AdminPage() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");

  const handleLogin = async () => {
    try {
      const res = await adminLogin(email, password );
      alert(`Token: ${res.data.token}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Login failed");
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-4">Admin Login</h1>
      <input value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 mb-2 block" placeholder="Email" />
      <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-4 block" placeholder="Password" />
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
    </main>
  );
}