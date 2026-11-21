"use client";

import { useState } from "react";

import { MenuItemStatusBadge } from "@/components/vendor/MenuItemStatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MenuItem } from "@/lib/menu-items";

type MenuItemDetailsDialogProps = {
  item: MenuItem | null;
  onOpenChange: (open: boolean) => void;
};

function DetailsBody({ item }: { item: MenuItem }) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="grid gap-4">
      <div className="aspect-[4/3] overflow-hidden rounded-lg border bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.images[selected]}
          alt={item.itemName}
          className="size-full object-cover"
        />
      </div>

      {item.images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {item.images.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Show image ${index + 1}`}
              className={`size-16 shrink-0 overflow-hidden rounded-md border-2 ${
                index === selected ? "border-primary" : "border-transparent"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Category</dt>
          <dd className="font-medium">{item.category}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Price</dt>
          <dd className="font-medium">${item.price.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Location</dt>
          <dd className="font-medium">{item.location}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Status</dt>
          <dd>
            <MenuItemStatusBadge status={item.status} />
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Created</dt>
          <dd className="font-medium">
            {new Date(item.createdAt).toLocaleDateString()}
          </dd>
        </div>
        {item.updatedAt && (
          <div>
            <dt className="text-muted-foreground">Last updated</dt>
            <dd className="font-medium">
              {new Date(item.updatedAt).toLocaleDateString()}
            </dd>
          </div>
        )}
      </dl>

      <div className="text-sm">
        <p className="text-muted-foreground">Description</p>
        <p className="whitespace-pre-wrap">{item.description}</p>
      </div>
    </div>
  );
}

export function MenuItemDetailsDialog({
  item,
  onOpenChange,
}: MenuItemDetailsDialogProps) {
  return (
    <Dialog open={item !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{item?.itemName ?? "Menu item"}</DialogTitle>
          <DialogDescription>Details of your menu item.</DialogDescription>
        </DialogHeader>
        {item && <DetailsBody key={item._id} item={item} />}
      </DialogContent>
    </Dialog>
  );
}