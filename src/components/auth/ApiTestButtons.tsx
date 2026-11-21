"use client";

import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";

// Temporary buttons used only to test the Express JWT and role middleware.
export function ApiTestButtons() {
  async function callApi(path: string) {
    try {
      const data = await apiFetch<{ message?: string; user?: { role: string } }>(
        path
      );
      toast.success(
        data.message ?? `Server says your role is: ${data.user?.role ?? "unknown"}`
      );
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? `${error.status}: ${error.message}`
          : "Request failed."
      );
    }
  }

  return (
    <div className="mt-4 space-y-2 border-t pt-4">
      <p className="text-xs text-muted-foreground">API test (temporary)</p>
      <Button variant="outline" className="w-full" onClick={() => callApi("/api/me")}>
        Test /api/me
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => callApi("/api/debug/vendor")}
      >
        Test vendor-only route
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => callApi("/api/debug/admin")}
      >
        Test admin-only route
      </Button>
    </div>
  );
}