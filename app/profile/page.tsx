"use client";

import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trophy,
  Shield,
  Edit3,
  CreditCard,
  ClipboardList,
  ChevronRight,
  Award,
  LogOut,
} from "lucide-react";

// Mock data – replace with real user data from your auth/session + API
const user = {
  name: "Tammy Clemmer",
  status: "Active",
  memberSince: "2018",
  email: "tammy.clemmer@example.com",
  phone: "(403) 555-0198",
  address: "Strathmore, AB",
  ageGroup: "50-59",
  avatar: "/images/avatar-placeholder.jpg", // replace with real avatar or initials fallback
  events: ["Ladies Barrel Racing 50-59", "Ribbon Roping 50-59"],
  currentSeason: {
    points: 142,
    rank: 7,
    rodeosEntered: 3,
  },
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* ================= HEADER ================= */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 rounded-md bg-orange-50 px-4 py-1 text-sm font-semibold text-orange-600 mb-6 dark:bg-orange-950/40 dark:text-orange-400">
            MEMBER PROFILE
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-950 dark:text-stone-100">
            My Profile
          </h1>
          <p className="mt-3 text-lg text-stone-600 dark:text-stone-300 max-w-2xl">
            Manage your membership details, view your season progress, and keep your information up to date.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* ================= LEFT COLUMN – Identity Card ================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <div className="rounded-md border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-900">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-md overflow-hidden border-2 border-orange-200 bg-stone-100 dark:border-orange-800 dark:bg-stone-800">
                    {/* Fallback initials if no image */}
                    <div className="w-full h-full flex items-center justify-center text-3xl font-semibold text-orange-600 dark:text-orange-400">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    {/* Uncomment when you have real avatars:
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                    */}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-md bg-orange-600 flex items-center justify-center text-white shadow">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-100">
                  {user.name}
                </h2>

                {/* Status Badge */}
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {user.status} Member
                </div>

                <p className="mt-4 text-sm text-stone-500 dark:text-stone-400">
                  Member since {user.memberSince} · {user.ageGroup}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-700 space-y-3">
                <Link
                  href="/profile/edit"
                  className="flex items-center justify-between w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-950 transition hover:border-orange-300 hover:bg-orange-50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-orange-700 dark:hover:bg-orange-950/20"
                >
                  <span className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    Edit Profile
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>

                <Link
                  href="/membership/renew"
                  className="flex items-center justify-between w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-950 transition hover:border-orange-300 hover:bg-orange-50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-orange-700 dark:hover:bg-orange-950/20"
                >
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    Membership & Fees
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN – Details & Stats ================= */}
          <div className="lg:col-span-8 space-y-6">

            {/* Events / Categories */}
            <div className="rounded-md border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-700 dark:bg-stone-900">
              <div className="uppercase tracking-[0.18em] text-xs font-semibold text-stone-400 mb-4 dark:text-stone-500">
                COMPETING IN
              </div>
              <h3 className="text-xl font-semibold text-stone-950 mb-5 dark:text-stone-100">
                Events & Categories
              </h3>
              <div className="flex flex-wrap gap-3">
                {user.events.map((event) => (
                  <span
                    key={event}
                    className="inline-flex items-center gap-2 rounded-md bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"
                  >
                    <Trophy className="w-4 h-4" />
                    {event}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Links Row */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/events/enter-rodeo"
                className="group flex items-center gap-4 rounded-md border border-stone-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md dark:border-stone-700 dark:bg-stone-900 dark:hover:border-orange-700"
              >
                <div className="w-11 h-11 rounded-md bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition dark:bg-orange-950/40 dark:text-orange-400">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-stone-950 dark:text-stone-100">Enter a Rodeo</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">
                    Submit entries for upcoming events
                  </div>
                </div>
              </Link>

              <Link
                href="/results/standings"
                className="group flex items-center gap-4 rounded-md border border-stone-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md dark:border-stone-700 dark:bg-stone-900 dark:hover:border-orange-700"
              >
                <div className="w-11 h-11 rounded-md bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition dark:bg-orange-950/40 dark:text-orange-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-stone-950 dark:text-stone-100">My Standings</div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">
                    View full rankings & points
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}