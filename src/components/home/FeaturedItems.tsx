"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  }, []);

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
          <Link href="/menu">View full menu</Link>
        </Button>
      </FadeIn>

      {state.phase === "loading" && <MenuGridSkeleton count={4} />}

      {state.phase === "error" && (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          Menu items could not be loaded right now. Please try again later.
        </div>
      )}

      {state.phase === "ready" && state.items.length === 0 && (
        <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
          No menu items are available yet. Please check back soon.
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