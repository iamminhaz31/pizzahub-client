import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/orders";

const STATUS_STYLES: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "border-amber-300 bg-amber-100 text-amber-800",
  },
  accepted: {
    label: "Accepted",
    className: "border-green-300 bg-green-100 text-green-800",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-300 bg-red-100 text-red-800",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-stone-300 bg-stone-100 text-stone-700",
  },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <Badge variant="outline" className={style.className}>
      {style.label}
    </Badge>
  );
}