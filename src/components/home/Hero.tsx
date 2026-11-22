"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

function PizzaIllustration() {
  const pepperoni = [
    [100, 70],
    [140, 110],
    [70, 130],
    [125, 150],
    [95, 105],
    [150, 70],
    [80, 80],
  ];
  return (
    <svg viewBox="0 0 220 220" className="size-full" role="img" aria-label="A hot pizza">
      <circle cx="110" cy="110" r="104" fill="#d97706" />
      <circle cx="110" cy="110" r="92" fill="#fbbf24" />
      <circle cx="110" cy="110" r="80" fill="#c8102e" opacity="0.9" />
      <circle cx="110" cy="110" r="74" fill="#fde68a" />
      {pepperoni.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x + 10} cy={y + 10} r="12" fill="#b91c1c" />
      ))}
      {[
        [130, 130],
        [90, 150],
        [150, 100],
        [60, 100],
      ].map(([x, y]) => (
        <circle key={`o-${x}-${y}`} cx={x} cy={y} r="5" fill="#16a34a" />
      ))}
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-100 via-amber-50 to-red-100">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="mx-auto aspect-square w-full max-w-sm"
        >
          <PizzaIllustration />
        </motion.div>
      </div>
    </section>
  );
}