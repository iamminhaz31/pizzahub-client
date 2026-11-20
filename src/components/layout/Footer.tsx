import Link from "next/link";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import { FaFacebookF, FaGithub, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { siteConfig } from "@/lib/site";
import { Logo } from "@/components/layout/Logo";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Menu", href: "/menu" },
  { label: "Sign In", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
];

const socialLinks = [
  { label: "X", href: siteConfig.social.x, icon: FaXTwitter },
  { label: "Facebook", href: siteConfig.social.facebook, icon: FaFacebookF },
  { label: "Instagram", href: siteConfig.social.instagram, icon: FaInstagram },
  { label: "GitHub", href: siteConfig.social.github, icon: FaGithub },
];

export function Footer() {
  return (
    <footer className="border-t bg-secondary/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border bg-background text-foreground/70 transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold">Contact Us</h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-primary" />
              {siteConfig.contact.address}
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="size-4 shrink-0 text-primary" />
              {siteConfig.contact.phone}
            </li>
            <li className="flex items-center gap-2">
              <MailIcon className="size-4 shrink-0 text-primary" />
              {siteConfig.contact.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6 lg:px-8">
          &copy; {siteConfig.copyrightYear} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}