import Image from "next/image";
import Link from "next/link";
import { ListOrdered, BarChart3, Crown, ArrowRight } from "lucide-react";
import Hero from "@/components/ui/Hero";
import { pageStructure, layout, buttons } from "@/lib/styles";

// One card per Results submenu item (see the header nav). Update this array
// if a submenu item is renamed, added, or removed so the cards stay in sync
// with the nav links.
const resultLinks = [
  {
    href: "/results/rodeo-results",
    icon: ListOrdered,
    title: "Rodeo Results",
    description:
      "See how each completed rodeo played out, then open the full results for a rodeo to see every event.",
  },
  {
    href: "/results/standings",
    icon: BarChart3,
    title: "Standings",
    description:
      "Track total points and rankings for every competitor across all events so far this season.",
  },
  {
    href: "/results/past-champions",
    icon: Crown,
    title: "Past Champions",
    description:
      "Look back at the top competitor in each event from previous seasons.",
  },
];

// Three-stage flow from a single rodeo's results to a year-end champion.
// The order is meaningful: it mirrors how a result actually moves through
// the system (posted -> tallied -> crowned), and lines up with the order
// of the resultLinks cards above.
const flow = [
  {
    step: "1",
    title: "Results are posted",
    description:
      "After each rodeo, results go up event by event. Rodeo Results has the highlights for every completed rodeo, with a link through to the full breakdown.",
  },
  {
    step: "2",
    title: "Points add up",
    description:
      "Every placing earns points toward the season standings. Standings shows the running total and current rank for every competitor across all events.",
  },
  {
    step: "3",
    title: "Champions are crowned",
    description:
      "At the end of the season, the competitor on top of each event's standings becomes that year's champion. Past Champions keeps the record of who's won, year over year.",
  },
];

// Top-level landing page for the "Results" nav item. Gives an overview of
// how rodeo results, standings, and past champions relate, and links out
// to each Results submenu page (Rodeo Results, Standings, Past Champions).
export default function ResultsPage() {
  return (
    <div className={pageStructure.pageWrapper}>
      {/* ================= HERO ================= */}
      <Hero
        badge="POINTS & PLACINGS"
        title="Results"
        description="Follow the season from rodeo to rodeo, see where everyone stands, and look back at the champions who came before."
      />

      <div className={pageStructure.contentContainer}>
        {/* ================= OVERVIEW =================
            Intro copy explaining how a single rodeo's results feed into
            the season standings and, eventually, the record of past
            champions. Pairs with primary CTAs into Rodeo Results and
            Standings. */}
        <div
          className={`${pageStructure.firstSectionWrapper} ${layout.twoColumnGrid}`}
        >
          <div>
            <div className={`${pageStructure.eyebrowLabel} mb-4`}>
              OUR RECORD
            </div>
            <h2 className={`${pageStructure.sectionHeading} mb-8`}>
              Every Run Counted
            </h2>

            <div className="prose text-foreground space-y-6 text-lg">
              <p>
                Every rodeo on the schedule adds to the story of the season. As
                soon as a rodeo wraps up, its results are posted event by event,
                and those placings carry straight through to the season-long
                standings.
              </p>
              <p>
                Use the tools below to check how a specific rodeo went, see
                where competitors rank across the full season, or look back at
                the champions from years past.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/results/rodeo-results"
                className={buttons.primaryButton}
              >
                View Rodeo Results
              </Link>
              <Link
                href="/results/standings"
                className={buttons.secondaryButton}
              >
                See Standings
              </Link>
            </div>
          </div>

          {/* Visual: image + overlay caption. */}
          <div className="relative rounded-md shadow-sm overflow-hidden aspect-[16/10] bg-background">
            <Image
              src="/images/ccraresults.jpg"
              alt="Competitor celebrating a result at a Canadian Classic Rodeo event"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <div className="text-sm uppercase tracking-widest opacity-75">
                Season Standings
              </div>
              <div className="text-3xl font-semibold">See Where You Rank</div>
            </div>
          </div>
        </div>

        {/* ================= RESULTS TOOLS =================
            Card grid, one per Results submenu item. Sourced from the
            resultLinks array above — add/remove items there rather than
            editing this markup directly. */}
        <div className={pageStructure.sectionWrapper}>
          <div className="text-center mb-16">
            <div className="{pageStructure.eyebrowLabel}">CHECK THE RECORD</div>
            <h2 className={pageStructure.sectionHeading}>
              Everything In One Place
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* icon is renamed to Icon (capitalized) so it can be rendered as a component */}
            {resultLinks.map(({ href, icon: Icon, title, description }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-md border border-border bg-surface p-8 shadow-sm hover:shadow-lg transition"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-heading mb-3">
                  {title}
                </h3>
                <p className="text-foreground mb-4">
                  {description}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Go to {title}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ================= FLOW =================
            Explains how a result on a single day turns into a season
            standing and, eventually, a spot in the record books.
            List is rendered from the flow array above. */}
        <div className={pageStructure.sectionWrapper}>
          <div className="text-center mb-16">
            <div className="{pageStructure.eyebrowLabel}">HOW IT ADDS UP</div>
            <h2 className={pageStructure.sectionHeading}>
              From Results to Records
            </h2>
          </div>

          <div className={pageStructure.contentPanel}>
            <div className="max-w-3xl mx-auto space-y-12">
              {flow.map(({ step, title, description }) => (
                <div key={step} className="flex gap-8">
                  <div className="w-28 flex-shrink-0 text-right">
                    <div className="font-semibold text-primary">
                      Step {step}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-heading">
                      {title}
                    </div>
                    <p className="text-foreground mt-1">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= PAST CHAMPIONS TEASER =================
            Closing call-to-action pointing to the Past Champions submenu page. */}
        <div className={pageStructure.sectionWrapper}>
          <div className="text-center mb-16">
            <div className="{pageStructure.eyebrowLabel}">THE RECORD BOOKS</div>
            <h2 className={pageStructure.sectionHeading}>
              Champions, Year After Year
            </h2>
          </div>

          <div className={pageStructure.contentPanel}>
            <div className="max-w-md mx-auto text-center">
              <p className="text-foreground mb-8">
                Past Champions has the top competitor in every event category
                from previous seasons — a running record of who's stood at the
                top of the CCRA.
              </p>
              <Link
                href="/results/past-champions"
                className={buttons.primaryButton}
              >
                View Past Champions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
