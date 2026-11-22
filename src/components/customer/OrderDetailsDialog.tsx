"use client";

import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ORDER_STATUS_NOTES,
  formatDeliveryDate,
  formatRequestDate,
  type CustomerOrder,
} from "@/lib/orders";

type OrderDetailsDialogProps = {
  order: CustomerOrder | null;
  onOpenChange: (open: boolean) => void;
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}

export function OrderDetailsDialog({
  order,
  onOpenChange,
}: OrderDetailsDialogProps) {
  return (
    <Dialog open={order !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order details</DialogTitle>
          <DialogDescription>
            {order ? ORDER_STATUS_NOTES[order.status] : ""}
          </DialogDescription>
        </DialogHeader>

        {order && (
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <div className="size-20 shrink-0 overflow-hidden rounded-lg border bg-muted">
                {order.item?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={order.item.image}
                    alt={order.item.itemName}
                    className="size-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {order.item?.itemName ?? "Item no longer available"}
                </p>
                {order.item && (
                  <p className="text-sm text-muted-foreground">
                    {order.item.category} · ${order.item.price.toFixed(2)}
                  </p>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <Row label="Status">
                <OrderStatusBadge status={order.status} />
              </Row>
              <Row label="Restaurant">{order.vendor?.name ?? "Unknown"}</Row>
              <Row label="Delivery date">
                {formatDeliveryDate(order.deliveryDate)}
              </Row>
              <Row label="Requested on">{formatRequestDate(order.createdAt)}</Row>
            </dl>

            <div className="text-sm">
              <p className="text-muted-foreground">Delivery address</p>
              <p className="whitespace-pre-wrap font-medium">
                {order.deliveryAddress}
              </p>
            </div>

            <div className="text-sm">
              <p className="text-muted-foreground">Your message</p>
              <p className="whitespace-pre-wrap">
                {order.message || "No message"}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}