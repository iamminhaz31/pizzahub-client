"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">
            PizzaHub
          </CardTitle>
          <CardDescription>
            Hot &amp; Fresh Pizza Delivered to Your Door
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className={`text-sm font-medium ${color}`}>{health.message}</p>
          <Button onClick={() => toast.success("ShadCN and toast are working!")}>
            Test Toast
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}