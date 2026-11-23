"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon } from "lucide-react";

import { FadeIn } from "@/components/home/FadeIn";
import { fetchPublic } from "@/lib/browse-menu";
import { MENU_CATEGORIES } from "@/lib/menu-items";

type CategoryCount = { name: string; count: number };

type CategoryStyle = { icon: string; tint: string };

const DEFAULT_STYLE: CategoryStyle = {
  icon: "🍕",
  tint: "bg-primary/10",
};

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Classic Pizzas": { icon: "🍕", tint: "bg-red-100 dark:bg-red-950/50" },
  "Vegetarian Pizzas": { icon: "🥬", tint: "bg-green-100 dark:bg-green-950/50" },
  "Meat Lovers": { icon: "🍖", tint: "bg-orange-100 dark:bg-orange-950/50" },
  "Specialty / Gourmet Pizzas": { icon: "✨", tint: "bg-amber-100 dark:bg-amber-950/50" },
  "Sides & Appetizers": { icon: "🥖", tint: "bg-yellow-100 dark:bg-yellow-950/50" },
  "Beverages & Desserts": { icon: "🥤", tint: "bg-rose-100 dark:bg-rose-950/50" },
};

function countLabel(count: number | undefined) {
  if (count === undefined) return "Browse items";
  if (count === 0) return "Coming soon";
  return `${count} ${count === 1 ? "item" : "items"}`;
}

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
    <section className="bg-orange-50/60 py-14 dark:bg-muted/40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <FadeIn className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Pizza Categories</h2>
          <p className="mt-2 text-muted-foreground">
            Explore the menu by what you feel like eating.
          </p>
        </FadeIn>

        <FadeIn className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MENU_CATEGORIES.map((name) => {
            const style = CATEGORY_STYLES[name] ?? DEFAULT_STYLE;
            return (
              <Link
                key={name}
                href={`/menu?category=${encodeURIComponent(name)}`}
                className="group flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
              >
                <span
                  className={`grid size-14 shrink-0 place-items-center rounded-full text-2xl ${style.tint}`}
                >
                  {style.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold group-hover:text-primary">{name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {countLabel(counts[name])}
                  </p>
                </div>
                <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            );
          })}
        </FadeIn>
      </div>
    </section>
  );
}