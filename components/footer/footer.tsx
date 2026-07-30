import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-300 bg-white py-10 px-6 text-stone-700 text-sm">
      <div className="flex flex-col items-center gap-3">

        <p className="text-stone-900 font-semibold tracking-wide">
          Canadian Classic Rodeo Association
        </p>

        <div className="flex gap-6 text-stone-700">
          <Link href="/about-us" className="hover:text-orange-600 hover:underline underline-offset-4 transition">
            About
          </Link>
          <Link href="/schedule" className="hover:text-orange-600 hover:underline underline-offset-4 transition">
            Schedule
          </Link>
          <Link href="/events/current-entries" className="hover:text-orange-600 hover:underline underline-offset-4 transition">
            Events
          </Link>
          <Link href="/results/rodeo-results" className="hover:text-orange-600 hover:underline underline-offset-4 transition">
            Results
          </Link>
          <Link href="/about-us/contact" className="hover:text-orange-600 hover:underline underline-offset-4 transition">
            Contact
          </Link>
        </div>

        <p className="text-xs text-stone-500 mt-4">
          © 2024 CCRA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
