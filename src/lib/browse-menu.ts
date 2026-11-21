export type PublicMenuItem = {
  _id: string;
  vendorId: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  createdAt: string;
  vendor: {
    _id: string;
    name: string;
    businessName: string | null;
    image: string | null;
    isPremium: boolean;
  };
};

export type BrowseResponse = {
  items: PublicMenuItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function isSortValue(value: string): value is SortValue {
  return SORT_OPTIONS.some((option) => option.value === value);
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Plain fetch for public endpoints. No login token is needed here.
export async function fetchPublic<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`);
  } catch {
    throw new Error(
      "Could not reach the server. Please check your connection and try again."
    );
  }

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Something went wrong. Please try again.");
  }
  return data as T;
}