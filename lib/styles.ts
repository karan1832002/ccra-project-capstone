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
  pageWrapper: "min-h-screen bg-background text-body-text transition-colors",

  contentContainer: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12",

  sectionWrapper: "py-20 border-t border-border",

  firstSectionWrapper: "pt-8 pb-20",

  eyebrowLabel:
    "uppercase tracking-[0.18em] text-xs font-semibold text-caption-text mb-3",

  sectionHeading: "text-4xl font-semibold text-heading-text",

  contentPanel: "bg-surface rounded-md border border-border p-12",
};

export const layout = {
  twoColumnGrid: "grid md:grid-cols-2 gap-16 items-center",
};

export const buttons = {
  primaryButton:
    "inline-flex px-5 py-2.5 items-center gap-2 justify-center rounded-md bg-primary text-sm font-semibold text-primary-text transition hover:bg-primary-dark disabled:hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40",

  secondaryButton:
    "inline-flex px-5 py-2.5 items-center gap-2 justify-center rounded-md border border-border bg-surface text-sm font-semibold text-body-text transition hover:bg-accent disabled:hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40",

  iconButton:
    "inline-flex h-10 w-10 items-center justify-center rounded-md text-body-text transition hover:bg-highlight hover:text-heading-text",

  iconButtonHighlight:
    "inline-flex h-10 w-10 items-center justify-center rounded-md text-accent-text transition hover:bg-highlight",
};

export const cards = {
  grid: "grid sm:grid-cols-2 lg:grid-cols-3 gap-8",
  layout: "text-left p-8 rounded-md border border-border bg-surface",
  interactive:
    "shadow-sm transition duration-200 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
  iconContainer:
    "w-12 h-12 mb-6 items-center justify-center text-2xl font-semibold rounded-md bg-accent flex text-accent-text",
  icon: "h-6 w-6",
  title: "mb-3 text-2xl font-semibold text-heading-text",
  description: "mb-4 text-body-text",
  link: "inline-flex items-center gap-2 text-sm font-semibold text-primary",
  arrow: "h-4 w-4 transition group-hover:translate-x-1",
};

export const inputField = {
  label: "block mb-2 text-sm font-medium text-body-text",
  input: "px-4 w-full rounded-md border border-input-border bg-input-field text-sm text-input-field-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition placeholder:text-caption-text",
  readOnly: "read-only:bg-disabled read-only:text-disabled-text",
  inputHeight: "h-12",
  textBoxHeight: "py-3 resize-y"
};
