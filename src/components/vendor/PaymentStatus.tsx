"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2Icon, LoaderCircleIcon, XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";

type Phase = "checking" | "paid" | "failed" | "slow";

const MAX_TRIES = 10;

// The webhook saves the real payment result. This page only shows it.
export function PaymentStatus() {
  const [phase, setPhase] = useState<Phase>("checking");

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    let cancelled = false;

    async function check(attempt: number) {
      if (!sessionId) {
        setPhase("failed");
        return;
      }
      try {
        const result = await apiFetch<{ status: string }>(
          `/api/payments/session/${sessionId}`
        );
        if (cancelled) return;
        if (result.status === "paid") {
          setPhase("paid");
          return;
        }
        if (result.status === "expired" || result.status === "failed") {
          setPhase("failed");
          return;
        }
      } catch {
        if (cancelled) return;
      }
      if (attempt >= MAX_TRIES) {
        setPhase("slow");
        return;
      }
      setTimeout(() => {
        if (!cancelled) check(attempt + 1);
      }, 2000);
    }

    check(1);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-lg rounded-xl border bg-card p-8 text-center">
      {phase === "checking" && (
        <>
          <LoaderCircleIcon className="mx-auto size-12 animate-spin text-primary" />
          <h1 className="mt-4 text-2xl font-bold">Confirming your payment...</h1>
          <p className="mt-2 text-muted-foreground">
            Please wait a few seconds while Stripe confirms your payment.
          </p>
        </>
      )}

      {phase === "paid" && (
        <>
          <CheckCircle2Icon className="mx-auto size-12 text-green-600" />
          <h1 className="mt-4 text-2xl font-bold">Payment successful</h1>
          <p className="mt-2 text-muted-foreground">
            Your Premium plan is now active. You can add unlimited menu items,
            and your items get a Premium badge and featured placement.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/vendor/add-item">Add Menu Item</Link>
          </Button>
        </>
      )}

      {phase === "slow" && (
        <>
          <LoaderCircleIcon className="mx-auto size-12 text-amber-500" />
          <h1 className="mt-4 text-2xl font-bold">Still confirming</h1>
          <p className="mt-2 text-muted-foreground">
            Your payment was received, but confirmation is taking longer than
            usual. Please check your subscription again in a minute.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/vendor/subscription">View Subscription</Link>
          </Button>
        </>
      )}

      {phase === "failed" && (
        <>
          <XCircleIcon className="mx-auto size-12 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">Payment not confirmed</h1>
          <p className="mt-2 text-muted-foreground">
            We could not confirm this payment. You have not been charged for
            Premium. Please try again.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/vendor/subscription">Back to Subscription</Link>
          </Button>
        </>
      )}
    </div>
  );
}