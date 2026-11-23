import Link from "next/link";
import { CrownIcon, MapPinIcon, StoreIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PublicMenuItem } from "@/lib/browse-menu";

export function MenuItemCard({ item }: { item: PublicMenuItem }) {
  const vendorName = item.vendor.businessName || item.vendor.name;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition duration-200 focus-within:ring-2 focus-within:ring-ring hover:shadow-lg motion-safe:hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.images[0]}
          alt={item.itemName}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
          loading="lazy"
        />
        {item.vendor.isPremium && (
          <Badge className="absolute left-3 top-3 gap-1 border-0 bg-amber-500 text-white">
            <CrownIcon className="size-3" />
            Premium
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <h3 className="line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">
            {/* This link covers the whole card, so the card is clickable. */}
            <Link
              href={`/menu/${item._id}`}
              className="outline-none after:absolute after:inset-0 after:content-['']"
            >
              {item.itemName}
            </Link>
          </h3>
          <Badge variant="secondary">{item.category}</Badge>
        </div>

        <ul className="space-y-1 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <MapPinIcon className="size-4 shrink-0" />
            <span className="truncate">{item.location}</span>
          </li>
          <li className="flex items-center gap-2">
            <StoreIcon className="size-4 shrink-0" />
            <span className="truncate">{vendorName}</span>
          </li>
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <p className="text-xl font-bold text-primary">
            ${item.price.toFixed(2)}
          </p>
          <Button asChild size="sm" className="relative z-10">
            <Link href={`/menu/${item._id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}