import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-primary sm:text-5xl">
        Hot &amp; Fresh Pizza Delivered to Your Door
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Discover local pizza shops, browse their menus and order your favorite
        pizza in a few clicks.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/menu">Explore Pizza Menu</Link>
      </Button>
    </section>
  );
}