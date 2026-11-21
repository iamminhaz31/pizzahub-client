"use client";

import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { PublicMenuItem } from "@/lib/browse-menu";

export type Viewer = {
  id: string;
  role: "customer" | "vendor" | "admin";
};

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed bg-muted/40 p-4 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function OrderPanel({
  item,
  viewer,
}: {
  item: PublicMenuItem;
  viewer: Viewer;
}) {
  if (viewer.role === "admin") {
    return <Notice>Admin accounts cannot place customer orders.</Notice>;
  }

  if (viewer.role === "vendor") {
    if (item.vendorId === viewer.id) {
      return (
        <Notice>
          This is your own menu item, so you cannot order it.{" "}
          <Link
            href="/dashboard/vendor/menu-items"
            className="font-medium text-primary hover:underline"
          >
            Manage your menu items
          </Link>
        </Notice>
      );
    }
    return (
      <Notice>
        Vendor accounts cannot place orders. Please sign in with a customer
        account to order.
      </Notice>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <p className="text-sm text-muted-foreground">
        Choose your delivery date and address in the next step.
      </p>
      {/* TEMPORARY: replaced by the real order form in the Orders step. */}
      <Button
        size="lg"
        className="w-full"
        onClick={() => toast.info("The order form is coming in the next update.")}
      >
        Order Now
      </Button>
    </div>
  );
}