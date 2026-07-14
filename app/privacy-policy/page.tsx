export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#fff8f5] text-[#1e1b18] font-sans">
            <div className="max-w-3xl mx-auto px-6 py-16">
                <h1 className="font-headline text-4xl font-extrabold text-[#933d04] mb-2">
                    Privacy Policy
                </h1>
                <p className="text-sm text-[#897268] mb-10">Last updated: July 14, 2026</p>

                <div className="flex flex-col gap-8 text-sm leading-relaxed text-[#3a2f28]">
                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">1. Information We Collect</h2>
                        <p className="mb-2">When you use CCRA Rodeo, we collect:</p>
                        <ul className="list-disc pl-6 flex flex-col gap-1">
                            <li><strong>Account information:</strong> your email address and password (stored securely, never in plain text)</li>
                            <li><strong>Profile information:</strong> details you choose to add to your member profile</li>
                            <li><strong>Event data:</strong> event entries you submit and associated results</li>
                            <li><strong>Standings data:</strong> aggregated results used to calculate and display standings</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">2. How We Use Your Information</h2>
                        <p className="mb-2">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 flex flex-col gap-1">
                            <li>Create and maintain your account</li>
                            <li>Process event entries and display standings</li>
                            <li>Send account-related emails, such as email verification and password reset links</li>
                            <li>Maintain the security and integrity of the Service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">3. Third-Party Services</h2>
                        <p className="mb-2">We use the following third-party services to operate CCRA Rodeo:</p>
                        <ul className="list-disc pl-6 flex flex-col gap-1">
                            <li><strong>Resend</strong> — to send transactional emails (email verification, password resets)</li>
                            <li><strong>Neon (PostgreSQL hosting)</strong> — to securely store account and application data</li>
                        </ul>
                        <p className="mt-2">
                            These providers process data on our behalf and are contractually restricted from using
                            your information for any purpose other than providing services to us.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">4. Data Storage & Security</h2>
                        <p>
                            Your data is stored in a hosted PostgreSQL database. Passwords are hashed and never stored
                            in plain text. We take reasonable technical and organizational measures to protect your
                            information, but no method of transmission or storage is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">5. Data Retention</h2>
                        <p>
                            We retain your account, profile, and event data for as long as your account is active.
                            If you request account deletion, we will delete or anonymize your personal information,
                            except where retention is required for legal or record-keeping purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">6. Your Rights</h2>
                        <p className="mb-2">Depending on your location, you may have the right to:</p>
                        <ul className="list-disc pl-6 flex flex-col gap-1">
                            <li>Access the personal information we hold about you</li>
                            <li>Request correction of inaccurate information</li>
                            <li>Request deletion of your account and associated data</li>
                        </ul>
                        <p className="mt-2">
                            To exercise these rights, contact us at the email below.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">7. Cookies</h2>
                        <p>
                            We use essential cookies/session tokens required to keep you signed in and to maintain
                            the security of your session. We do not currently use third-party advertising or tracking
                            cookies.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">8. Children's Privacy</h2>
                        <p>
                            The Service is not directed to children under 13, and we do not knowingly collect
                            personal information from children under 13.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">9. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will update the "Last updated"
                            date above when changes are made.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">10. Contact</h2>
                        <p>
                            Questions about this Privacy Policy can be sent to{" "}
                            <a href="mailto:support@ccrarodeo.com" className="text-[#0e6ab1] hover:underline">
                                support@ccrarodeo.com
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}