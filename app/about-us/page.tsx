import Image from "next/image";
import { HandCoins, Trophy, HeartHandshake } from "lucide-react";

export default function AboutUsPage() {
  return (
  <div className="min-h-screen bg-stone-50 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
        {/* Page Container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Hero / Header Section */}
          <div className="text-center py-20 border-b border-stone-200 dark:border-stone-800">
            <div className="inline-flex items-center justify-center rounded-md bg-orange-50 px-4 py-1 text-sm font-semibold text-orange-600 mb-6 dark:bg-orange-950/40 dark:text-orange-400">
              EST. 1985
            </div>
            <h1 className="text-5xl font-semibold text-stone-950 tracking-tight mb-6 dark:text-stone-100">
              About the CCRA
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-stone-600 dark:text-stone-300">
              Celebrating 41 years of preserving Western heritage through competitive rodeo for athletes of all ages and skill levels.
            </p>
          </div>

          {/* Mission / History Section */}
          <div className="grid lg:grid-cols-2 gap-16 py-20 items-center">
            <div>
              <div className="uppercase tracking-[0.18em] text-xs font-semibold text-stone-400 mb-4 dark:text-stone-500">OUR STORY</div>
              <h2 className="text-4xl font-semibold text-stone-950 mb-8 dark:text-stone-100">A Legacy of Western Spirit</h2>
              
              <div className="prose prose-stone text-stone-600 space-y-6 text-lg dark:prose-invert dark:text-stone-300">
                <p>
                  The Canadian Classic Rodeo Association (formerly the Canadian Senior Pro Rodeo Association) was founded in 1985 to provide competitive rodeo opportunities for athletes aged 40 and older.
                </p>
                <p>
                  Today, the CCRA welcomes competitors of all ages and skill levels — from beginners to seasoned professionals — united by their passion for the sport, appreciation of Western values, and commitment to excellence.
                </p>
                <p>
                  For over four decades, we have championed the traditions of rodeo while fostering community, sportsmanship, and the Western lifestyle across Canada.
                </p>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <a 
                  href="/membership" 
                  className="inline-flex items-center justify-center rounded-md bg-orange-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
                >
                  Join the CCRA
                </a>
                <a 
                  href="/schedule" 
                  className="inline-flex items-center justify-center rounded-md border border-stone-200 bg-white px-8 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800"
                >
                  View 2026 Schedule
                </a>
              </div>
            </div>

            {/* Visual / Image Placeholder */}
            <div className="relative rounded-md shadow-sm overflow-hidden aspect-[16/10] bg-stone-200 dark:bg-stone-800">
              <Image 
                src="/images/about-hero.jpg" // Replace with actual image path later
                alt="Canadian Classic Rodeo action" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <div className="text-sm uppercase tracking-widest opacity-75">41st Anniversary Season</div>
                <div className="text-3xl font-semibold">2026</div>
              </div>
            </div>
          </div>

          {/* Values / What We Stand For */}
          <div className="py-20 border-t border-stone-200 dark:border-stone-800">
            <div className="text-center mb-16">
              <div className="uppercase tracking-[0.18em] text-xs font-semibold text-stone-400 mb-3 dark:text-stone-500">OUR VALUES</div>
              <h2 className="text-4xl font-semibold text-stone-950 dark:text-stone-100">What Drives Us</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="rounded-md border border-stone-200 bg-white p-8 shadow-sm hover:shadow-lg transition group dark:border-stone-700 dark:bg-stone-900">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-orange-100 text-orange-600 mx-auto dark:bg-orange-950/40 dark:text-orange-400">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-stone-950 mb-3 dark:text-stone-100">Heritage & Tradition</h3>
                <p className="text-stone-600 dark:text-stone-300">
                  Honoring the rich history and traditions of Canadian rodeo while creating new memories for future generations.
                </p>
              </div>

              {/* Card 2 */}
              <div className="rounded-md border border-stone-200 bg-white p-8 shadow-sm hover:shadow-lg transition group dark:border-stone-700 dark:bg-stone-900">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-orange-100 text-orange-600 mx-auto dark:bg-orange-950/40 dark:text-orange-400">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-stone-950 mb-3 dark:text-stone-100">Competition & Growth</h3>
                <p className="text-stone-600 dark:text-stone-300">
                  Providing fair, safe, and exciting competition for athletes at every stage of their rodeo journey.
                </p>
              </div>

              {/* Card 3 */}
              <div className="rounded-md border border-stone-200 bg-white p-8 shadow-sm hover:shadow-lg transition group dark:border-stone-700 dark:bg-stone-900">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md bg-orange-100 text-orange-600 mx-auto dark:bg-orange-950/40 dark:text-orange-400">
                  <HandCoins className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-semibold text-stone-950 mb-3 dark:text-stone-100">Community & Family</h3>
                <p className="text-stone-600 dark:text-stone-300">
                  Building lasting friendships and supporting one another both in and out of the arena.
                </p>
              </div>
            </div>
          </div>

          {/* History Timeline (Simple) */}
          <div className="py-20 bg-white rounded-md border border-stone-200 p-12 dark:border-stone-700 dark:bg-stone-900">
            <h2 className="text-3xl font-semibold text-stone-950 mb-12 text-center dark:text-stone-100">Our Journey</h2>
            
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="flex gap-8">
                <div className="w-28 flex-shrink-0 text-right">
                  <div className="font-semibold text-orange-600 dark:text-orange-400">1985</div>
                </div>
                <div>
                  <div className="font-semibold text-stone-950 dark:text-stone-100">Foundation</div>
                  <p className="text-stone-600 mt-1 dark:text-stone-300">Established as the Canadian Senior Pro Rodeo Association to serve mature competitors.</p>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="w-28 flex-shrink-0 text-right">
                  <div className="font-semibold text-orange-600 dark:text-orange-400">2000s</div>
                </div>
                <div>
                  <div className="font-semibold text-stone-950 dark:text-stone-100">Expansion</div>
                  <p className="text-stone-600 mt-1 dark:text-stone-300">Grew to include all skill levels and introduced new events.</p>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="w-28 flex-shrink-0 text-right">
                  <div className="font-semibold text-orange-600 dark:text-orange-400">2025-2026</div>
                </div>
                <div>
                  <div className="font-semibold text-stone-950 dark:text-stone-100">Modern Era</div>
                  <p className="text-stone-600 mt-1 dark:text-stone-300">Rebranded to Canadian Classic Rodeo Association. 41st anniversary season with exciting new initiatives and continued growth.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Leadership / Contact Teaser */}
          <div className="py-20 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-3xl font-semibold text-stone-950 mb-4 dark:text-stone-100">Led by Passionate Volunteers</h2>
              <p className="text-stone-600 mb-8 dark:text-stone-300">
                Our board and committees are made up of dedicated rodeo enthusiasts who give their time to keep the spirit of the CCRA alive.
              </p>
              <a 
                href="/about-us/board-of-directors" 
                className="inline-flex items-center justify-center rounded-md bg-orange-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
              >
                Meet Our Team
              </a>
            </div>
          </div>
        </div>
  </div>
  );
}