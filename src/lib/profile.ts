import { apiFetch } from "@/lib/api";

export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  businessName: string | null;
  phone: string | null;
  area: string | null;
  address: string | null;
  description: string | null;
};

export type ProfileUpdateData = {
  name?: string;
  image?: string | null;
  businessName?: string;
  phone?: string | null;
  area?: string | null;
  address?: string | null;
  description?: string | null;
};

// Same rule as the server: 01XXXXXXXXX, optionally with +88 or 88 in front.
export const PHONE_PATTERN = /^(?:\+?88)?01[3-9]\d{8}$/;

export async function updateProfile(data: ProfileUpdateData) {
  return apiFetch<{ message: string; user: ProfileUser }>("/api/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}