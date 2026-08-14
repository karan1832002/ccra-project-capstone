import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface py-10 px-6 text-foreground text-sm">
      <div className="flex flex-col items-center gap-4">

        {/* Brand */}
        <p className="text-heading font-semibold tracking-wide text-lg">
          Canadian Classic Rodeo Association
        </p>

        {/* Navigation */}
        <nav className="flex gap-8 font-medium">
          <Link
            href="/about-us"
            className="hover:text-orange-600 hover:underline underline-offset-4 transition"
          >
            About
          </Link>
          <Link
            href="/schedule"
            className="hover:text-orange-600 hover:underline underline-offset-4 transition"
          >
            Schedule
          </Link>
          <Link
            href="/events"
            className="hover:text-orange-600 hover:underline underline-offset-4 transition"
          >
            Events
          </Link>
          <Link
            href="/results"
            className="hover:text-orange-600 hover:underline underline-offset-4 transition"
          >
            Results
          </Link>
          <Link
            href="/about-us/contact"
            className="hover:text-orange-600 hover:underline underline-offset-4 transition"
          >
            Contact
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground mt-4">
          © 2026 CCRA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
