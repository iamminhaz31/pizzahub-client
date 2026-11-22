"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { FadeIn } from "@/components/home/FadeIn";
import { fetchPublic } from "@/lib/browse-menu";
import { MENU_CATEGORIES } from "@/lib/menu-items";

type CategoryCount = { name: string; count: number };

const CATEGORY_ICONS: Record<string, string> = {
  "Classic Pizzas": "🍕",
  "Vegetarian Pizzas": "🥬",
  "Meat Lovers": "🍖",
  "Specialty / Gourmet Pizzas": "✨",
  "Sides & Appetizers": "🥖",
  "Beverages & Desserts": "🥤",
};

export function CategoryGrid() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  // The categories always show. The item counts fill in when the server answers.
  useEffect(() => {
    let cancelled = false;
    fetchPublic<{ categories: CategoryCount[] }>("/api/menu-items/categories")
      .then((data) => {
        if (cancelled) return;
        setCounts(Object.fromEntries(data.categories.map((c) => [c.name, c.count])));
      })
      .catch(() => {
        // Counts are optional.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-orange-50/60 py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <FadeIn className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Pizza Categories</h2>
          <p className="mt-2 text-muted-foreground">
            Explore the menu by what you feel like eating.
          </p>
        </FadeIn>

        <FadeIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MENU_CATEGORIES.map((name) => {
            const count = counts[name];
            return (
              <Link
                key={name}
                href={`/menu?category=${encodeURIComponent(name)}`}
                className="group flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition hover:border-primary hover:shadow-md"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/10 text-2xl">
                  {CATEGORY_ICONS[name]}
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold group-hover:text-primary">{name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {count === undefined
                      ? "Browse items"
                      : `${count} ${count === 1 ? "item" : "items"}`}
                  </p>
                </div>
              </Link>
            );
          })}
        </FadeIn>
      </div>
    </section>
  );
}