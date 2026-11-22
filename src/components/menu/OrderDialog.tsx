"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";
import type { PublicMenuItem } from "@/lib/browse-menu";
import {
  emptyOrder,
  getDeliveryDateRange,
  validateOrderInput,
  type OrderErrors,
  type OrderInput,
} from "@/lib/orders";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

function OrderForm({
  item,
  onDone,
}: {
  item: PublicMenuItem;
  onDone: () => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<OrderInput>(emptyOrder);
  const [errors, setErrors] = useState<OrderErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { min, max } = getDeliveryDateRange();

  function setField<K extends keyof OrderInput>(key: K, value: OrderInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validateOrderInput(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiFetch<{ message: string }>("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item._id, ...values }),
      });
      toast.success(result.message);
      onDone();
      router.push("/dashboard/customer/orders");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not place the order. Please try again."
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      <div className="rounded-lg border bg-muted/40 p-3 text-sm">
        <p className="font-semibold">{item.itemName}</p>
        <p className="text-muted-foreground">
          ${item.price.toFixed(2)} · Sold by{" "}
          {item.vendor.businessName || item.vendor.name}
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="deliveryDate">Delivery Date</Label>
        <Input
          id="deliveryDate"
          type="date"
          min={min}
          max={max}
          value={values.deliveryDate}
          onChange={(event) => setField("deliveryDate", event.target.value)}
          disabled={submitting}
        />
        <FieldError message={errors.deliveryDate} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="deliveryAddress">Delivery Address</Label>
        <Textarea
          id="deliveryAddress"
          rows={3}
          value={values.deliveryAddress}
          onChange={(event) => setField("deliveryAddress", event.target.value)}
          placeholder="House, road, area and city"
          disabled={submitting}
        />
        <FieldError message={errors.deliveryAddress} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Additional Message (optional)</Label>
        <Textarea
          id="message"
          rows={3}
          value={values.message}
          onChange={(event) => setField("message", event.target.value)}
          placeholder="Special instructions for the restaurant"
          disabled={submitting}
        />
        <FieldError message={errors.message} />
      </div>

      <p className="text-sm text-muted-foreground">
        No online payment is needed. The restaurant will confirm your order.
      </p>

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting && <LoaderCircleIcon className="mr-2 size-4 animate-spin" />}
        {submitting ? "Placing order..." : "Place Order"}
      </Button>
    </form>
  );
}

export function OrderDialog({ item }: { item: PublicMenuItem }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button size="lg" className="w-full" onClick={() => setOpen(true)}>
        Order Now
      </Button>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Place your order</DialogTitle>
          <DialogDescription>
            Tell us when and where you want your food delivered.
          </DialogDescription>
        </DialogHeader>
        <OrderForm item={item} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}