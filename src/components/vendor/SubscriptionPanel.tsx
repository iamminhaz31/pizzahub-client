"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CrownIcon, LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";

type MeResponse = {
  user: {
    subscriptionPlan?: "free" | "premium";
    subscriptionExpiresAt?: string | null;
  };
};

const FREE_FEATURES = [
  "Up to 3 active menu items",
  "Basic vendor dashboard",
  "Order management",
];

const PREMIUM_FEATURES = [
  "Unlimited active menu items",
  "Premium badge on your items",
  "Featured placement on the homepage",
  "All Free plan features",
];

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <CheckIcon className="mt-0.5 size-4 shrink-0 text-green-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function SubscriptionPanel() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch<MeResponse>("/api/me")
      .then((data) => {
        if (!cancelled) setMe(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Could not load your plan."
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpgrade() {
    setStarting(true);
    try {
      const result = await apiFetch<{ url: string }>("/api/payments/checkout", {
        method: "POST",
      });
      // Premium is only switched on later, by the verified Stripe webhook.
      window.location.assign(result.url);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not start the payment. Please try again."
      );
      setStarting(false);
    }
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center font-medium text-destructive">
        {error}
      </div>
    );
  }

  if (!me) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );
  }

  const expiresAt = me.user.subscriptionExpiresAt ?? null;
  const premium =
    me.user.subscriptionPlan === "premium" &&
    (!expiresAt || new Date(expiresAt) > new Date());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-4 py-3 text-sm">
        <span>Your current plan:</span>
        <Badge
          variant="outline"
          className={
            premium ? "border-amber-300 bg-amber-100 text-amber-800" : ""
          }
        >
          {premium ? "Premium" : "Free"}
        </Badge>
        {premium && expiresAt && (
          <span className="text-muted-foreground">
            Active until{" "}
            {new Date(expiresAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="flex flex-col gap-4 rounded-xl border bg-card p-6">
          <div>
            <h2 className="text-xl font-semibold">Free</h2>
            <p className="mt-1 text-3xl font-bold">$0</p>
          </div>
          <FeatureList items={FREE_FEATURES} />
          <div className="mt-auto">
            <Button variant="outline" className="w-full" disabled>
              {premium ? "Included in Premium" : "Your current plan"}
            </Button>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border-2 border-primary bg-card p-6 shadow-sm">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <CrownIcon className="size-5 text-amber-500" />
              Premium
            </h2>
            <p className="mt-1 text-3xl font-bold">
              $9.99
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / month
              </span>
            </p>
          </div>
          <FeatureList items={PREMIUM_FEATURES} />
          <div className="mt-auto">
            <Button
              className="w-full"
              size="lg"
              disabled={premium || starting}
              onClick={handleUpgrade}
            >
              {starting && (
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
              )}
              {premium
                ? "Premium is active"
                : starting
                  ? "Redirecting to Stripe..."
                  : "Upgrade to Premium"}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}