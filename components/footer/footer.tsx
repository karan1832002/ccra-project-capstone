export default function Footer() {
  return (
    <footer className="mt-12 border-t border-stone-200 pt-6 pb-4 text-stone-600 text-sm">
      <div className="flex flex-col items-center gap-2">
        <p className="text-stone-700 font-medium">
          Canadian Classic Rodeo Association
        </p>

        <div className="flex gap-4 text-stone-600">
          <a href="/about-us" className="hover:text-orange-600 transition">About</a>
          <a href="/schedule" className="hover:text-orange-600 transition">Schedule</a>
          <a href="/events" className="hover:text-orange-600 transition">Events</a>
          <a href="/results" className="hover:text-orange-600 transition">Results</a>
          <a href="/about-us/contact-information" className="hover:text-orange-600 transition">Contact</a>
        </div>

        <p className="text-xs text-stone-500 mt-2">
          © 2024 CCRA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
