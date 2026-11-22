
"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 rounded-full bg-destructive/10 p-6">
        <AlertTriangle className="size-12 text-destructive" />
      </div>

      <h1 className="text-3xl font-bold">Something Went Wrong</h1>

      <p className="mt-3 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>

      {error.digest && (
        <p className="mt-2 text-xs text-muted-foreground">
          Error reference: {error.digest}
        </p>
      )}

      <Button onClick={reset} className="mt-8">
        <RefreshCw className="mr-2 size-4" />
        Try Again
      </Button>
    </main>
  );
}
