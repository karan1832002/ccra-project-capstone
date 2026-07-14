export default function TermsOfServicePage() {
    return (
        <main className="min-h-screen bg-[#fff8f5] text-[#1e1b18] font-sans">
            <div className="max-w-3xl mx-auto px-6 py-16">
                <h1 className="font-headline text-4xl font-extrabold text-[#933d04] mb-2">
                    Terms of Service
                </h1>
                <p className="text-sm text-[#897268] mb-10">Last updated: July 14, 2026</p>

                <div className="flex flex-col gap-8 text-sm leading-relaxed text-[#3a2f28]">
                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">1. Acceptance of Terms</h2>
                        <p>
                            By creating an account or using CCRA Rodeo ("we," "us," "the Service"), you agree to be
                            bound by these Terms of Service. If you do not agree, please do not use the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">2. Eligibility & Accounts</h2>
                        <p className="mb-2">
                            You must provide accurate information when creating an account, including a valid email
                            address. You are responsible for maintaining the confidentiality of your password and for
                            all activity that occurs under your account.
                        </p>
                        <p>
                            You must notify us promptly if you suspect unauthorized access to your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">3. Use of the Service</h2>
                        <p className="mb-2">
                            CCRA Rodeo allows members to manage event entries, track results, and view standings.
                            You agree to use the Service only for lawful purposes and in accordance with these Terms.
                        </p>
                        <p>You agree not to:</p>
                        <ul className="list-disc pl-6 mt-2 flex flex-col gap-1">
                            <li>Submit false or misleading entry, profile, or results information</li>
                            <li>Attempt to access another member's account without authorization</li>
                            <li>Interfere with or disrupt the Service's operation or security</li>
                            <li>Use the Service to harass, defraud, or harm another person</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">4. Event Entries & Standings</h2>
                        <p>
                            Event entry data and standings displayed on the Service are provided for informational
                            and organizational purposes. While we aim for accuracy, we do not guarantee that entries,
                            results, or standings are error-free, and official results for any sanctioned event are
                            governed by the applicable event organizer's rules, not by this Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">5. Termination</h2>
                        <p>
                            We may suspend or terminate your account if you violate these Terms or engage in conduct
                            that we determine, in our discretion, is harmful to the Service or other members. You may
                            stop using the Service and request account deletion at any time by contacting us.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">6. Disclaimers</h2>
                        <p>
                            The Service is provided "as is" without warranties of any kind, express or implied. We do
                            not warrant that the Service will be uninterrupted, secure, or error-free.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">7. Limitation of Liability</h2>
                        <p>
                            To the fullest extent permitted by law, CCRA Rodeo shall not be liable for any indirect,
                            incidental, or consequential damages arising from your use of, or inability to use, the
                            Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">8. Changes to These Terms</h2>
                        <p>
                            We may update these Terms from time to time. Continued use of the Service after changes
                            take effect constitutes acceptance of the revised Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-headline text-xl font-bold text-[#705a49] mb-2">9. Contact</h2>
                        <p>
                            Questions about these Terms can be sent to{" "}
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