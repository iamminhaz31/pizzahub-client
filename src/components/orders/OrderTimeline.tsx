
import {
  CheckCircle2,
  Circle,
  Clock3,
  XCircle,
} from "lucide-react";
import type { OrderStatus } from "@/lib/orders";

const STEPS = [
  {
    status: "pending",
    label: "Order Placed",
    description: "Your order has been submitted.",
  },
  {
    status: "accepted",
    label: "Vendor Accepted",
    description: "The vendor has accepted your order.",
  },
] as const;

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const rejected = status === "rejected";
  const cancelled = status === "cancelled";
  const terminal = rejected || cancelled;
  const accepted = status === "accepted";

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <h4 className="mb-4 text-sm font-semibold">Order Progress</h4>

      <div className="relative space-y-5">
        {STEPS.map((step, index) => {
          const completed = index === 0 || accepted;
          const current = index === 0 ? !accepted && !terminal : accepted;

          return (
            <div key={step.status} className="relative flex gap-3">
              {index === 0 && (
                <div
                  className={`absolute left-[11px] top-7 h-9 w-0.5 ${
                    accepted ? "bg-green-500" : "bg-border"
                  }`}
                />
              )}

              <div className="relative z-10 shrink-0">
                {completed ? (
                  <CheckCircle2
                    className={`size-6 ${
                      terminal && index === 1
                        ? "text-muted-foreground"
                        : "text-green-600"
                    }`}
                  />
                ) : current ? (
                  <Clock3 className="size-6 text-amber-500" />
                ) : (
                  <Circle className="size-6 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium">{step.label}</p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}

        {terminal && (
          <div className="flex gap-3">
            <XCircle
              className={`size-6 shrink-0 ${
                rejected ? "text-destructive" : "text-muted-foreground"
              }`}
            />
            <div>
              <p className="text-sm font-medium">
                {rejected ? "Order Rejected" : "Order Cancelled"}
              </p>
              <p className="text-xs text-muted-foreground">
                {rejected
                  ? "The vendor rejected this order."
                  : "This order has been cancelled."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
