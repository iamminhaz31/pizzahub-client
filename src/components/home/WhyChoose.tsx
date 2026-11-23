import Image from "next/image";
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
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <FadeIn className="relative isolate mx-auto w-full max-w-md lg:max-w-none">
          <div
            aria-hidden
            className="absolute -bottom-3 -right-3 -z-10 size-full rounded-3xl bg-primary/15"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
            <Image
              src="/images/why-choose.jpg"
              alt="A freshly baked pizza with melted cheese"
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 text-lg font-semibold text-white">
              Fresh from local kitchens, straight to your table.
            </p>
          </div>
        </FadeIn>

        <div>
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight">Why Choose PizzaHub?</h2>
            <p className="mt-2 text-muted-foreground">
              Everything you need to enjoy great pizza, in one place.
            </p>
          </FadeIn>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {REASONS.map((reason, index) => (
              <FadeIn key={reason.title} delay={index * 0.08} className="h-full">
                <div className="h-full rounded-xl border bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <span className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                    <reason.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{reason.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{reason.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}