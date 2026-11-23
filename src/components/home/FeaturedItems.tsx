"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, RefreshCwIcon } from "lucide-react";

import { FadeIn } from "@/components/home/FadeIn";
import { MenuGridSkeleton } from "@/components/menu/MenuGridSkeleton";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Button } from "@/components/ui/button";
import { fetchPublic, type PublicMenuItem } from "@/lib/browse-menu";

type State =
  | { phase: "loading" }
  | { phase: "error" }
  | { phase: "ready"; items: PublicMenuItem[] };

export function FeaturedItems() {
  const [state, setState] = useState<State>({ phase: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchPublic<{ items: PublicMenuItem[] }>("/api/menu-items/featured?limit=6")
      .then((data) => {
        if (!cancelled) setState({ phase: "ready", items: data.items });
      })
      .catch(() => {
        if (!cancelled) setState({ phase: "error" });
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function retry() {
    setState({ phase: "loading" });
    setAttempt((value) => value + 1);
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
      <FadeIn className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Featured Menu Items</h2>
          <p className="mt-2 text-muted-foreground">
            Fresh picks from our top restaurants.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/menu">
            View full menu
            <ArrowRightIcon className="ml-1 size-4" />
          </Link>
        </Button>
      </FadeIn>

      {state.phase === "loading" && <MenuGridSkeleton count={6} />}

      {state.phase === "error" && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed p-10 text-center">
          <p className="text-muted-foreground">
            Menu items could not be loaded right now. Please try again.
          </p>
          <Button variant="outline" onClick={retry}>
            <RefreshCwIcon className="mr-2 size-4" />
            Try again
          </Button>
        </div>
      )}

      {state.phase === "ready" && state.items.length === 0 && (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">No featured items yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            New pizzas are added by our restaurants every day. Please check back soon.
          </p>
        </div>
      )}

      {state.phase === "ready" && state.items.length > 0 && (
        <FadeIn className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {state.items.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </FadeIn>
      )}
    </section>
  );
}