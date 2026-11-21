"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  EyeIcon,
  LoaderCircleIcon,
  PauseIcon,
  PencilIcon,
  PlayIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MenuItemDetailsDialog } from "@/components/vendor/MenuItemDetailsDialog";
import { MenuItemForm } from "@/components/vendor/MenuItemForm";
import { MenuItemStatusBadge } from "@/components/vendor/MenuItemStatusBadge";
import { apiFetch } from "@/lib/api";
import {
  STATUS_FILTERS,
  menuItemToFormValues,
  type MenuItem,
  type MenuItemInput,
  type MyMenuItemsResponse,
} from "@/lib/menu-items";

const JSON_HEADERS = { "Content-Type": "application/json" };

type FetchResult = {
  key: string;
  data?: MyMenuItemsResponse;
  error?: string;
};

const STATUS_NOTES: Record<string, string> = {
  pending: "Waiting for admin approval.",
  rejected: "Rejected by admin. Edit it and it will be reviewed again.",
  inactive: "Paused. Customers cannot see this item.",
};

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

export function MenuItemsManager() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [reloadToken, setReloadToken] = useState(0);
  const [result, setResult] = useState<FetchResult | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<MenuItem | null>(null);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [deleting, setDeleting] = useState<MenuItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  // Wait a little after typing before asking the server.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (search) params.set("search", search);
    const text = params.toString();
    return text ? `?${text}` : "";
  }, [status, search]);

  const requestKey = `${query}#${reloadToken}`;

  useEffect(() => {
    let cancelled = false;
    apiFetch<MyMenuItemsResponse>(`/api/menu-items/mine${query}`)
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            error: errorMessage(error) || "Could not load your menu items.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [query, requestKey]);

  const data = result?.data;
  const loading = result?.key !== requestKey;
  const reload = () => setReloadToken((token) => token + 1);

  async function toggleAvailability(item: MenuItem) {
    const target = item.status === "approved" ? "inactive" : "approved";
    setBusyId(item._id);
    try {
      const response = await apiFetch<{ message: string }>(
        `/api/menu-items/mine/${item._id}/availability`,
        {
          method: "PATCH",
          headers: JSON_HEADERS,
          body: JSON.stringify({ status: target }),
        }
      );
      toast.success(response.message);
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusyId(null);
    }
  }

  async function handleEditSubmit(values: MenuItemInput) {
    if (!editing) return;
    const response = await apiFetch<{ message: string }>(
      `/api/menu-items/mine/${editing._id}`,
      {
        method: "PUT",
        headers: JSON_HEADERS,
        body: JSON.stringify({ ...values, price: Number(values.price) }),
      }
    );
    toast.success(response.message);
    setEditing(null);
    reload();
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      const response = await apiFetch<{ message: string }>(
        `/api/menu-items/mine/${deleting._id}`,
        { method: "DELETE" }
      );
      toast.success(response.message);
      setDeleting(null);
      reload();
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setDeleteBusy(false);
    }
  }

  const filtersActive = status !== "all" || search !== "";

  return (
    <div className="space-y-6">
      {data && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card px-4 py-3 text-sm">
          {data.plan.name === "premium" ? (
            <p>
              <span className="font-semibold">Premium plan</span>
              {" · "}Unlimited active items
            </p>
          ) : (
            <>
              <p>
                <span className="font-semibold">Free plan</span>
                {" · "}
                {data.plan.activeUsed} of {data.plan.maxActive} active items used
              </p>
              <Link
                href="/dashboard/vendor/subscription"
                className="font-medium text-primary hover:underline"
              >
                Upgrade to Premium
              </Link>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by item name"
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!result && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-80 rounded-xl" />
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

      {data && data.items.length === 0 && (
        <div className="rounded-xl border border-dashed p-10 text-center">
          <p className="font-medium">
            {filtersActive
              ? "No menu items match your filters."
              : "You have not added any menu items yet."}
          </p>
          {!filtersActive && (
            <Button asChild className="mt-4">
              <Link href="/dashboard/vendor/add-item">Add Menu Item</Link>
            </Button>
          )}
        </div>
      )}

      {data && data.items.length > 0 && (
        <div
          className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${
            loading ? "opacity-60 transition-opacity" : ""
          }`}
        >
          {data.items.map((item) => {
            const busy = busyId === item._id;
            return (
              <div
                key={item._id}
                className="flex h-full flex-col overflow-hidden rounded-xl border bg-card"
              >
                <div className="aspect-[4/3] bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.images[0]}
                    alt={item.itemName}
                    className="size-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 font-semibold">{item.itemName}</h3>
                    <MenuItemStatusBadge status={item.status} />
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>{item.category}</p>
                    <p>{item.location}</p>
                  </div>

                  <p className="text-lg font-bold text-primary">
                    ${item.price.toFixed(2)}
                  </p>

                  <p className="min-h-5 text-xs text-muted-foreground">
                    {STATUS_NOTES[item.status] ?? ""}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setViewing(item)}
                    >
                      <EyeIcon className="mr-1 size-4" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => setEditing(item)}
                    >
                      <PencilIcon className="mr-1 size-4" />
                      Edit
                    </Button>
                    {(item.status === "approved" ||
                      item.status === "inactive") && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => toggleAvailability(item)}
                      >
                        {busy ? (
                          <LoaderCircleIcon className="mr-1 size-4 animate-spin" />
                        ) : item.status === "approved" ? (
                          <PauseIcon className="mr-1 size-4" />
                        ) : (
                          <PlayIcon className="mr-1 size-4" />
                        )}
                        {item.status === "approved" ? "Pause" : "Resume"}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      onClick={() => setDeleting(item)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2Icon className="mr-1 size-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MenuItemDetailsDialog
        item={viewing}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
      />

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
            <DialogDescription>
              If you change the details, an admin will review the item again
              before customers can see it.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <MenuItemForm
              key={editing._id}
              initialValues={menuItemToFormValues(editing)}
              submitLabel="Save Changes"
              onSubmit={handleEditSubmit}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open && !deleteBusy) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this menu item?</DialogTitle>
            <DialogDescription>
              {deleting
                ? `"${deleting.itemName}" will be removed permanently. This cannot be undone.`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={deleteBusy}
              onClick={() => setDeleting(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteBusy}
              onClick={confirmDelete}
            >
              {deleteBusy && (
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
              )}
              {deleteBusy ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}