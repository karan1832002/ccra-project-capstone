import { Phone, Mail, Pin } from "lucide-react";
import Hero from "@/components/ui/Hero";
import ContactForm from "./ContactForm";

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
                    <p className="text-sm text-stone-600 mt-1 dark:text-stone-600">
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
                <p className="text-sm font-semibold text-stone-600 mb-4 dark:text-stone-600">
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
            <ContactForm />
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