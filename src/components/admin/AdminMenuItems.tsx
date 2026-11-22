"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckIcon,
  EyeIcon,
  LoaderCircleIcon,
  PauseIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Pagination } from "@/components/admin/Pagination";
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
import { MenuItemStatusBadge } from "@/components/vendor/MenuItemStatusBadge";
import { apiFetch } from "@/lib/api";
import {
  getErrorMessage,
  type AdminMenuItem,
  type AdminMenuItemsResponse,
} from "@/lib/admin";
import { MENU_CATEGORIES } from "@/lib/menu-items";
import { useApiData } from "@/lib/use-api-data";

const STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "inactive", label: "Inactive" },
] as const;

type TargetStatus = "approved" | "rejected" | "inactive";

export function AdminMenuItems() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<AdminMenuItem | null>(null);
  const [deleting, setDeleting] = useState<AdminMenuItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const path = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    if (category !== "all") params.set("category", category);
    if (page > 1) params.set("page", String(page));
    const text = params.toString();
    return `/api/admin/menu-items${text ? `?${text}` : ""}`;
  }, [search, status, category, page]);

  const { data, error, loading, ready, reload } =
    useApiData<AdminMenuItemsResponse>(path);

  async function changeStatus(item: AdminMenuItem, target: TargetStatus) {
    setBusyId(item._id);
    try {
      const response = await apiFetch<{ message: string }>(
        `/api/admin/menu-items/${item._id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: target }),
        }
      );
      toast.success(response.message);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
      reload();
    }
  }

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      const response = await apiFetch<{ message: string; cancelledOrders: number }>(
        `/api/admin/menu-items/${deleting._id}`,
        { method: "DELETE" }
      );
      toast.success(
        response.cancelledOrders > 0
          ? `${response.message} ${response.cancelledOrders} active order(s) were cancelled.`
          : response.message
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleteBusy(false);
      setDeleting(null);
      reload();
    }
  }

  const filtersActive = search !== "" || status !== "all" || category !== "all";

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by item or vendor"
            className="pl-9"
            aria-label="Search menu items"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full" aria-label="Filter by status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((filter) => {
              const count =
                data && filter.value !== "all"
                  ? ` (${data.counts[filter.value]})`
                  : data
                    ? ` (${data.counts.total})`
                    : "";
              return (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                  {count}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full" aria-label="Filter by category">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {MENU_CATEGORIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!ready && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-96 rounded-xl" />
          ))}
        </div>
      )}

      {ready && !data && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="font-medium text-destructive">
            {error ?? "Could not load menu items."}
          </p>
          <Button variant="outline" className="mt-4" onClick={reload}>
            Try again
          </Button>
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-xl border border-dashed p-10 text-center font-medium">
          {filtersActive
            ? "No menu items match your filters."
            : "No menu items have been submitted yet."}
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
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.images[0]}
                    alt={item.itemName}
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-1 font-semibold">{item.itemName}</h3>
                    <MenuItemStatusBadge status={item.status} />
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      {item.category} · {item.location}
                    </p>
                    <p className="truncate">
                      By {item.vendor?.businessName || item.vendor?.name || "Unknown vendor"}
                    </p>
                    <p className="truncate text-xs">{item.vendor?.email ?? ""}</p>
                  </div>

                  <p className="text-lg font-bold text-primary">
                    ${item.price.toFixed(2)}
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
                    {item.status !== "approved" && (
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() => changeStatus(item, "approved")}
                      >
                        {busy ? (
                          <LoaderCircleIcon className="mr-1 size-4 animate-spin" />
                        ) : (
                          <CheckIcon className="mr-1 size-4" />
                        )}
                        Approve
                      </Button>
                    )}
                    {item.status !== "rejected" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        className="text-destructive hover:text-destructive"
                        onClick={() => changeStatus(item, "rejected")}
                      >
                        <XIcon className="mr-1 size-4" />
                        Reject
                      </Button>
                    )}
                    {item.status === "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => changeStatus(item, "inactive")}
                      >
                        <PauseIcon className="mr-1 size-4" />
                        Set inactive
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busy}
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleting(item)}
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

      {data && (
        <Pagination
          pagination={data.pagination}
          loading={loading}
          onPage={(next) => {
            setPage(next);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      <MenuItemDetailsDialog
        item={viewing}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
      />

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
                ? `"${deleting.itemName}" will be removed permanently. Any pending or accepted orders for it will be cancelled.`
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