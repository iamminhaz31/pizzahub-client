import { Badge } from "@/components/ui/badge";
import type { MenuItemStatus } from "@/lib/menu-items";

const STATUS_STYLES: Record<MenuItemStatus, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "border-amber-300 bg-amber-100 text-amber-800",
  },
  approved: {
    label: "Approved",
    className: "border-green-300 bg-green-100 text-green-800",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-300 bg-red-100 text-red-800",
  },
  inactive: {
    label: "Paused",
    className: "border-stone-300 bg-stone-100 text-stone-700",
  },
};

export function MenuItemStatusBadge({ status }: { status: MenuItemStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <Badge variant="outline" className={style.className}>
      {style.label}
    </Badge>
  );
}