export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export type OrderItemSummary = {
  _id: string;
  itemName: string;
  category: string;
  price: number;
  image: string | null;
};

export type CustomerOrder = {
  _id: string;
  itemId: string;
  vendorId: string;
  customerId: string;
  status: OrderStatus;
  deliveryDate: string;
  deliveryAddress: string;
  message: string;
  createdAt: string;
  updatedAt: string | null;
  item: OrderItemSummary | null;
  vendor: { name: string; image: string | null } | null;
};

export type OrderCounts = {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
};

export type MyOrdersResponse = {
  orders: CustomerOrder[];
  counts: OrderCounts;
};

export const ORDER_STATUS_FILTERS = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export const ORDER_STATUS_NOTES: Record<OrderStatus, string> = {
  pending: "Waiting for the restaurant to respond.",
  accepted: "The restaurant accepted your order.",
  rejected: "The restaurant could not accept this order.",
  cancelled: "You cancelled this order.",
};

export const MAX_DELIVERY_DAYS_AHEAD = 30;

export type OrderInput = {
  deliveryDate: string;
  deliveryAddress: string;
  message: string;
};

export type OrderErrors = Partial<Record<keyof OrderInput, string>>;

export const emptyOrder: OrderInput = {
  deliveryDate: "",
  deliveryAddress: "",
  message: "",
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

// Local date as YYYY-MM-DD (the format of <input type="date">).
function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getDeliveryDateRange() {
  const today = new Date();
  const last = new Date(today);
  last.setDate(last.getDate() + MAX_DELIVERY_DAYS_AHEAD);
  return { min: toDateInputValue(today), max: toDateInputValue(last) };
}

// Same rules as the server validator. The server is still the final check.
export function validateOrderInput(values: OrderInput): OrderErrors {
  const errors: OrderErrors = {};
  const { min, max } = getDeliveryDateRange();

  if (!values.deliveryDate) {
    errors.deliveryDate = "Please choose a delivery date.";
  } else if (values.deliveryDate < min || values.deliveryDate > max) {
    errors.deliveryDate = `Choose a date from today up to ${MAX_DELIVERY_DAYS_AHEAD} days ahead.`;
  }

  const address = values.deliveryAddress.trim();
  if (address.length < 10 || address.length > 200) {
    errors.deliveryAddress = "Delivery address must be 10 to 200 characters.";
  }

  if (values.message.trim().length > 500) {
    errors.message = "Message must be 500 characters or less.";
  }

  return errors;
}

// "2026-11-25" -> "Wed, Nov 25, 2026" (built from the parts, so no time zone shift).
export function formatDeliveryDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRequestDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}