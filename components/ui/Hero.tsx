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
    <section className="text-center py-20 border-b border-border">

      {/* Only render the badge if one is provided. */}
      {badge && (
        <div className="inline-flex items-center justify-center rounded-md bg-accent/40 px-4 py-1 text-sm font-semibold text-accent-text mb-6">
          {badge}
        </div>
      )}

      {/* Page title */}
      <h1 className="text-5xl font-semibold tracking-tight text-heading-text mb-6">
        {title}
      </h1>

      {/* Short page description */}
      <p className="max-w-2xl mx-auto text-xl text-body-text">
        {description}
      </p>
    </section>
  );
}