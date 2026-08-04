/**
 * Shared Tailwind utility strings used by more than one component.
 */

export const pageStructure = {
  sectionWrapper: "py-20 border-t border-border",

  eyebrowLabel:
    "uppercase tracking-[0.18em] text-xs font-semibold text-muted-foreground mb-3",

  sectionHeading: "text-4xl font-semibold text-heading",
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
