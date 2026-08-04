/**
 * Shared Tailwind utility strings used by more than one component.
 */

/**
 * pageStructure
 * ─────────────
 * How these tokens nest on a typical page:
 *
 *   pageWrapper                                   (full page: bg + text color + min-height)
 *   ├─ <Hero />                                    (full-bleed, sits OUTSIDE contentContainer)
 *   └─ contentContainer                            (centers + width-caps everything below Hero)
 *      ├─ firstSectionWrapper                      (lead-in section, no top border)
 *      │  └─ ...page-specific layout (e.g. layout.twoColumnGrid)
 *      │     ├─ eyebrowLabel + sectionHeading      (small caps label + h2)
 *      │     └─ body content
 *      │
 *      ├─ sectionWrapper                           (every section after the first — adds border-t divider)
 *      │  ├─ eyebrowLabel + sectionHeading
 *      │  └─ body content, optionally wrapped in:
 *      │     └─ contentPanel                       (bordered/surface box grouping content inside a section)
 *      │
 *      └─ sectionWrapper                           (repeat per section)
 *         └─ ...
 *
 * Rule of thumb:
 * - pageWrapper:       once per page, outermost.
 * - contentContainer:  once per page, wraps everything except Hero.
 * - firstSectionWrapper vs sectionWrapper: only the section directly under
 *   Hero uses firstSectionWrapper (no border-t); every section after that
 *   uses sectionWrapper.
 * - eyebrowLabel / sectionHeading: pair together at the top of most sections.
 * - contentPanel: optional, used when a section needs a visually distinct
 *   box within it (e.g. a process list or a closing CTA), not for every section.
 */

export const pageStructure = {
  pageWrapper: "min-h-screen bg-background text-foreground transition-colors",

  contentContainer: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12",

  sectionWrapper: "py-20 border-t border-border",

  firstSectionWrapper: "py-20",

  eyebrowLabel:
    "uppercase tracking-[0.18em] text-xs font-semibold text-muted-foreground mb-3",

  sectionHeading: "text-4xl font-semibold text-heading",

  contentPanel: "bg-surface rounded-md border border-border p-12",
};

export const layout = {
  twoColumnGrid: "grid lg:grid-cols-2 gap-16 items-center",
};

export const buttons = {
  primaryButton:
    "inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover",

  secondaryButton:
    "inline-flex items-center justify-center rounded-md border border-border bg-surface px-8 py-3 text-sm font-semibold text-foreground transition hover:bg-muted-foreground",

  iconButton:
    "inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition hover:bg-highlight hover:text-heading",

  iconButtonHighlight:
    "inline-flex h-10 w-10 items-center justify-center rounded-md text-accent-foreground transition hover:bg-highlight",
};
