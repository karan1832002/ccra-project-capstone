/**
 * Hero Component
 *
 * A reusable hero/header section for pages across the website.
 * Displays an optional badge above a page title and description.
 *
 * Props:
 * - badge (optional): Small label displayed above the title.
 * - title: Main heading for the page.
 * - description: Short paragraph describing the page.
 */

interface HeroProps {
  // Optional text displayed as a badge above the title.
  badge?: string;

  // Main page heading.
  title: string;

  // Supporting text displayed below the title.
  description: string;
}

export default function Hero({
  badge,
  title,
  description,
}: HeroProps) {
  return (
    // Hero section with centered content and a bottom border.
    <section className="text-center py-20 border-b border-stone-200 dark:border-stone-800">

      {/* Only render the badge if one is provided. */}
      {badge && (
        <div className="inline-flex items-center justify-center rounded-md bg-orange-50 px-4 py-1 text-sm font-semibold text-orange-600 mb-6 dark:bg-orange-950/40 dark:text-orange-400">
          {badge}
        </div>
      )}

      {/* Page title */}
      <h1 className="text-5xl font-semibold tracking-tight text-stone-950 mb-6 dark:text-stone-100">
        {title}
      </h1>

      {/* Short page description */}
      <p className="max-w-2xl mx-auto text-xl text-stone-600 dark:text-stone-300">
        {description}
      </p>
    </section>
  );
}