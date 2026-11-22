
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarIcon,
  EyeIcon,
  LoaderCircleIcon,
  MapPinIcon,
  StoreIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { OrderDetailsDialog } from "@/components/customer/OrderDetailsDialog";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { apiFetch } from "@/lib/api";
import {
  ORDER_STATUS_FILTERS,
  formatDeliveryDate,
  formatRequestDate,
  type CustomerOrder,
  type MyOrdersResponse,
} from "@/lib/orders";

type FetchResult = {
  key: string;
  data?: MyOrdersResponse;
  error?: string;
};

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export function MyOrders() {
  const [status, setStatus] = useState("all");
  const [reloadToken, setReloadToken] = useState(0);
  const [result, setResult] = useState<FetchResult | null>(null);
  const [viewing, setViewing] = useState<CustomerOrder | null>(null);
  const [cancelling, setCancelling] = useState<CustomerOrder | null>(null);
  const [cancelBusy, setCancelBusy] = useState(false);

  const query = useMemo(
    () => (status === "all" ? "" : `?status=${status}`),
    [status]
  );

  const requestKey = `${query}#${reloadToken}`;

  useEffect(() => {
    let cancelled = false;

    apiFetch<MyOrdersResponse>(`/api/orders/mine${query}`)
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setResult({ key: requestKey, error: errorMessage(error) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [query, requestKey]);

  const data = result?.data;
  const loading = result?.key !== requestKey;
  const reload = () => setReloadToken((token) => token + 1);

  async function confirmCancel() {
    if (!cancelling) return;

    setCancelBusy(true);

    try {
      const response = await apiFetch<{ message: string }>(
        `/api/orders/mine/${cancelling._id}/cancel`,
        { method: "PATCH" }
      );

      toast.success(response.message);
      setCancelling(null);
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
      setCancelling(null);
      reload();
    } finally {
      setCancelBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {data ? (
          <p className="text-sm text-muted-foreground">
            {data.counts.total} {data.counts.total === 1 ? "order" : "orders"}
            {" · "}
            {data.counts.pending} pending{" · "}
            {data.counts.accepted} accepted
          </p>
        ) : (
          <span />
        )}

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-48" aria-label="Filter by status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUS_FILTERS.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!result && (
        <div className="space-y-4">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-40 rounded-xl" />
          ))}
        </div>
      )}

      {result?.error && !data && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="font-medium text-destructive">{result.error}</p>
          <Button variant="outline" className="mt-4" onClick={reload}>
            Try again
          </Button>
        </div>
      )}

      {data && data.orders.length === 0 && (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">
            {status === "all"
              ? "You have not placed any orders yet."
              : "No orders match this filter."}
          </p>

          {status === "all" && (
            <Button asChild className="mt-4">
              <Link href="/menu">Browse Menu</Link>
            </Button>
          )}
        </div>
      )}

      {data && data.orders.length > 0 && (
        <div
          className={`space-y-4 ${loading ? "opacity-60 transition-opacity" : ""}`}
        >
          {data.orders.map((order) => (
            <article
              key={order._id}
              className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row"
            >
              <div className="size-full max-h-48 overflow-hidden rounded-lg border bg-muted sm:size-28 sm:max-h-none sm:shrink-0">
                {order.item?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={order.item.image}
                    alt={order.item.itemName}
                    className="aspect-[4/3] size-full object-cover sm:aspect-square"
                  />
                ) : (
                  <div className="grid aspect-square size-full place-items-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold">
                      {order.item?.itemName ?? "Item no longer available"}
                    </h3>

                    {order.item && (
                      <p className="text-sm text-muted-foreground">
                        {order.item.category} · ${order.item.price.toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-3">
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>

                <ul className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <StoreIcon className="size-4 shrink-0" />
                    <span className="truncate">
                      {order.vendor?.name ?? "Unknown restaurant"}
                    </span>
                  </li>

                  <li className="flex items-center gap-2">
                    <CalendarIcon className="size-4 shrink-0" />
                    <span>
                      Delivery: {formatDeliveryDate(order.deliveryDate)}
                    </span>
                  </li>

                  <li className="flex items-center gap-2 sm:col-span-2">
                    <MapPinIcon className="size-4 shrink-0" />
                    <span className="truncate">{order.deliveryAddress}</span>
                  </li>
                </ul>

                <p className="text-xs text-muted-foreground">
                  Requested on {formatRequestDate(order.createdAt)}
                </p>

                <OrderTimeline status={order.status} />

                <div className="mt-auto flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setViewing(order)}
                  >
                    <EyeIcon className="mr-1 size-4" />
                    View
                  </Button>

                  {order.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setCancelling(order)}
                    >
                      <XIcon className="mr-1 size-4" />
                      Cancel order
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <OrderDetailsDialog
        order={viewing}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
      />

      <Dialog
        open={cancelling !== null}
        onOpenChange={(open) => {
          if (!open && !cancelBusy) setCancelling(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this order?</DialogTitle>
            <DialogDescription>
              {cancelling?.item
                ? `Your order for "${cancelling.item.itemName}" will be cancelled. This cannot be undone.`
                : "This order will be cancelled. This cannot be undone."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={cancelBusy}
              onClick={() => setCancelling(null)}
            >
              Keep order
            </Button>

            <Button
              variant="destructive"
              disabled={cancelBusy}
              onClick={confirmCancel}
            >
              {cancelBusy && (
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
              )}
              {cancelBusy ? "Cancelling..." : "Cancel order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
