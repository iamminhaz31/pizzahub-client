import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ItemDetails } from "@/components/menu/ItemDetails";
import { ItemDetailsSkeleton } from "@/components/menu/ItemDetailsSkeleton";
import type { Viewer } from "@/components/menu/OrderPanel";
import { getServerSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Item Details",
};

async function ItemDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Item Details is private: logged-out users go to Sign In and come back here.
  const session = await getServerSession();
  if (!session) {
    redirect(`/sign-in?next=${encodeURIComponent(`/menu/${id}`)}`);
  }
  if (session.user.isBlocked) {
    redirect("/blocked");
  }

  const role = String(session.user.role);
  const viewer: Viewer = {
    id: session.user.id,
    role: role === "vendor" || role === "admin" ? role : "customer",
  };

  return <ItemDetails id={id} viewer={viewer} />;
}

export default function ItemDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <Suspense fallback={<ItemDetailsSkeleton />}>
        <ItemDetailsContent params={params} />
      </Suspense>
    </div>
  );
}