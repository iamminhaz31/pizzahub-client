"use client";

import { toast } from "sonner";

import { MenuItemForm } from "@/components/vendor/MenuItemForm";
import { apiFetch } from "@/lib/api";
import type { MenuItemInput } from "@/lib/menu-items";

export function AddMenuItemForm() {
  async function handleSubmit(values: MenuItemInput) {
    const result = await apiFetch<{ message: string }>("/api/menu-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, price: Number(values.price) }),
    });
    toast.success(result.message);
  }

  return (
    <MenuItemForm
      submitLabel="Submit for Approval"
      resetOnSuccess
      onSubmit={handleSubmit}
    />
  );
}