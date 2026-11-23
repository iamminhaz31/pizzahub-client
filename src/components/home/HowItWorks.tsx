import { CalendarIcon, CheckIcon, SearchIcon } from "lucide-react";

import { FadeIn } from "@/components/home/FadeIn";

const STEPS = [
  {
    icon: SearchIcon,
    title: "1. Find your pizza",
    text: "Search and filter the menu by category, location and price.",
  },
  {
    icon: CalendarIcon,
    title: "2. Place your order",
    text: "Pick a delivery date, add your address and send the order.",
  },
  {
    icon: CheckIcon,
    title: "3. Enjoy it hot",
    text: "The restaurant accepts your order and gets it ready for you.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-orange-50/60 py-14 dark:bg-muted/40">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <FadeIn className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">How PizzaHub Works</h2>
          <p className="mt-2 text-muted-foreground">Three easy steps to your next meal.</p>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <FadeIn key={step.title} delay={index * 0.1} className="h-full">
              <div className="h-full rounded-xl border bg-card p-6 text-center shadow-sm">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary text-primary-foreground">
                  <step.icon className="size-7" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}