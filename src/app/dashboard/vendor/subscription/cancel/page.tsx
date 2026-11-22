import Link from "next/link";
import { XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PaymentCancelPage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-lg rounded-xl border bg-card p-8 text-center">
        <XCircleIcon className="mx-auto size-12 text-amber-500" />
        <h1 className="mt-4 text-2xl font-bold">Payment cancelled</h1>
        <p className="mt-2 text-muted-foreground">
          You cancelled the payment, so nothing was charged. You can upgrade
          whenever you are ready.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/vendor/subscription">Back to Subscription</Link>
        </Button>
      </div>
    </div>
  );
}