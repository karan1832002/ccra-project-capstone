import Link from "next/link";

// Footer navigation items. Add/remove entries here to update the nav bar
const navLinks = [
  { href: "/about-us", label: "About" },
  { href: "/schedule", label: "Schedule" },
  { href: "/events", label: "Events" },
  { href: "/results", label: "Results" },
  { href: "/about-us/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface py-10 px-6 text-body-text text-sm">
      <div className="flex flex-col items-center gap-4">

        {/* Brand */}
        <p className="text-heading-text font-semibold tracking-wide text-lg">
          Canadian Classic Rodeo Association
        </p>

        {/* Navigation */}
        <nav className="flex gap-8 font-medium">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-primary hover:underline underline-offset-4 transition">
              {label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-caption-text mt-4">
          © 2026 CCRA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
