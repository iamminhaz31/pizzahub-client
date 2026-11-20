import Link from "next/link";
import { PizzaIcon } from "lucide-react";

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary/40 px-4 py-10">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 text-2xl font-bold text-primary"
      >
        <PizzaIcon className="size-7" />
        PizzaHub
      </Link>

      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <div className="mt-6">{children}</div>
      </div>

      <div className="mt-6 text-sm text-muted-foreground">{footer}</div>
    </main>
  );
}