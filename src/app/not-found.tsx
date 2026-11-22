
import Link from "next/link";
import { Home, Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 rounded-full bg-primary/10 p-6">
        <Pizza className="size-12 text-primary" />
      </div>

      <p className="text-sm font-semibold uppercase tracking-widest text-primary">
        Error 404
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        Page Not Found
      </h1>

      <p className="mt-3 max-w-md text-muted-foreground">
        Sorry, the page you are looking for does not exist or may have been moved.
      </p>

      <Button asChild className="mt-8">
        <Link href="/">
          <Home className="mr-2 size-4" />
          Back to Home
        </Link>
      </Button>
    </main>
  );
}
