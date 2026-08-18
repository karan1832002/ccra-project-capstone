"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import ImageCarousel, { CarouselImage } from "@/components/ui/ImageCarousel";
import SponsorsCarousel from "@/components/ui/SponsorsCarousel";
import NewsletterCard from "@/components/ui/NewsletterCard";
import { getPublishedNewsletters } from "@/app/(admin)/admin/newsletters/actions";
import type { NewsletterRow } from "@/app/(admin)/admin/newsletters/actions";
import { getVisibleSponsors } from "@/app/(admin)/admin/sponsors/actions";
import type { SponsorRow } from "@/app/(admin)/admin/sponsors/actions";
import {
  Calendar,
  ShoppingCart,
  Trophy,
  Camera,
  ArrowRight,
} from "lucide-react";
import { pageStructure, buttons } from "@/lib/styles";

const heroImages: CarouselImage[] = [
  {
    src: "/images/barrelracer.jpg",
    alt: "Barrel Racer",
  },
  {
    src: "/images/steerwrestling.jpg",
    alt: "Steer wrestling at CCRA",
  },
  {
    src: "/images/barrelracing.jpg",
    alt: "Barrel racing at CCRA",
  },
];



export default function HomePage() {
  const { data: session } = useSession();

  // --- Published Newsletter Fetch ---
  // Calls getPublishedNewsletters() on mount in the browser. The result
  // is an array of NewsletterRow objects from the database, filtered to
  // published = true and ordered newest-first. Falls back to an empty
  // array on error so the empty state renders instead of crashing.
  const [newsletterItems, setNewsletterItems] = useState<NewsletterRow[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  const [sponsorItems, setSponsorItems] = useState<SponsorRow[]>([]);
  const [sponsorLoading, setSponsorLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getPublishedNewsletters(),
      getVisibleSponsors(),
    ])
      .then(([news, sponsors]) => {
        if (!cancelled) {
          setNewsletterItems(news);
          setSponsorItems(sponsors);
          setNewsLoading(false);
          setSponsorLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNewsletterItems([]);
          setSponsorItems([]);
          setNewsLoading(false);
          setSponsorLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={pageStructure.pageWrapper}>
      {/* ================= HERO ================= */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md bg-accent/40 px-4 py-1 text-sm font-semibold text-accent-text mb-6">
                EST. 1985 • 41ST ANNIVERSARY
              </div>

              <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight text-heading-text leading-tight">
                Canadian Classic
                <br />
                Rodeo Association
              </h1>

              <p className="mt-6 text-xl text-body-text max-w-lg leading-relaxed">
                Preserving Western heritage through competitive rodeo for
                athletes of all ages and skill levels.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                {!session && (
                  <Link
                    href="/sign-up"
                    className={buttons.primaryButton}
                  >
                    Join the CCRA
                  </Link>
                )}
              </div>
            </div>

            <div className="relative">
              <ImageCarousel
                images={heroImages}
                autoPlay
                interval={5000}
                showCaptions
                aspectRatio="video"
                className="shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK LINKS ================= */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                href: "/schedule",
                icon: Calendar,
                label: "Schedule",
                desc: "2026 Events",
              },
              {
                href: "/store",
                icon: ShoppingCart,
                label: "Store",
                desc: "CCRA Merchandise",
              },
              {
                href: "/results/standings",
                icon: Trophy,
                label: "Standings",
                desc: "Current Rankings",
              },
              {
                href: "/about-us/photo-gallery",
                icon: Camera,
                label: "Gallery",
                desc: "Photo Moments",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col items-center text-center p-6 rounded-md border border-border bg-background transition hover:border-highlight hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-md bg-accent flex items-center justify-center text-accent-text mb-4 group-hover:bg-highlight transition dark:bg-accent/40">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-heading-text">
                  {item.label}
                </span>
                <span className="text-sm text-body-text mt-1">
                  {item.desc}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SPONSORS ================= */}
      <section className="py-10 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <div className="uppercase tracking-[0.18em] text-xs font-semibold text-caption-text mb-2">
              SUPPORTING THE CCRA
            </div>
            <h2 className="text-2xl font-semibold text-heading-text">
              Our Sponsors
            </h2>
            <p className="mt-2 text-sm text-body-text max-w-xl mx-auto">
              Thank you to the businesses and individuals who help keep classic
              rodeo alive in Canada.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <SponsorsCarousel
              sponsors={
                sponsorLoading
                  ? []
                  : sponsorItems.map((s) => ({
                    id: s.id,
                    src: s.logo ?? "",
                    alt: s.name,
                    href: s.website ?? undefined,
                  }))
              }
              autoPlay
              interval={3500}
            />
          </div>

          <div className="mt-5 text-center">
            <Link
              href="/about-us/contact"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark"
            >
              Interested in sponsoring?
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= ABOUT TEASER ================= */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="uppercase tracking-[0.18em] text-xs font-semibold text-caption-text mb-4">
                OUR STORY
              </div>
              <h2 className="text-4xl font-semibold text-heading-text mb-6">
                A Legacy of Western Spirit
              </h2>
              <p className="text-lg text-body-text leading-relaxed mb-6">
                Founded in 1985 as the Canadian Senior Pro Rodeo Association,
                the CCRA has grown into a vibrant community of competitors from
                beginner to professional. We celebrate the love of the sport,
                Western values, and the active lifestyle that brings us
                together.
              </p>
              <Link
                href="/about-us"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark"
              >
                Learn more about us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative aspect-4/3 rounded-md overflow-hidden border border-border">
              <Image
                src="/images/cowwrestler.jpg"
                alt="CCRA competitors"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= UPCOMING / NEWSLETTER ================= */}
      <section className="py-20 bg-background border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="uppercase tracking-[0.18em] text-xs font-semibold text-caption-text mb-3">
              What’s Coming Up
            </div>
            <h2 className="text-4xl font-semibold text-heading-text">
              Newsletter
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {newsLoading ? (
              /* --- Loading Skeleton --- */
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-md border border-border bg-background p-8 shadow-sm animate-pulse"
                >
                  <div className="h-4 w-24 bg-accent rounded mb-2" />
                  <div className="h-6 w-48 bg-accent rounded mb-3" />
                  <div className="h-4 w-full bg-accent rounded mb-6" />
                  <div className="h-4 w-20 bg-accent rounded" />
                </div>
              ))
            ) : newsletterItems.length === 0 ? (
              /* --- Empty State --- */
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-background">
                  <svg
                    className="h-5 w-5 text-caption-text"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>

                <p className="text-sm text-body-text">
                  No recent updates. Check back soon.
                </p>
              </div>
             /* --- Sort Newsletters by Most Recent (3 at a time) --- */
            ) : (
              [...newsletterItems]
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .slice(0, 3)
                .map((item) => (
                  <NewsletterCard
                    key={item.id}
                    id={item.id}
                    date={item.date}
                    title={item.title}
                    description={item.description}
                  />
                ))
            )}
          </div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-md bg-primary px-8 py-14 text-center text-primary-text">
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
              Ready to Hit the Grounds?
            </h2>
            <p className="text-primary-text text-lg max-w-2xl mx-auto mb-8">
              Get your membership today and be part of the Canadian Classic
              Rodeo family.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/profile/membership"
                className="inline-flex items-center justify-center rounded-md bg-primary-text px-8 py-3.5 text-sm font-semibold text-primary transition hover:bg-accent"
              >
                Membership
              </Link>
              <Link
                href="/about-us/contact"
                className="inline-flex items-center justify-center rounded-md border border-primary-text px-8 py-3.5 text-sm font-semibold text-primary-text transition hover:bg-accent/10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
