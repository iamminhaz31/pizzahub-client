"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { MenuGridSkeleton } from "@/components/menu/MenuGridSkeleton";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SORT_OPTIONS,
  fetchPublic,
  isSortValue,
  type BrowseResponse,
  type SortValue,
} from "@/lib/browse-menu";
import { MENU_CATEGORIES } from "@/lib/menu-items";

type FetchResult = {
  key: string;
  data?: BrowseResponse;
  error?: string;
};

export function MenuBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const location = searchParams.get("location") ?? "";
  const rawSort = searchParams.get("sort") ?? "";
  const sort: SortValue = isSortValue(rawSort) ? rawSort : "newest";
  const page = Math.max(
    1,
    Number.parseInt(searchParams.get("page") ?? "1", 10) || 1
  );

  const [searchInput, setSearchInput] = useState(search);
  const [locations, setLocations] = useState<string[]>([]);
  const [result, setResult] = useState<FetchResult | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // Changes one or more filters in the URL. The page resets to 1 unless set.
  const setParams = useCallback(
    (changes: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(changes)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (!("page" in changes)) params.delete("page");
      const text = params.toString();
      router.replace(text ? `${pathname}?${text}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  // Wait a little after typing before changing the URL.
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      if (trimmed !== search) setParams({ search: trimmed || null });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, search, setParams]);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    if (sort !== "newest") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    const text = params.toString();
    return text ? `?${text}` : "";
  }, [search, category, location, sort, page]);

  const requestKey = `${query}#${reloadToken}`;

  useEffect(() => {
    let cancelled = false;
    fetchPublic<BrowseResponse>(`/api/menu-items${query}`)
      .then((data) => {
        if (!cancelled) setResult({ key: requestKey, data });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setResult({
            key: requestKey,
            error:
              error instanceof Error
                ? error.message
                : "Could not load menu items.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [query, requestKey]);

  // The location list is loaded once.
  useEffect(() => {
    let cancelled = false;
    fetchPublic<{ locations: string[] }>("/api/menu-items/locations")
      .then((data) => {
        if (!cancelled) setLocations(data.locations);
      })
      .catch(() => {
        // The filter simply stays empty if this fails.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const data = result?.data;
  const loading = result?.key !== requestKey;
  const filtersActive =
    search !== "" || category !== "" || location !== "" || sort !== "newest";

  function clearFilters() {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  }

  function goToPage(nextPage: number) {
    setParams({ page: nextPage > 1 ? String(nextPage) : null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search pizzas, sides, drinks or restaurants"
            className="pl-9"
            aria-label="Search menu items"
          />
        </div>

        <Select
          value={category || "all"}
          onValueChange={(value) =>
            setParams({ category: value === "all" ? null : value })
          }
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

        <Select
          value={location || "all"}
          onValueChange={(value) =>
            setParams({ location: value === "all" ? null : value })
          }
        >
          <SelectTrigger className="w-full" aria-label="Filter by location">
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(value) =>
            setParams({ sort: value === "newest" ? null : value })
          }
        >
          <SelectTrigger className="w-full" aria-label="Sort items">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!result && <MenuGridSkeleton />}

      {result?.error && !data && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-medium text-destructive">{result.error}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setReloadToken((token) => token + 1)}
            >
              Try again
            </Button>
            {filtersActive && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </div>
      )}

      {data && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            {data.pagination.total}{" "}
            {data.pagination.total === 1 ? "item" : "items"} found
          </p>
          {filtersActive && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {data && data.items.length === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="text-lg font-semibold">No menu items found</p>
          <p className="mt-1 text-muted-foreground">
            {filtersActive
              ? "Try a different search or clear your filters."
              : "No items are available right now. Please check back soon."}
          </p>
          {filtersActive && (
            <Button className="mt-4" onClick={clearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      )}

      {data && data.items.length > 0 && (
        <div
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${
            loading ? "opacity-60 transition-opacity" : ""
          }`}
        >
          {data.items.map((item) => (
            <MenuItemCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {data && data.pagination.totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-3"
          aria-label="Pagination"
        >
          <Button
            variant="outline"
            disabled={page <= 1 || loading}
            onClick={() => goToPage(page - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= data.pagination.totalPages || loading}
            onClick={() => goToPage(page + 1)}
          >
            Next
          </Button>
        </nav>
      )}
    </div>
  );
}