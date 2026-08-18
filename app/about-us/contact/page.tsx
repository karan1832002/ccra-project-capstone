import { Phone, Mail, Pin } from "lucide-react";
import Hero from "@/components/ui/Hero";
import { pageStructure } from "@/lib/styles";
import ContactForm from "./ContactForm";

const quickLinks = [
  { href: "/store", label: "Membership" },
  { href: "/schedule", label: "2026 Schedule" },
  { href: "/results/standings", label: "Current Standings" },
  { href: "/results/past-champions", label: "Past Champions" },
];

export default function ContactInformationPage() {
  return (
    <div className={pageStructure.pageWrapper}>
      {/* ================= HERO ================= */}
      <Hero
        badge="GET IN TOUCH"
        title="Contact Us"
        description="Have questions about membership, events, or sponsorships? We’d love to hear from you."
      />

      <div className={pageStructure.contentContainer}>
        <div className="grid lg:grid-cols-12 gap-16">
          {/* ================= CONTACT INFO ================= */}
          <div className="lg:col-span-5">
            <div className="bg-surface rounded-md border border-border shadow-sm p-10">
              <h2 className="text-2xl font-semibold text-heading-text mb-8">
                Contact Information
              </h2>

              <div className="space-y-10">
                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-accent-text" />
                  </div>
                  <div>
                    <div className="font-semibold text-heading-text">Phone</div>
                    <a
                      href="tel:4038753242"
                      className="text-accent-text hover:underline text-lg"
                    >
                      403-875-3242
                    </a>
                    <p className="text-sm text-caption-text mt-1">
                      Monday – Friday, 9am – 5pm MST
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-accent-text" />
                  </div>
                  <div>
                    <div className="font-semibold text-heading-text">Email</div>
                    <a
                      href="mailto:canclassicrodeo@gmail.com"
                      className="text-accent-text hover:underline text-lg"
                    >
                      canclassicrodeo@gmail.com
                    </a>
                  </div>
                </div>

                {/* Mailing Address */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center flex-shrink-0">
                    <Pin className="w-5 h-5 text-accent-text" />
                  </div>
                  <div>
                    <div className="font-semibold text-heading-text">
                      Mailing Address
                    </div>
                    <div className="text-body-text leading-relaxed mt-1">
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
              <div className="mt-12 pt-8 border-t border-border">
                <p className="text-sm font-semibold text-caption-text mb-4">
                  QUICK LINKS
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {quickLinks.map(({ href, label }) => (
                    <a
                      key={href}
                      href={href}
                      className="text-body-text hover:text-accent-text transition"
                    >
                      {label}
                    </a>
                  ))}
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
        <div className="mt-20 bg-highlight border border-border rounded-md p-8 md:p-12 text-center dark:bg-highlight/20">
          <h3 className="font-semibold text-accent-text mb-2">
            Office Hours
          </h3>
          <p className="text-body-text">
            Monday to Friday: 9:00 AM – 5:00 PM MST
            <br />
            Closed on weekends and statutory holidays
          </p>
        </div>
      </div>
    </div>
  );
}
