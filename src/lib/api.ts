import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// The token lives only in memory (never in localStorage).
let cachedToken: { value: string; expiresAt: number } | null = null;

function readExpiry(token: string): number {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(part)) as { exp?: number };
    return payload.exp ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

async function getToken(forceRefresh = false): Promise<string | null> {
  // Reuse the token until 30 seconds before it expires.
  if (!forceRefresh && cachedToken && cachedToken.expiresAt - 30_000 > Date.now()) {
    return cachedToken.value;
  }

  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    cachedToken = null;
    return null;
  }

  cachedToken = { value: data.token, expiresAt: readExpiry(data.token) };
  return data.token;
}

export function clearApiToken() {
  cachedToken = null;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const token = await getToken(isRetry);

  if (!token) {
    throw new ApiError("Please sign in to continue.", 401);
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);

  // The token may have just expired: fetch a fresh one and try once more.
  if (response.status === 401 && !isRetry) {
    return apiFetch<T>(path, options, true);
  }

  if (!response.ok) {
    throw new ApiError(
      data?.message || "Something went wrong. Please try again.",
      response.status
    );
  }

  return data as T;
}