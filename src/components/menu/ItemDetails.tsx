"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, CrownIcon, MapPinIcon } from "lucide-react";

import { ItemDetailsSkeleton } from "@/components/menu/ItemDetailsSkeleton";
import { OrderPanel, type Viewer } from "@/components/menu/OrderPanel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import type { PublicMenuItem } from "@/lib/browse-menu";

type FetchResult = {
  id: string;
  item?: PublicMenuItem;
  error?: string;
};

function Gallery({ item }: { item: PublicMenuItem }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.images[selected]}
          alt={item.itemName}
          className="size-full object-cover"
        />
      </div>

      {item.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {item.images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Show image ${index + 1}`}
              className={`size-16 shrink-0 overflow-hidden rounded-md border-2 sm:size-20 ${
                index === selected ? "border-primary" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ItemDetails({ id, viewer }: { id: string; viewer: Viewer }) {
  const [result, setResult] = useState<FetchResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ item: PublicMenuItem }>(`/api/menu-items/${id}`)
      .then((data) => {
        if (!cancelled) setResult({ id, item: data.item });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message =
          error instanceof Error && error.message !== "Failed to fetch"
            ? error.message
            : "Could not reach the server. Please try again.";
        setResult({ id, error: message });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const backLink = (
    <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
      <Link href="/menu">
        <ArrowLeftIcon className="mr-1 size-4" />
        Back to Browse Menu
      </Link>
    </Button>
  );

  if (!result || result.id !== id) {
    return (
      <>
        {backLink}
        <ItemDetailsSkeleton />
      </>
    );
  }

  if (result.error || !result.item) {
    return (
      <>
        {backLink}
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-10 text-center">
          <p className="text-lg font-semibold text-destructive">
            {result.error ?? "This menu item is not available."}
          </p>
          <Button asChild className="mt-5">
            <Link href="/menu">Browse other items</Link>
          </Button>
        </div>
      </>
    );
  }

  const item = result.item;
  const vendorName = item.vendor.businessName || item.vendor.name;

  return (
    <>
      {backLink}
      <div className="grid gap-8 lg:grid-cols-2">
        <Gallery key={item._id} item={item} />

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{item.category}</Badge>
              {item.vendor.isPremium && (
                <Badge className="gap-1 border-0 bg-amber-500 text-white">
                  <CrownIcon className="size-3" />
                  Premium restaurant
                </Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {item.itemName}
            </h1>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon className="size-4" />
              {item.location}
            </p>
            <p className="text-3xl font-bold text-primary">
              ${item.price.toFixed(2)}
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">About this item</h2>
            <p className="whitespace-pre-wrap text-muted-foreground">
              {item.description}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border bg-card p-4">
            <Avatar className="size-12">
              {item.vendor.image && (
                <AvatarImage src={item.vendor.image} alt={vendorName} />
              )}
              <AvatarFallback>
                {vendorName.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Sold by</p>
              <p className="font-semibold">{vendorName}</p>
            </div>
          </div>

          <OrderPanel item={item} viewer={viewer} />
        </div>
      </div>
    </>
  );
}