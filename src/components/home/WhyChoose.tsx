import { ClockIcon, PizzaIcon, ShieldCheckIcon, StoreIcon } from "lucide-react";

import { FadeIn } from "@/components/home/FadeIn";

const REASONS = [
  {
    icon: PizzaIcon,
    title: "Fresh and tasty",
    text: "Every item comes from a local restaurant and is reviewed before it appears on the menu.",
  },
  {
    icon: StoreIcon,
    title: "Local restaurants",
    text: "Support the pizza shops in your area and discover new favorites near you.",
  },
  {
    icon: ClockIcon,
    title: "Quick and simple ordering",
    text: "Choose a delivery date, add your address and order. No online payment needed.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Trusted platform",
    text: "Verified restaurants, secure sign in and clear order tracking from start to finish.",
  },
];

export function WhyChoose() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
      <FadeIn className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Why Choose PizzaHub?</h2>
        <p className="mt-2 text-muted-foreground">
          Everything you need to enjoy great pizza, in one place.
        </p>
      </FadeIn>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {REASONS.map((reason, index) => (
          <FadeIn key={reason.title} delay={index * 0.08} className="h-full">
            <div className="h-full rounded-xl border bg-card p-6 text-center shadow-sm">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                <reason.icon className="size-6" />
              </span>
              <h3 className="mt-4 font-semibold">{reason.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{reason.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}