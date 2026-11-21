import type { Metadata } from "next";
import { Suspense } from "react";

import { MenuBrowser } from "@/components/menu/MenuBrowser";
import { MenuGridSkeleton } from "@/components/menu/MenuGridSkeleton";

export const metadata: Metadata = {
  title: "Browse Menu",
  description: "Search and filter pizzas, sides and drinks from local restaurants.",
};

export default function MenuPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Browse Menu</h1>
        <p className="mt-2 text-muted-foreground">
          Hot and fresh pizzas, sides and drinks from restaurants near you.
        </p>
      </div>
      <Suspense fallback={<MenuGridSkeleton />}>
        <MenuBrowser />
      </Suspense>
    </div>
  );
}