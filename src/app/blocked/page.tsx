"use client";

import { useEffect } from "react";
import Link from "next/link";
import { clearApiToken } from "@/lib/api";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/AuthShell";

export default function BlockedPage() {
  // Blocked users are signed out right away.
  useEffect(() => {
    clearApiToken();
    void signOut();
  }, []);

  return (
    <AuthShell
      title="Account blocked"
      description="Your account has been blocked. Please contact support if you think this is a mistake."
      footer={<span>You have been signed out.</span>}
    >
      <Button asChild className="w-full">
        <Link href="/">Back to home</Link>
      </Button>
    </AuthShell>
  );
}