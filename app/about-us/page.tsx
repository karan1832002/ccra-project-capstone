"use client";
import Image from "next/image";
import { HandCoins, Trophy, HeartHandshake } from "lucide-react";
import Hero from "@/components/ui/Hero";
import { useSession } from "@/lib/auth-client";
import { pageStructure, layout, buttons, cards } from "@/lib/styles";

const values = [
  {
    icon: HeartHandshake,
    title: "Heritage & Tradition",
    description:
      "Honoring the rich history and traditions of Canadian rodeo while creating new memories for future generations.",
  },
  {
    icon: Trophy,
    title: "Competition & Growth",
    description:
      "Providing fair, safe, and exciting competition for athletes at every stage of their rodeo journey.",
  },
  {
    icon: HandCoins,
    title: "Community & Family",
    description:
      "Building lasting friendships and supporting one another both in and out of the arena.",
  },
];

export default function AboutUsPage() {
  const { data: session } = useSession();
  return (
    <div className={pageStructure.pageWrapper}>
      {/* ================= HERO ================= */}
      <Hero
        badge="EST. 1985"
        title="About the CCRA"
        description="Celebrating 41 years of preserving Western heritage through competitive rodeo for athletes of all ages and skill levels."
      />

      <div className={pageStructure.contentContainer}>
        {/* ================= MISSION / HISTORY ================= */}
        <div
          className={`${pageStructure.firstSectionWrapper} ${layout.twoColumnGrid}`}
        >
          <div>
            <div className={pageStructure.eyebrowLabel}>OUR STORY</div>
            <h2 className={`${pageStructure.sectionHeading} mb-8`}>
              A Legacy of Western Spirit
            </h2>

            <div className="prose max-w-none space-y-6 text-lg text-body-text dark:prose-invert">
              <p>
                The Canadian Classic Rodeo Association (formerly the Canadian
                Senior Pro Rodeo Association) was founded in 1985 to provide
                competitive rodeo opportunities for athletes aged 40 and older.
              </p>
              <p>
                Today, the CCRA welcomes competitors of all ages and skill
                levels — from beginners to seasoned professionals — united by
                their passion for the sport, appreciation of Western values, and
                commitment to excellence.
              </p>
              <p>
                For over four decades, we have championed the traditions of
                rodeo while fostering community, sportsmanship, and the Western
                lifestyle across Canada.
              </p>
            </div>

            <div className="mt-10 flex items-center gap-4">
              {!session && (
                <a href="/sign-up" className={buttons.primaryButton}>
                  Join the CCRA
                </a>
              )}

              <a href="/schedule" className={buttons.secondaryButton}>
                View 2026 Schedule
              </a>
            </div>
          </div>

          {/* Visual */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-surface shadow-sm">
            <Image
              src="/images/ccralineup.jpg"
              alt="Canadian Classic Rodeo action"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <div className="text-sm uppercase tracking-widest opacity-75">
                41st Anniversary Season
              </div>
              <div className="text-3xl font-semibold">2026</div>
            </div>
          </div>
        </div>

        {/* ================= VALUES ================= */}
        <div className={pageStructure.sectionWrapper}>
          <div className="text-center mb-16">
            <div className={pageStructure.eyebrowLabel}>OUR VALUES</div>
            <h2 className={pageStructure.sectionHeading}>What Drives Us</h2>
          </div>

          <div className={cards.grid}>
            {values.map(({ icon: Icon, title, description }) => (
              <div key={title} className={cards.layout}>
                <div className={cards.iconContainer}>
                  <Icon className={cards.icon} />
                </div>
                <h3 className={cards.title}>{title}</h3>
                <p className={cards.description}>{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ================= TIMELINE ================= */}
        <div
          className={`${pageStructure.sectionWrapper} ${pageStructure.contentPanel}`}
        >
          <h2 className="mb-12 text-center text-3xl font-semibold text-heading-text">
            Our Journey
          </h2>

          <div className="max-w-3xl mx-auto space-y-12">
            <div className="flex gap-8">
              <div className="w-28 flex-shrink-0 text-right">
                <div className="font-semibold text-accent-text">1985</div>
              </div>
              <div>
                <div className="font-semibold text-heading-text">
                  Foundation
                </div>
                <p className="mt-1 text-body-text">
                  Established as the Canadian Senior Pro Rodeo Association to
                  serve mature competitors.
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="w-28 flex-shrink-0 text-right">
                <div className="font-semibold text-accent-text">2000s</div>
              </div>
              <div>
                <div className="font-semibold text-heading-text">Expansion</div>
                <p className="mt-1 text-body-text">
                  Grew to include all skill levels and introduced new events.
                </p>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="w-28 flex-shrink-0 text-right">
                <div className="font-semibold text-accent-text">2025-2026</div>
              </div>
              <div>
                <div className="font-semibold text-heading-text">
                  Modern Era
                </div>
                <p className="mt-1 text-body-text">
                  Rebranded to Canadian Classic Rodeo Association. 41st
                  anniversary season with exciting new initiatives and continued
                  growth.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= LEADERSHIP TEASER ================= */}
        <div className={`${pageStructure.sectionWrapper} text-center`}>
          <div className="max-w-md mx-auto">
            <h2 className="mb-4 text-3xl font-semibold text-heading-text">
              Led by Passionate Volunteers
            </h2>
            <p className="mb-8 text-body-text">
              Our board and committees are made up of dedicated rodeo
              enthusiasts who give their time to keep the spirit of the CCRA
              alive.
            </p>
            <a
              href="/about-us/board-of-directors"
              className={buttons.primaryButton}
            >
              Meet Our Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
