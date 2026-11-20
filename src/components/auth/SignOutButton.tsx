"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await signOut();
    // Full page navigation clears any cached client state.
    window.location.assign("/");
  }

  return (
    <Button onClick={handleSignOut} disabled={loading} className="mt-4 w-full">
      {loading ? (
        <>
          <Loader2Icon className="mr-2 size-4 animate-spin" />
          Signing out...
        </>
      ) : (
        "Sign Out"
      )}
    </Button>
  );
}