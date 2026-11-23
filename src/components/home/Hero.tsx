"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckIcon, ClockIcon, ShieldCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const HIGHLIGHTS = [
  "No online payment needed",
  "Verified local restaurants",
  "Simple order tracking",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-red-100 dark:from-[#2a1710] dark:via-[#1a1210] dark:to-[#3a1414]">
      {/* Soft background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-0 size-80 rounded-full bg-orange-300/30 blur-3xl dark:bg-orange-500/10"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          <p className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Local pizza shops, one place
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Hot &amp; Fresh Pizza Delivered to Your Door
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Browse menus from local restaurants, pick your favorites and order in
            a few clicks. Fresh from the oven to your doorstep.
          </p>
          <Button asChild size="lg">
            <Link href="/menu">Explore Pizza Menu</Link>
          </Button>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-sm text-muted-foreground">
            {HIGHLIGHTS.map((text) => (
              <li key={text} className="flex items-center gap-1.5">
                <CheckIcon className="size-4 text-primary" />
                {text}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="relative mx-auto w-full max-w-md"
        >
          <div className="relative aspect-square overflow-hidden rounded-full border-8 border-white/80 shadow-2xl dark:border-white/10">
            <Image
              src="/images/hero-pizza.jpg"
              alt="A freshly baked pizza"
              fill
              priority
              sizes="(min-width: 768px) 28rem, 90vw"
              className="object-cover"
            />
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-2 bottom-10 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-lg sm:-left-6"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <ShieldCheckIcon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Verified restaurants</p>
              <p className="text-xs text-muted-foreground">
                Reviewed before listing
              </p>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-2 top-8 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-lg sm:-right-4"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <ClockIcon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Pick your date</p>
              <p className="text-xs text-muted-foreground">
                Order up to 30 days ahead
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}