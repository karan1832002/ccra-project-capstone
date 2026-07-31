import { Phone, Mail, Pin } from "lucide-react";
import Hero from "@/components/ui/Hero";

export default function ContactInformationPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
      {/* ================= HERO ================= */}
      <Hero
        badge="GET IN TOUCH"
        title="Contact Us"
        description="Have questions about membership, events, or sponsorships? We’d love to hear from you."
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* ================= CONTACT INFO ================= */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-md border border-stone-200 shadow-sm p-10 dark:border-stone-700 dark:bg-stone-900">
              <h2 className="text-2xl font-semibold text-stone-950 mb-8 dark:text-stone-100">
                Contact Information
              </h2>

              <div className="space-y-10">
                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-md bg-orange-50 flex items-center justify-center flex-shrink-0 dark:bg-orange-950/40">
                    <Phone className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-950 dark:text-stone-100">Phone</div>
                    <a
                      href="tel:4038753242"
                      className="text-orange-600 hover:underline text-lg dark:text-orange-400"
                    >
                      403-875-3242
                    </a>
                    <p className="text-sm text-stone-500 mt-1 dark:text-stone-400">
                      Monday – Friday, 9am – 5pm MST
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-md bg-orange-50 flex items-center justify-center flex-shrink-0 dark:bg-orange-950/40">
                    <Mail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-950 dark:text-stone-100">Email</div>
                    <a
                      href="mailto:canclassicrodeo@gmail.com"
                      className="text-orange-600 hover:underline text-lg dark:text-orange-400"
                    >
                      canclassicrodeo@gmail.com
                    </a>
                  </div>
                </div>

                {/* Mailing Address */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-md bg-orange-50 flex items-center justify-center flex-shrink-0 dark:bg-orange-950/40">
                    <Pin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-stone-950 dark:text-stone-100">
                      Mailing Address
                    </div>
                    <div className="text-stone-600 leading-relaxed mt-1 dark:text-stone-300">
                      Canadian Classic Rodeo Association
                      <br />
                      PO Box 1234
                      <br />
                      Strathmore, AB T1P 1Z9
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-700">
                <p className="text-sm font-semibold text-stone-400 mb-4 dark:text-stone-500">
                  QUICK LINKS
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <a
                    href="/store"
                    className="text-stone-600 hover:text-orange-600 transition dark:text-stone-300 dark:hover:text-orange-400"
                  >
                    Membership
                  </a>
                  <a
                    href="/schedule"
                    className="text-stone-600 hover:text-orange-600 transition dark:text-stone-300 dark:hover:text-orange-400"
                  >
                    2026 Schedule
                  </a>
                  <a
                    href="/results/standings"
                    className="text-stone-600 hover:text-orange-600 transition dark:text-stone-300 dark:hover:text-orange-400"
                  >
                    Current Standings
                  </a>
                  <a
                    href="/results/past-champions"
                    className="text-stone-600 hover:text-orange-600 transition dark:text-stone-300 dark:hover:text-orange-400"
                  >
                    Past Champions
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ================= CONTACT FORM ================= */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-md border border-stone-200 shadow-sm p-10 dark:border-stone-700 dark:bg-stone-900">
              <h2 className="text-2xl font-semibold text-stone-950 mb-8 dark:text-stone-100">
                Send Us a Message
              </h2>

              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="h-12 w-full rounded-md border border-stone-200 bg-white px-4 text-sm text-stone-900 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 transition dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="h-12 w-full rounded-md border border-stone-200 bg-white px-4 text-sm text-stone-900 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 transition dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="h-12 w-full rounded-md border border-stone-200 bg-white px-4 text-sm text-stone-900 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 transition dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">
                    Subject
                  </label>
                  <select className="h-12 w-full rounded-md border border-stone-200 bg-white px-4 text-sm text-stone-900 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 transition dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100">
                    <option>General Inquiry</option>
                    <option>Membership</option>
                    <option>Event Information</option>
                    <option>Sponsorship</option>
                    <option>Volunteer / Officials</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2 dark:text-stone-300">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 focus:border-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-300 transition resize-y dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100"
                    placeholder="How can we help you today?"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto inline-flex items-center justify-center rounded-md bg-orange-600 px-10 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ================= OFFICE HOURS ================= */}
        <div className="mt-20 bg-orange-50 border border-orange-100 rounded-md p-8 md:p-12 text-center dark:border-orange-900/40 dark:bg-orange-950/20">
          <h3 className="font-semibold text-orange-700 mb-2 dark:text-orange-400">Office Hours</h3>
          <p className="text-orange-800 dark:text-orange-300">
            Monday to Friday: 9:00 AM – 5:00 PM MST
            <br />
            Closed on weekends and statutory holidays
          </p>
        </div>
      </div>
    </div>
  );
}