export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-300 bg-white py-10 px-6 text-stone-700 text-sm">
      <div className="flex flex-col items-center gap-3">

        <p className="text-stone-900 font-semibold tracking-wide">
          Canadian Classic Rodeo Association
        </p>

        <div className="flex gap-6 text-stone-700">
          <a href="/about-us" className="hover:text-orange-600 hover:underline underline-offset-4 transition">
            About
          </a>
          <a href="/schedule" className="hover:text-orange-600 hover:underline underline-offset-4 transition">
            Schedule
          </a>
          <a href="/events" className="hover:text-orange-600 hover:underline underline-offset-4 transition">
            Events
          </a>
          <a href="/results" className="hover:text-orange-600 hover:underline underline-offset-4 transition">
            Results
          </a>
          <a href="/about-us/contact-information" className="hover:text-orange-600 hover:underline underline-offset-4 transition">
            Contact
          </a>
        </div>

        <p className="text-xs text-stone-500 mt-4">
          © 2024 CCRA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
