
import { apiFetch } from "@/lib/api";


export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  businessName: string | null;
};


export type ProfileUpdateData = {
  name?: string;
  image?: string | null;
  businessName?: string;
};

export async function updateProfile(data: ProfileUpdateData) {
  return apiFetch<{ message: string; user: ProfileUser }>(
    "/api/profile",
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );
}
