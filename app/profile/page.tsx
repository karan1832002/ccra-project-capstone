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
  Moon,
} from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import EditProfileModal from "@/components/profile/EditProfileModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { pageStructure, cards } from "@/lib/styles";
import Hero from "@/components/ui/Hero";

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
      <div className={`${pageStructure.pageWrapper} flex items-center justify-center`}>
        <div className="animate-pulse text-body-text text-sm">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className={`${pageStructure.pageWrapper} flex items-center justify-center`}>
        <div className="text-body-text text-sm">Not signed in</div>
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
    <div className={pageStructure.pageWrapper}>
      {/* ================= HERO ================= */}
            <Hero
              badge="MEMBER PROFILE"
              title="My Profile"
              description="Manage your membership details, view your season progress, and keep your information up to date."
            />

      <div className={pageStructure.contentContainer}>
        <div className="grid lg:grid-cols-12 gap-8">
          {/* ================= LEFT COLUMN – Identity Card ================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <div className={cards.layout}>
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-md overflow-hidden border-2 border-accent bg-background">
                    {image ? (
                      <img
                        src={image}
                        alt={name ?? "Profile picture"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-semibold text-accent-text">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-text shadow">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-heading-text">
                  {name ?? "Member"}
                </h2>

                {/* Status Badge */}
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/40 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {roleLabel}
                </div>

                <p className="mt-4 text-sm text-body-text">
                  {email}
                </p>

                <p className="mt-1 text-sm text-body-text">
                  Member since {memberSince}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-border space-y-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center justify-between w-full rounded-md border border-border bg-stone-50 px-4 py-3 text-sm font-semibold text-heading-text transition hover:border-accent-text hover:bg-highlight dark:bg-stone-950"
                >
                  <span className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-accent-text" />
                    Edit Profile
                  </span>
                  <ChevronRight className="w-4 h-4 text-caption-text" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/membership"
                className="flex items-center justify-between w-full rounded-md border border-border bg-surface px-4 py-3 text-sm font-semibold text-heading-text transition hover:border-accent-text hover:bg-highlight"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-accent-text" />
                  Membership & Fees
                </span>
                <ChevronRight className="w-4 h-4 text-caption-text" />
              </Link>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center justify-between w-full rounded-md border border-border bg-surface px-4 py-3 text-sm font-semibold text-heading-text transition hover:border-accent-text hover:bg-highlight"
              >
                <span className="flex items-center gap-2">
                  <Moon className="w-4 h-4 text-accent-text" />
                  Theme
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-caption-text">
                    {isDarkMode ? "Dark" : "Light"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-caption-text" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setShowSignOutConfirm(true)}
                className="flex items-center justify-between w-full rounded-md border border-border bg-surface px-4 py-3 text-sm font-semibold text-red transition hover:border-red-300 hover:bg-red-50 dark:text-stone-100 dark:hover:border-red-700 dark:hover:bg-red-950/20"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                  Sign Out
                </span>
                <ChevronRight className="w-4 h-4 text-caption-text" />
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN – Quick Links ================= */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <Link
                href="/events/enter-rodeo"
                className="group flex items-center gap-4 rounded-md border border-border bg-surface p-5 shadow-sm transition hover:border-accent-text hover:shadow-md"
              >
                <div className="w-11 h-11 rounded-md bg-accent flex items-center justify-center text-accent-text group-hover:bg-primary group-hover:text-primary-text transition">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-heading-text">
                    Enter a Rodeo
                  </div>
                  <div className="text-sm text-body-text">
                    Submit entries for upcoming events
                  </div>
                </div>
              </Link>

              <Link
                href="/profile/my-standings"
                className="group flex items-center gap-4 rounded-md border border-border bg-surface p-5 shadow-sm transition hover:border-accent-text hover:shadow-md"
              >
                <div className="w-11 h-11 rounded-md bg-accent flex items-center justify-center text-accent-text group-hover:bg-primary group-hover:text-primary-text transition">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-heading-text">
                    My Standings
                  </div>
                  <div className="text-sm text-body-text">
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
      <ConfirmDialog
        open={showSignOutConfirm}
        icon={LogOut}
        title="Sign out?"
        message="Are you sure you want to sign out of your CCRA account? You can always sign back in later."
        confirmLabel="Sign Out"
        onConfirm={() => {
          setShowSignOutConfirm(false);
          handleSignOut();
        }}
        onClose={() => setShowSignOutConfirm(false)}
      />
    </div>
  );
}
