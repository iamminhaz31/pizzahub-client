"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarIcon,
  CheckIcon,
  LoaderCircleIcon,
  MailIcon,
  MapPinIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
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
  type VendorOrder,
  type VendorOrdersResponse,
} from "@/lib/orders";

type FetchResult = {
  key: string;
  data?: VendorOrdersResponse;
  error?: string;
};

type PendingAction = {
  order: VendorOrder;
  status: "accepted" | "rejected";
};

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export function VendorOrders() {
  const [status, setStatus] = useState("all");
  const [reloadToken, setReloadToken] = useState(0);
  const [result, setResult] = useState<FetchResult | null>(null);
  const [action, setAction] = useState<PendingAction | null>(null);
  const [actionBusy, setActionBusy] = useState(false);

  const query = useMemo(
    () => (status === "all" ? "" : `?status=${status}`),
    [status]
  );
  const requestKey = `${query}#${reloadToken}`;

  useEffect(() => {
    let cancelled = false;
    apiFetch<VendorOrdersResponse>(`/api/orders/vendor${query}`)
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

  async function confirmAction() {
    if (!action) return;
    setActionBusy(true);
    try {
      const response = await apiFetch<{ message: string }>(
        `/api/orders/vendor/${action.order._id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action.status }),
        }
      );
      toast.success(response.message);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setActionBusy(false);
      setAction(null);
      reload();
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
            <Skeleton key={index} className="h-48 rounded-xl" />
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
              ? "No customer orders yet. Orders for your menu items will appear here."
              : "No orders match this filter."}
          </p>
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
                  <OrderStatusBadge status={order.status} />
                </div>

                <ul className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <UserIcon className="size-4 shrink-0" />
                    <span className="truncate">
                      {order.customer?.name ?? "Unknown customer"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <MailIcon className="size-4 shrink-0" />
                    <span className="truncate">{order.customer?.email ?? "-"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CalendarIcon className="size-4 shrink-0" />
                    <span>Delivery: {formatDeliveryDate(order.deliveryDate)}</span>
                  </li>
                  <li className="flex items-start gap-2 sm:col-span-2">
                    <MapPinIcon className="mt-0.5 size-4 shrink-0" />
                    <span className="whitespace-pre-wrap">
                      {order.deliveryAddress}
                    </span>
                  </li>
                </ul>

                <div className="rounded-lg bg-muted/40 p-3 text-sm">
                  <p className="text-xs text-muted-foreground">
                    Customer message
                  </p>
                  <p className="whitespace-pre-wrap">
                    {order.message || "No message"}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  Requested on {formatRequestDate(order.createdAt)}
                </p>

                {order.status === "pending" && (
                  <div className="mt-auto flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => setAction({ order, status: "accepted" })}
                    >
                      <CheckIcon className="mr-1 size-4" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setAction({ order, status: "rejected" })}
                    >
                      <XIcon className="mr-1 size-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog
        open={action !== null}
        onOpenChange={(open) => {
          if (!open && !actionBusy) setAction(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action?.status === "accepted"
                ? "Accept this order?"
                : "Reject this order?"}
            </DialogTitle>
            <DialogDescription>
              This can only be done once and cannot be undone. The customer will
              see the new status.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={actionBusy}
              onClick={() => setAction(null)}
            >
              Go back
            </Button>
            <Button
              variant={action?.status === "rejected" ? "destructive" : "default"}
              disabled={actionBusy}
              onClick={confirmAction}
            >
              {actionBusy && (
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
              )}
              {action?.status === "accepted" ? "Accept order" : "Reject order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}