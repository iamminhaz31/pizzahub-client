import Link from "next/link";
import { PizzaIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-2xl font-bold text-primary",
        className
      )}
    >
      <PizzaIcon className="size-7" />
      <span>PizzaHub</span>
    </Link>
  );
}