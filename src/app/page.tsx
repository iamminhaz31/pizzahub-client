"use client";

import { useEffect, useState } from "react";

type HealthState = {
  status: "loading" | "ok" | "error";
  message: string;
};

export default function Home() {
  const [health, setHealth] = useState<HealthState>({
    status: "loading",
    message: "Checking server connection...",
  });

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    fetch(`${apiUrl}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setHealth({
            status: "ok",
            message: "Server and database are connected.",
          });
        } else {
          setHealth({
            status: "error",
            message: "Server responded with an error.",
          });
        }
      })
      .catch(() => {
        setHealth({ status: "error", message: "Could not reach the server." });
      });
  }, []);

  const color =
    health.status === "ok"
      ? "text-green-600"
      : health.status === "error"
      ? "text-red-600"
      : "text-orange-500";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-orange-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-red-700">PizzaHub</h1>
      <p className="text-gray-700">Hot &amp; Fresh Pizza Delivered to Your Door</p>
      <p className={`text-sm font-medium ${color}`}>{health.message}</p>
    </main>
  );
}