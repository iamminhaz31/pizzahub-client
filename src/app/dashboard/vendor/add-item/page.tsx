import { AddMenuItemForm } from "@/components/vendor/AddMenuItemForm";

export default function AddMenuItemPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Menu Item</h1>
        <p className="text-muted-foreground">
          New items are reviewed by an admin before they appear on the menu.
        </p>
      </div>
      <AddMenuItemForm />
    </div>
  );
}