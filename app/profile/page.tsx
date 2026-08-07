"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Shield,
  Edit3,
  CreditCard,
  ClipboardList,
  ChevronRight,
  LogOut,
  X,
  Moon,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import EditProfileModal from "@/components/profile/EditProfileModal";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");

    localStorage.setItem("theme", isDark ? "dark" : "light");
    setIsDarkMode(isDark);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="animate-pulse text-stone-400 text-sm">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="text-stone-400 text-sm">Not signed in</div>
      </div>
    );
  }

  const { name, email, image, createdAt, role } =
    session.user as typeof session.user & { role?: string | null };

  const initials =
    name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const memberSince = createdAt ? new Date(createdAt).getFullYear() : "N/A";

  const roleLabel = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "Member";

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
            Manage your membership details, view your season progress, and keep
            your information up to date.
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
                    {image ? (
                      <img
                        src={image}
                        alt={name ?? "Profile picture"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-semibold text-orange-600 dark:text-orange-400">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-md bg-orange-600 flex items-center justify-center text-white shadow">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-stone-950 dark:text-stone-100">
                  {name ?? "Member"}
                </h2>

                {/* Status Badge */}
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {roleLabel}
                </div>

                <p className="mt-4 text-sm text-stone-400 dark:text-stone-500">
                  {email}
                </p>

                <p className="mt-1 text-sm text-stone-400 dark:text-stone-500">
                  Member since {memberSince}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-700 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center justify-between w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-950 transition hover:border-orange-300 hover:bg-orange-50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-orange-700 dark:hover:bg-orange-950/20"
                >
                  <span className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    Edit Profile
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/membership"
                className="flex items-center justify-between w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-950 transition hover:border-orange-300 hover:bg-orange-50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-orange-700 dark:hover:bg-orange-950/20"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  Membership & Fees
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-between w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-950 transition hover:border-orange-300 hover:bg-orange-50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-orange-700 dark:hover:bg-orange-950/20"
              >
                <span className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  Theme
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    {isDarkMode ? "Dark" : "Light"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowSignOutConfirm(true)}
                className="flex items-center justify-between w-full rounded-md border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-red transition hover:border-red-300 hover:bg-red-50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:border-red-700 dark:hover:bg-red-950/20"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                  Sign Out
                </span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN – Quick Links ================= */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/events/enter-rodeo"
                className="group flex items-center gap-4 rounded-md border border-stone-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md dark:border-stone-700 dark:bg-stone-900 dark:hover:border-orange-700"
              >
                <div className="w-11 h-11 rounded-md bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition dark:bg-orange-950/40 dark:text-orange-400">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-stone-950 dark:text-stone-100">
                    Enter a Rodeo
                  </div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">
                    Submit entries for upcoming events
                  </div>
                </div>
              </Link>

              <Link
                href="/profile/my-standings"
                className="group flex items-center gap-4 rounded-md border border-stone-200 bg-white p-5 shadow-sm transition hover:border-orange-300 hover:shadow-md dark:border-stone-700 dark:bg-stone-900 dark:hover:border-orange-700"
              >
                <div className="w-11 h-11 rounded-md bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition dark:bg-orange-950/40 dark:text-orange-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-stone-950 dark:text-stone-100">
                    My Standings
                  </div>
                  <div className="text-sm text-stone-500 dark:text-stone-400">
                    View full rankings & points
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={{
          name: name ?? "",
          email: email ?? "",
          image: session.user.image,
        }}
      />

      {/* ================= SIGN OUT CONFIRMATION MODAL ================= */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm"
            onClick={() => setShowSignOutConfirm(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md rounded-md border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-700 dark:bg-stone-900">
            <button
              type="button"
              onClick={() => setShowSignOutConfirm(false)}
              className="absolute right-4 top-4 rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-200"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-md bg-red-100 flex items-center justify-center text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <LogOut className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-950 dark:text-stone-100">
                Sign out?
              </h3>
            </div>

            <p className="text-sm text-stone-600 dark:text-stone-300 mb-6">
              Are you sure you want to sign out of your CCRA account? You can
              always sign back in later.
            </p>

            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setShowSignOutConfirm(false)}
                className="inline-flex items-center justify-center rounded-md border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
