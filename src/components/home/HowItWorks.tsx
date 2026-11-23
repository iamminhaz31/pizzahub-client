import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, CheckIcon, SearchIcon } from "lucide-react";

import { FadeIn } from "@/components/home/FadeIn";
import { Button } from "@/components/ui/button";

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
    <section className="relative isolate overflow-hidden py-16">
      <Image
        src="/images/how-it-works.jpg"
        alt=""
        fill
        unoptimized
        className="-z-20 object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/65 to-black/80"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <FadeIn className="mb-10 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight">How PizzaHub Works</h2>
          <p className="mt-2 text-white/80">Three easy steps to your next meal.</p>
        </FadeIn>

        <div className="relative grid gap-6 md:grid-cols-3">
          {/* Dashed line that joins the three steps on wide screens. */}
          <div
            aria-hidden
            className="absolute left-[16.67%] right-[16.67%] top-[3.25rem] hidden border-t-2 border-dashed border-white/40 md:block"
          />

          {STEPS.map((step, index) => (
            <FadeIn
              key={step.title}
              delay={index * 0.1}
              className="relative z-10 h-full"
            >
              <div className="h-full rounded-2xl border border-white/15 bg-black/45 p-6 text-center text-white shadow-lg backdrop-blur-sm">
                <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary text-primary-foreground ring-4 ring-white/20">
                  <step.icon className="size-7" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-white/80">{step.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-10 text-center">
          <Button asChild size="lg">
            <Link href="/menu">Browse the Menu</Link>
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}