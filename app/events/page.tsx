import Image from "next/image";
import Link from "next/link";
import {
  ClipboardList,
  Users,
  Shuffle,
  FileCheck2,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Hero from "@/components/ui/Hero";
import { pageStructure, buttons } from "@/lib/styles";

// One card per Events submenu item (see the header nav). Update this array
// if a submenu item is renamed, added, or removed so the cards stay in sync
// with the nav links.
const eventLinks = [
  {
    href: "/events/enter-rodeo",
    icon: ClipboardList,
    title: "Enter Rodeo",
    description:
      "Sign up for the events you're competing in at an upcoming rodeo before entries close.",
  },
  {
    href: "/events/current-entries",
    icon: Users,
    title: "Current Entries",
    description:
      "See who's entered in each event at upcoming rodeos, updated as competitors sign up.",
  },
  {
    href: "/events/rodeo-draws",
    icon: Shuffle,
    title: "Rodeo Draws",
    description:
      "Check the draw sheets to see the running order for each event before you head to the arena.",
  },
  {
    href: "/events/rodeo-approval",
    icon: FileCheck2,
    title: "Rodeo Approval Form",
    description:
      "Interested in hosting a rodeo? Submit an approval request for our committee to review.",
  },
  {
    href: "/events/rulebook",
    icon: BookOpen,
    title: "Rulebook",
    description:
      "Find the current rules, bylaws, and the form to propose a rule change.",
  },
];

// Ordered walkthrough of the competitor journey, rendered in the
// "From Entry to Arena" section below. Keep these in chronological order —
// the numbering is meaningful, not just decorative.
const steps = [
  {
    step: "1",
    title: "Find a rodeo",
    description:
      "Browse the season on the Schedule page to see where and when each rodeo is being held. Every stop lists its location, dates, and the events on the card, so you can plan your season around the ones that fit.",
  },
  {
    step: "2",
    title: "Enter your events",
    description:
      "Head to Enter Rodeo to sign up for the events you want to compete in. Entries open ahead of each rodeo and close on a set date, so get your paperwork in early to lock in your spot.",
  },
  {
    step: "3",
    title: "Check who's in",
    description:
      "Visit Current Entries to see the full field of competitors for each event at the rodeos you're headed to. It's a good way to scout the competition and confirm your own entry went through.",
  },
  {
    step: "4",
    title: "Get your draw",
    description:
      "Once entries close, Rodeo Draws shows the order you'll compete in for each event. Draw sheets go up as soon as they're finalized, so check back in the days leading up to the rodeo.",
  },
  {
    step: "5",
    title: "Compete",
    description:
      "Show up ready to go, in the order set by the draw sheet, and give it your best run. Your results feed straight into the standings, carrying you forward through the rest of the season.",
  },
];

// Top-level landing page for the "Events" nav item. Gives an overview of
// how rodeos/events work and links out to each Events submenu page
// (Enter Rodeo, Current Entries, Rodeo Draws, Rodeo Approval Form, Rulebook).
export default function EventsPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
      {/* ================= HERO ================= */}
      <Hero
        badge="GATE TO GATE"
        title="Rodeo Events"
        description="Everything you need to find a rodeo, enter your events, and see how you stack up against the field."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* ================= OVERVIEW =================
            Intro copy explaining the rodeo/event relationship (a season
            contains many rodeos, each rodeo contains many events), with
            primary CTAs to Schedule and Enter Rodeo. */}
        <div className="grid lg:grid-cols-2 gap-16 py-20 items-center">
          <div>
            <div className={pageStructure.eyebrowLabel}>
              HOW IT WORKS
            </div>
            <h2 className={`${pageStructure.sectionHeading} mb-8`}>
              A Season Full of Rodeos
            </h2>

            <div className="prose prose-stone text-stone-600 space-y-6 text-lg dark:prose-invert dark:text-stone-300">
              <p>
                Throughout the season, the CCRA hosts rodeos across the province, and each
                rodeo brings together a full slate of individual events — from the roughstock
                events to timed events and everything in between.
              </p>
              <p>
                Competitors can browse this season's full lineup on the Schedule page, then
                use the tools below to enter, track entries, and check draw sheets for each
                rodeo they're headed to.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4">
              <Link
                href="/schedule"
                className={buttons.primaryButton}
              >
                View 2026 Schedule
              </Link>
              <Link
                href="/events/enter-rodeo"
                className={buttons.secondaryButton}
              >
                Enter a Rodeo
              </Link>
            </div>
          </div>

          {/* Visual: image + overlay caption. */}
          <div className="relative rounded-md shadow-sm overflow-hidden aspect-[16/10] bg-stone-200 dark:bg-stone-800">
            <Image
              src="/images/ccraevents.jpg"
              alt="Competitor entering the arena at a Canadian Classic Rodeo event"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <div className="text-sm uppercase tracking-widest opacity-75">
                Rodeos This Season
              </div>
              <div className="text-3xl font-semibold">See the Full Schedule</div>
            </div>
          </div>
        </div>

        {/* ================= EVENT TOOLS =================
            Card grid, one per Events submenu item. Sourced from the
            eventLinks array above — add/remove items there rather than
            editing this markup directly. */}
        <div className={pageStructure.sectionWrapper}>
          <div className="text-center mb-16">
            <div className={pageStructure.eyebrowLabel}>
              MANAGE YOUR SEASON
            </div>
            <h2 className={pageStructure.sectionHeading}>
              Everything In One Place
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* icon is renamed to Icon (capitalized) so it can be rendered as a component */}
            {eventLinks.map(({ href, icon: Icon, title, description }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-md border border-stone-200 bg-white p-8 shadow-sm hover:shadow-lg transition dark:border-stone-700 dark:bg-stone-900"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-stone-950 mb-3 dark:text-stone-100">
                  {title}
                </h3>
                <p className="text-stone-600 mb-4 dark:text-stone-300">{description}</p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                  Go to {title}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ================= PROCESS =================
            Step-by-step walkthrough from finding a rodeo to competing.
            List is rendered from the steps array above. */}
        <div className={pageStructure.sectionWrapper}>
          <div className="text-center mb-16">
            <div className={pageStructure.eyebrowLabel}>
              THE PROCESS
            </div>
            <h2 className={pageStructure.sectionHeading}>
              From Entry to Arena
            </h2>
          </div>

          <div className="bg-white rounded-md border border-stone-200 p-12 dark:border-stone-700 dark:bg-stone-900">
            <div className="max-w-3xl mx-auto space-y-12">
              {steps.map(({ step, title, description }) => (
                <div key={step} className="flex gap-8">
                  <div className="w-28 flex-shrink-0 text-right">
                    <div className="font-semibold text-orange-600 dark:text-orange-400">
                      Step {step}
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-stone-950 dark:text-stone-100">
                      {title}
                    </div>
                    <p className="text-stone-600 mt-1 dark:text-stone-300">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RULEBOOK TEASER =================
            Closing call-to-action pointing to the Rulebook submenu page. */}
        <div className={pageStructure.sectionWrapper}>
          <div className="text-center mb-16">
            <div className={pageStructure.eyebrowLabel}>
              BEFORE YOU COMPETE
            </div>
            <h2 className={pageStructure.sectionHeading}>
              Know the Rules
            </h2>
          </div>

          <div className="bg-white rounded-md border border-stone-200 p-12 dark:border-stone-700 dark:bg-stone-900">
            <div className="max-w-md mx-auto text-center">
              <p className="text-stone-600 mb-8 dark:text-stone-300">
                The Rulebook page has the current rules and our bylaws — everything you need to
                compete with confidence.
              </p>
              <Link
                href="/events/rulebook"
                className={buttons.primaryButton}
              >
                View the Rulebook
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}