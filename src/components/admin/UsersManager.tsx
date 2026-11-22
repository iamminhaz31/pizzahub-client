"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BanIcon,
  EyeIcon,
  LoaderCircleIcon,
  SearchIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Pagination } from "@/components/admin/Pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch } from "@/lib/api";
import {
  formatDate,
  getErrorMessage,
  type AdminUser,
  type AdminUserDetails,
  type AdminUsersResponse,
} from "@/lib/admin";
import { useApiData } from "@/lib/use-api-data";

const ROLE_FILTERS = [
  { value: "all", label: "All roles" },
  { value: "customer", label: "Customers" },
  { value: "vendor", label: "Vendors" },
  { value: "admin", label: "Admins" },
];

function UserAvatar({ user }: { user: AdminUser }) {
  return (
    <Avatar className="size-9">
      {user.image && <AvatarImage src={user.image} alt={user.name} />}
      <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

function UserDetailsBody({ id }: { id: string }) {
  const { data, error, ready } = useApiData<AdminUserDetails>(
    `/api/admin/users/${id}`
  );

  if (!ready) return <Skeleton className="h-48 rounded-lg" />;
  if (!data) {
    return (
      <p className="text-sm text-destructive">
        {error ?? "Could not load this user."}
      </p>
    );
  }

  const { user, stats } = data;
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <UserAvatar user={user} />
        <div className="min-w-0">
          <p className="truncate font-semibold">{user.name}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Role</dt>
          <dd className="font-medium capitalize">{user.role}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Account status</dt>
          <dd className="font-medium">{user.isBlocked ? "Blocked" : "Active"}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Joined</dt>
          <dd className="font-medium">{formatDate(user.createdAt)}</dd>
        </div>
        {user.role === "vendor" && (
          <>
            <div>
              <dt className="text-muted-foreground">Business name</dt>
              <dd className="font-medium">{user.businessName ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Plan</dt>
              <dd className="font-medium capitalize">{user.subscriptionPlan}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Plan expires</dt>
              <dd className="font-medium">
                {formatDate(user.subscriptionExpiresAt)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Menu items</dt>
              <dd className="font-medium">{stats.menuItems ?? 0}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Orders received</dt>
              <dd className="font-medium">{stats.ordersReceived ?? 0}</dd>
            </div>
          </>
        )}
        {user.role === "customer" && (
          <div>
            <dt className="text-muted-foreground">Orders placed</dt>
            <dd className="font-medium">{stats.ordersPlaced ?? 0}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

export function UsersManager() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [blockTarget, setBlockTarget] = useState<AdminUser | null>(null);
  const [blockBusy, setBlockBusy] = useState(false);

  // Wait a little after typing before asking the server.
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
    if (role !== "all") params.set("role", role);
    if (page > 1) params.set("page", String(page));
    const text = params.toString();
    return `/api/admin/users${text ? `?${text}` : ""}`;
  }, [search, role, page]);

  const { data, error, loading, ready, reload } =
    useApiData<AdminUsersResponse>(path);

  async function confirmBlock() {
    if (!blockTarget) return;
    setBlockBusy(true);
    try {
      const response = await apiFetch<{ message: string }>(
        `/api/admin/users/${blockTarget._id}/block`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ blocked: !blockTarget.isBlocked }),
        }
      );
      toast.success(response.message);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBlockBusy(false);
      setBlockTarget(null);
      reload();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by name or email"
            className="pl-9"
            aria-label="Search users"
          />
        </div>
        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-48" aria-label="Filter by role">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_FILTERS.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!ready && <Skeleton className="h-80 rounded-xl" />}

      {ready && !data && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="font-medium text-destructive">
            {error ?? "Could not load users."}
          </p>
          <Button variant="outline" className="mt-4" onClick={reload}>
            Try again
          </Button>
        </div>
      )}

      {data && (
        <>
          <p className="text-sm text-muted-foreground">
            {data.pagination.total}{" "}
            {data.pagination.total === 1 ? "user" : "users"} found
          </p>

          {data.users.length === 0 ? (
            <div className="rounded-xl border border-dashed p-10 text-center font-medium">
              No users match your search.
            </div>
          ) : (
            <div
              className={`overflow-x-auto rounded-xl border bg-card ${
                loading ? "opacity-60 transition-opacity" : ""
              }`}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} />
                          <div className="min-w-0">
                            <p className="truncate font-medium">{user.name}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>
                        {user.role === "vendor" ? (
                          <Badge
                            variant="outline"
                            className={
                              user.subscriptionPlan === "premium"
                                ? "border-amber-300 bg-amber-100 text-amber-800"
                                : ""
                            }
                          >
                            {user.subscriptionPlan === "premium"
                              ? "Premium"
                              : "Free"}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            user.isBlocked
                              ? "border-red-300 bg-red-100 text-red-800"
                              : "border-green-300 bg-green-100 text-green-800"
                          }
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDetailsId(user._id)}
                          >
                            <EyeIcon className="mr-1 size-4" />
                            Details
                          </Button>
                          {user.role !== "admin" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className={
                                user.isBlocked
                                  ? ""
                                  : "text-destructive hover:text-destructive"
                              }
                              onClick={() => setBlockTarget(user)}
                            >
                              {user.isBlocked ? (
                                <ShieldCheckIcon className="mr-1 size-4" />
                              ) : (
                                <BanIcon className="mr-1 size-4" />
                              )}
                              {user.isBlocked ? "Unblock" : "Block"}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Pagination
            pagination={data.pagination}
            loading={loading}
            onPage={(next) => {
              setPage(next);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </>
      )}

      <Dialog
        open={detailsId !== null}
        onOpenChange={(open) => {
          if (!open) setDetailsId(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User details</DialogTitle>
            <DialogDescription>Account information and activity.</DialogDescription>
          </DialogHeader>
          {detailsId && <UserDetailsBody key={detailsId} id={detailsId} />}
        </DialogContent>
      </Dialog>

      <Dialog
        open={blockTarget !== null}
        onOpenChange={(open) => {
          if (!open && !blockBusy) setBlockTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {blockTarget?.isBlocked ? "Unblock this user?" : "Block this user?"}
            </DialogTitle>
            <DialogDescription>
              {blockTarget?.isBlocked
                ? `${blockTarget.name} will be able to sign in and use the platform again.`
                : `${blockTarget?.name ?? "This user"} will be signed out everywhere and cannot sign in or use protected features until you unblock them.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              disabled={blockBusy}
              onClick={() => setBlockTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant={blockTarget?.isBlocked ? "default" : "destructive"}
              disabled={blockBusy}
              onClick={confirmBlock}
            >
              {blockBusy && (
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
              )}
              {blockTarget?.isBlocked ? "Unblock" : "Block user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}