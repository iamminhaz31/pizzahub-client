"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";

type State<T> = { key: string; data?: T; error?: string };

// Loads data from the Express API. The old data stays visible while new data loads.
export function useApiData<T>(path: string) {
  const [reloadToken, setReloadToken] = useState(0);
  const [state, setState] = useState<State<T> | null>(null);
  const key = `${path}#${reloadToken}`;

  useEffect(() => {
    let cancelled = false;
    apiFetch<T>(path)
      .then((data) => {
        if (!cancelled) setState({ key, data });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState((previous) => ({
            key,
            data: previous?.data,
            error:
              error instanceof Error
                ? error.message
                : "Something went wrong. Please try again.",
          }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, [path, key]);

  return {
    data: state?.data,
    error: state && state.key === key ? state.error : undefined,
    loading: !state || state.key !== key,
    ready: state !== null,
    reload: () => setReloadToken((token) => token + 1),
  };
}