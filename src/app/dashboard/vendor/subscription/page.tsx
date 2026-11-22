import { SubscriptionPanel } from "@/components/vendor/SubscriptionPanel";

export default function SubscriptionPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="text-muted-foreground">
          Upgrade to Premium to publish unlimited menu items and get featured
          on the homepage.
        </p>
      </div>
      <SubscriptionPanel />
    </div>
  );
}