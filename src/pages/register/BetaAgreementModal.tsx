import { useState, useRef, useCallback, useEffect } from "react";
import "./beta-agreement.css";

interface Props {
    onAccept: () => void;
    onDecline: () => void;
}

export default function BetaAgreementModal({ onAccept }: Props) {
    const [hasReachedBottom, setHasReachedBottom] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showPulse, setShowPulse] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        const { scrollTop, scrollHeight, clientHeight } = el;
        const total = scrollHeight - clientHeight;
        const progress = total > 0 ? Math.min(scrollTop / total, 1) : 1;
        setScrollProgress(progress);
        if (progress >= 0.98) setHasReachedBottom(true);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => el.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // const handleDeclineClick = () => onDecline();

    const handleAcceptAttempt = () => {
        if (!hasReachedBottom) {
            setShowPulse(true);
            scrollRef.current?.scrollBy({ top: 320, behavior: "smooth" });
            setTimeout(() => setShowPulse(false), 600);
        } else {
            onAccept();
        }
    };

    const progressPercent = Math.round(scrollProgress * 100);

    return (
        <div className="bam-backdrop" role="dialog" aria-modal="true" aria-labelledby="bam-title">
            <div className="bam-shell">
                {/* Header */}
                <div className="bam-header">
                    <div className="bam-header-brand">rareOS</div>
                    <h1 className="bam-header-title" id="bam-title">Beta Program Agreement</h1>
                    <p className="bam-header-sub">
                        Please read the full agreement before creating your account.
                    </p>
                </div>

                {/* Progress bar */}
                <div className="bam-progress-track" aria-hidden="true">
                    <div className="bam-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>
                <div className="bam-progress-label" aria-live="polite">
                    {hasReachedBottom ? (
                        <span className="bam-progress-done">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                            You've read the full agreement
                        </span>
                    ) : (
                        <span>{progressPercent}% read — scroll down to continue</span>
                    )}
                </div>

                {/* Scrollable body */}
                <div className="bam-body" ref={scrollRef}>
                    <div className="bam-content">

                        <p className="bam-effective">Effective Date: Date of Acceptance</p>

                        <section>
                            <h2>1. Introduction and Scope</h2>
                            <p>This Beta Program Agreement (this "Agreement") governs participation in the beta program (the "Beta Program") offered by rareOS, LLC, an Ohio limited liability company (the "Company"), and is entered into by and between the Company and the individual or entity accepting these terms (the "Participant"). This Agreement is effective as of the date on which Participant accepts this Agreement by clicking "I Accept" or by accessing or using the Beta Services (the "Effective Date").</p>
                            <p>This Agreement is incorporated into and supplements the rareOS Terms of Use (the "Terms of Use") and the rareOS Privacy Policy (the "Privacy Policy"), each as may be updated from time to time and made available on the Company's website. In the event of any conflict or inconsistency between this Agreement and the Terms of Use or Privacy Policy, this Agreement shall control with respect to intellectual property assignment, beta program participation, and all other matters expressly addressed herein.</p>
                            <p>The Company operates: (a) the rareOS platform, a buy, sell, and trade retail point of sale and operating system platform (the "Platform"); (b) the rareDepot marketplace, a consumer marketplace brand owned and operated by the Company; and (c) rarePay, LLC, a wholly owned subsidiary of the Company that provides payment processing services within the Platform ecosystem. References to the "Company" in this Agreement shall, where the context requires, include the Company's subsidiaries, affiliates, and brands, including rarePay, LLC and the rareDepot marketplace.</p>
                        </section>

                        <section>
                            <h2>2. Definitions</h2>
                            <dl>
                                <dt>"Advertising Services"</dt>
                                <dd>means the advertising platform, audience targeting, promotional content delivery, audience segmentation, analytics, and related advertising and marketing services that the Company builds, operates, improves, and commercializes within the Platform ecosystem and the rareDepot marketplace, using data collected in the ordinary course of providing the Platform and Beta Services.</dd>

                                <dt>"Assigned IP"</dt>
                                <dd>means all Feedback, Improvements, Inventions, Developed IP, and any and all intellectual property rights therein, whether or not patentable, copyrightable, or protectable as a trade secret, that are conceived, created, developed, discovered, reduced to practice, or first fixed in a tangible medium of expression by Participant or Participant Personnel, alone or jointly with others (including the Company), in connection with, arising out of, or relating to: (a) the Beta Program or Beta Services; (b) the Platform or any component thereof; (c) the Consultation Services; (d) any Confidential Information of the Company; or (e) any communication, interaction, or collaboration between Participant and the Company or its representatives, regardless of the channel, medium, or format of such communication.</dd>

                                <dt>"Beta Period"</dt>
                                <dd>means the period commencing on the Effective Date and continuing until the Company terminates the Beta Program or this Agreement in accordance with Section 12, or until the Company publicly launches the Platform as a generally available commercial product, whichever occurs first.</dd>

                                <dt>"Beta Services"</dt>
                                <dd>means the pre-release, beta version of the Platform and all related features, tools, integrations, application programming interfaces, documentation, and services made available to Participant during the Beta Period, including access to the rareDepot marketplace functionality and rarePay payment processing capabilities.</dd>

                                <dt>"Company Group"</dt>
                                <dd>means, collectively, rareOS, LLC, rarePay, LLC (a wholly owned subsidiary of the Company), and the rareDepot marketplace brand, together with any other subsidiaries, affiliates, successors, and assigns of the Company.</dd>

                                <dt>"Confidential Information"</dt>
                                <dd>means any and all non-public, proprietary, or confidential information disclosed by one party (the "Disclosing Party") to the other party (the "Receiving Party") in connection with this Agreement, whether disclosed orally, in writing, electronically, or by any other means, and whether or not marked as confidential.</dd>

                                <dt>"Developed IP"</dt>
                                <dd>means any and all ideas, concepts, inventions, discoveries, improvements, innovations, techniques, processes, methods, algorithms, software, code, designs, works of authorship, data compilations, analyses, reports, documentation, and other intellectual property or work product that is conceived, created, developed, or reduced to practice by Participant or Participant Personnel, alone or jointly with others, in connection with, arising out of, or relating to the Beta Program, the Platform, the Beta Services, or the Consultation Services.</dd>

                                <dt>"Feedback"</dt>
                                <dd>means any and all suggestions, ideas, enhancement requests, recommendations, corrections, bug reports, feature requests, comments, observations, analyses, evaluations, test results, benchmarks, performance data, and other feedback of any kind provided by Participant or Participant Personnel regarding the Platform, Beta Services, Consultation Services, or any other aspect of the Company's products, services, or business.</dd>

                                <dt>"Pre-Existing IP"</dt>
                                <dd>means any intellectual property rights that: (a) are owned by Participant prior to the Effective Date; (b) are developed by Participant independently of and without use of, reference to, or connection with the Beta Program, the Platform, the Beta Services, the Consultation Services, or any Confidential Information of the Company; and (c) are not Assigned IP.</dd>
                            </dl>
                        </section>

                        <section>
                            <h2>3. Beta Program Participation</h2>
                            <h3>3.1 Grant of Access</h3>
                            <p>Subject to the terms and conditions of this Agreement, the Company grants Participant a limited, non-exclusive, non-transferable, non-sublicensable, revocable right to access and use the Beta Services during the Beta Period solely for Participant's internal business purposes. During the Beta Period, Participant shall not be charged any platform fees, subscription fees, or license fees for access to the Beta Services; provided, however, that this fee waiver applies only to Platform access fees and does not extend to third-party transaction processing fees, payment network fees, or other third-party charges that may be incurred through Participant's use of the Platform.</p>

                            <h3>3.2 Consultation Services</h3>
                            <p>As part of the Beta Program, Participant will have access to business resource materials, operational guidance, and strategic insights provided by the Company's team, which includes individuals with significant retail industry experience, including the former Chief Financial Officer of GameStop Corporation. The Consultation Services are intended to provide general business guidance and do not constitute financial, legal, tax, investment, or fiduciary advice. The Company does not act as a fiduciary, financial advisor, investment advisor, or in any advisory capacity creating a duty of loyalty or care to the Participant.</p>

                            <h3>3.3 "As Is" Software</h3>
                            <p>Participant acknowledges and agrees that the Beta Services are pre-release software that is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind. The Beta Services may contain bugs, errors, defects, and other problems that could cause system failures, data loss, data breach, or other issues. Participant assumes all risks associated with the use of the Beta Services and is solely responsible for maintaining backup copies of all data and content.</p>

                            <h3>3.4 Modifications</h3>
                            <p>The Company reserves the right, in its sole discretion, to modify, update, suspend, limit, or discontinue any aspect of the Beta Services or the Beta Program at any time, with or without notice, and without liability to Participant.</p>

                            <h3>3.5 Participant Obligations</h3>
                            <p>As a condition of participation in the Beta Program, Participant agrees to:</p>
                            <ul>
                                <li>Provide timely, accurate, and detailed Feedback regarding the Beta Services, including bug reports, feature suggestions, and usability observations;</li>
                                <li>Report all bugs, errors, defects, security vulnerabilities, and performance issues promptly upon discovery;</li>
                                <li>Use the Beta Services in compliance with all applicable laws, regulations, and this Agreement;</li>
                                <li>Not reverse-engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Beta Services;</li>
                                <li>Not use the Beta Services to develop a competing product or service;</li>
                                <li>Not share access credentials with unauthorized individuals; and</li>
                                <li>Cooperate with the Company in diagnosing and resolving issues with the Beta Services.</li>
                            </ul>
                        </section>

                        <section>
                            <h2>4. Data Collection and Advertising Services</h2>
                            <h3>4.1 Data Collection</h3>
                            <p>Participant acknowledges and agrees that, in the normal course of providing the Platform and Beta Services, the Company collects and processes data relating to Participant's business operations, staff and personnel, inventory, and customers (including transaction records, contact information, purchase history, preferences, and behavioral data to the extent entered into or generated through the Platform).</p>

                            <h3>4.2 Advertising Platform</h3>
                            <p>Participant acknowledges and agrees that the Company uses the data described in Section 4.1, in aggregated, de-identified, or identifiable form as described in the Privacy Policy, to build, operate, improve, and refine an advertising platform and Advertising Services within the rareOS ecosystem. Participant acknowledges that the development of the Advertising Services is a core component of the Company's business and a material part of the consideration exchanged under this Agreement.</p>

                            <h3>4.3 License for Advertising</h3>
                            <p>Participant hereby grants the Company a non-exclusive, worldwide, royalty-free, fully paid-up, perpetual, irrevocable, sublicensable (through multiple tiers), and transferable license to use, reproduce, process, aggregate, analyze, combine, modify, create derivative works from, distribute, publicly display, and otherwise exploit Participant's data for the purposes of operating, improving, training, testing, and commercializing the Advertising Services and any related products or services. This license survives any termination or expiration of this Agreement.</p>

                            <h3>4.4 De-identified and Aggregate Data</h3>
                            <p>The Company may de-identify, anonymize, and aggregate Participant's data with data from other users of the Platform. Once data has been de-identified or aggregated such that it can no longer reasonably be used to identify Participant, Participant Entity, or any specific individual, such data shall be owned exclusively by the Company.</p>

                            <h3>4.5 Opt-Out Rights</h3>
                            <p>Participant's rights regarding data collection and advertising are governed by the Privacy Policy and applicable law, including state privacy laws (such as the California Consumer Privacy Act, as amended by the California Privacy Rights Act, the Virginia Consumer Data Protection Act, the Colorado Privacy Act, and similar state laws) that may provide opt-out rights for targeted advertising.</p>

                            <h3>4.6 No Sale of Raw Data</h3>
                            <p>The Company shall not sell Participant's identifiable customer personal data to third parties in raw, non-aggregated form. This restriction does not apply to de-identified or aggregated data, disclosures to service providers, disclosures required by law, or transfers in connection with a merger, acquisition, or sale of the Company's assets.</p>
                        </section>

                        <section className="bam-highlight-section">
                            <h2>5. Intellectual Property Assignment</h2>
                            <div className="bam-important-notice">
                                <strong>Important:</strong> This section contains an assignment of intellectual property rights. By accepting this Agreement, you are transferring ownership of certain intellectual property to the Company. Please read this section carefully.
                            </div>

                            <h3>5.1 Consideration</h3>
                            <p>Participant acknowledges and agrees that the following constitutes full and adequate consideration for the assignments, licenses, waivers, and obligations set forth in this Section 5: (a) access to the Platform and Beta Services at no charge during the Beta Period; (b) access to the Consultation Services; and (c) access to business resource materials, tools, operational insights, and strategic guidance provided through the Platform and the Beta Program. No additional compensation, royalties, fees, or other payment shall be due from the Company in connection with the assignments and obligations in this Section 5.</p>

                            <h3>5.2 Assignment of Rights</h3>
                            <p>Participant and Participant Entity (if applicable), on behalf of themselves and their respective successors, heirs, and assigns, hereby irrevocably assign, transfer, and convey to the Company all right, title, and interest worldwide in and to all Assigned IP, including patent rights, copyrights, trade secret rights, trademark rights, and all other intellectual property rights of any kind or nature in any jurisdiction worldwide.</p>

                            <h3>5.3 Scope of Assignment</h3>
                            <p>The assignment applies to Assigned IP arising from any and all channels, media, and formats, including recorded and unrecorded calls, in-person meetings, electronic communications, documents, usage of the Platform or Beta Services, and any other communication or collaboration between Participant and the Company.</p>

                            <h3>5.4 Fallback License</h3>
                            <p>To the extent that any Assigned IP is not effectively assigned to the Company under Section 5.2, Participant hereby grants to the Company an irrevocable, perpetual, exclusive, royalty-free, fully paid-up, worldwide, sublicensable, and transferable license to exploit such Assigned IP in any manner and for any purpose.</p>

                            <h3>5.5 Moral Rights Waiver</h3>
                            <p>To the maximum extent permitted by applicable law, Participant hereby irrevocably waives any and all moral rights in and to the Assigned IP. Participant further consents to any action by the Company that would, absent this waiver, constitute an infringement of Participant's Moral Rights.</p>

                            <h3>5.6 Work Made for Hire</h3>
                            <p>To the extent permitted by applicable law, Participant agrees that all Assigned IP that constitutes a copyrightable work of authorship shall be considered a "work made for hire" as defined under Section 101 of the United States Copyright Act, with the Company being deemed the author and owner of such work from the moment of its creation.</p>

                            <h3>5.7 No Royalties or Additional Compensation</h3>
                            <p>The Company shall never owe Participant or Participant Entity any royalties, license fees, milestone payments, revenue shares, profit shares, or any other form of compensation in connection with the Assigned IP or the Company's use, commercialization, licensing, or other exploitation thereof.</p>
                        </section>

                        <section>
                            <h2>6. Participant Entity and Personnel Coverage</h2>
                            <h3>6.1 Joint and Several Liability</h3>
                            <p>If Participant is accepting this Agreement on behalf of a Participant Entity, both the individual Participant and the Participant Entity shall be jointly and severally liable for all obligations, representations, warranties, covenants, and liabilities under this Agreement.</p>

                            <h3>6.3 Employment and Contractor Agreements</h3>
                            <p>Participant and Participant Entity (if applicable) shall ensure that each individual who is or becomes a member of Participant Personnel has executed a written agreement that includes an assignment of all intellectual property rights conceived, created, or developed in connection with the Platform, Beta Services, or this Agreement directly to the Company.</p>
                        </section>

                        <section>
                            <h2>7. Patent, Trademark, and Copyright Cooperation</h2>
                            <p>Participant agrees to use commercially reasonable efforts to assist and cooperate with the Company in obtaining, maintaining, enforcing, and defending intellectual property rights in and to the Assigned IP in any and all jurisdictions worldwide. If Participant fails or is unable, after thirty (30) calendar days' written notice from the Company, to execute any document or perform any act required, Participant hereby irrevocably appoints the Company as Participant's attorney-in-fact.</p>
                        </section>

                        <section>
                            <h2>8. Confidentiality</h2>
                            <p>Each Receiving Party agrees: (a) to hold the Disclosing Party's Confidential Information in strict confidence using at least the same degree of care it uses to protect its own confidential information of like kind, but in no event less than reasonable care; (b) not to disclose the Disclosing Party's Confidential Information to any third party except as expressly permitted herein; and (c) not to use the Disclosing Party's Confidential Information for any purpose other than as necessary to exercise its rights or fulfill its obligations under this Agreement.</p>
                            <p>The obligations under this Section 8 shall survive any termination or expiration of this Agreement for a period of three (3) years; provided that obligations with respect to trade secrets shall continue for so long as such information remains a trade secret.</p>
                        </section>

                        <section>
                            <h2>9. Disclaimers and Limitation of Liability</h2>
                            <div className="bam-caps-block">
                                <p>THE BETA SERVICES, THE PLATFORM, THE CONSULTATION SERVICES, AND ALL RELATED MATERIALS AND INFORMATION ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.</p>
                                <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE TOTAL AGGREGATE LIABILITY OF THE COMPANY AND ALL MEMBERS OF THE COMPANY GROUP ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT SHALL NOT EXCEED ONE HUNDRED UNITED STATES DOLLARS ($100.00 USD).</p>
                            </div>
                        </section>

                        <section>
                            <h2>10. Indemnification</h2>
                            <p>Participant agrees to indemnify, defend, and hold harmless the Company, each member of the Company Group, and their respective officers, directors, employees, agents, successors, and assigns from and against any and all claims, actions, suits, proceedings, losses, damages, liabilities, judgments, settlements, penalties, fines, costs, and expenses (including reasonable attorneys' fees and court costs) arising out of or relating to any breach of this Agreement, misuse of the Beta Services, or Participant's business activities conducted through the Platform.</p>
                        </section>

                        <section>
                            <h2>11. Regulatory Compliance and Legal Proceedings</h2>
                            <p>Participant is solely responsible for compliance with all applicable federal, state, and local laws, regulations, and ordinances in connection with Participant's use of the Platform and Beta Services, including secondhand dealer regulations, AML/KYC requirements, FTC requirements, sales tax obligations, consumer protection laws, and data protection and privacy laws.</p>
                            <p>Participant shall maintain complete and accurate records of all transactions conducted through the Platform for a period of not less than seven (7) years from the date of each transaction, or such longer period as required by applicable law.</p>
                        </section>

                        <section>
                            <h2>12. Term and Termination</h2>
                            <p>This Agreement commences on the Effective Date and continues for the duration of the Beta Period, unless earlier terminated. Either party may terminate this Agreement at any time, for any reason or no reason, by providing the other party with at least thirty (30) calendar days' prior written notice. The Company may also terminate immediately for cause.</p>
                            <p>Following termination or expiration, Participant shall have thirty (30) calendar days to export Participant's data from the Platform. The Company shall delete Participant's identifiable data from active systems within sixty (60) calendar days thereafter, subject to certain retention exceptions.</p>
                        </section>

                        <section>
                            <h2>13. Dispute Resolution</h2>
                            <p>This Agreement shall be governed by and construed in accordance with the laws of the State of Ohio, without regard to its conflict of laws principles. Any dispute, controversy, or claim arising out of or relating to this Agreement shall be resolved exclusively by final and binding arbitration administered by the American Arbitration Association ("AAA") in Franklin County, Ohio.</p>
                            <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, PARTICIPANT AND THE COMPANY EACH AGREE THAT ANY DISPUTE SHALL BE BROUGHT SOLELY IN THE PARTY'S INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF, CLASS MEMBER, OR PARTICIPANT IN ANY PURPORTED CLASS ACTION OR COLLECTIVE PROCEEDING.</p>
                            <p>In any Dispute resolved under this Section, the prevailing party shall be entitled to recover its reasonable attorneys' fees, costs, and expenses from the non-prevailing party.</p>
                            <p>Any cause of action or claim arising out of or relating to this Agreement must be commenced within one (1) year after the cause of action accrues.</p>
                        </section>

                        <section>
                            <h2>14. General Provisions</h2>
                            <p>This Agreement, together with the Terms of Use and the Privacy Policy, constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior and contemporaneous agreements, understandings, negotiations, and discussions. The Company may freely assign this Agreement or any of its rights or obligations hereunder without Participant's consent. Participant may not assign this Agreement without the prior written consent of the Company. The relationship between the Company and Participant is that of independent contracting parties. Nothing in this Agreement shall be construed to create a partnership, joint venture, agency, employment, or franchise relationship.</p>
                        </section>

                        <section>
                            <h2>15. Acceptance and Consent</h2>
                            <p>By clicking "I Accept" or by accessing or using the Beta Services, Participant represents, warrants, and agrees that: (a) Participant has read this Agreement in its entirety, including the intellectual property assignment provisions in Section 5; (b) Participant understands the terms and conditions of this Agreement; (c) Participant voluntarily accepts and agrees to be bound by all terms and conditions of this Agreement; (d) Participant has had the opportunity to consult with legal counsel prior to accepting this Agreement; and (e) Participant's acceptance of this Agreement is a knowing, voluntary, and informed acceptance.</p>
                            <p className="bam-attorney-notice">Participant is advised to use the services of an attorney before accepting this Agreement if any of the above terms is not fully understood.</p>
                        </section>

                    </div>

                    {/* Bottom sentinel */}
                    <div className="bam-bottom-sentinel" aria-hidden="true" />
                </div>

                {/* Scroll-down nudge */}
                {!hasReachedBottom && (
                    <div className="bam-scroll-nudge" aria-hidden="true">
                        <span>Scroll to read the full agreement</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                )}

                {/* Footer actions */}
                <div className="bam-footer">
                    {/* <button
                        type="button"
                        className="bam-btn-decline"
                        onClick={handleDeclineClick}
                    >
                        Decline
                    </button> */}
                    <button
                        type="button"
                        className={`bam-btn-accept ${hasReachedBottom ? "bam-btn-accept--ready" : ""} ${showPulse ? "bam-btn-accept--pulse" : ""}`}
                        onClick={handleAcceptAttempt}
                        aria-disabled={!hasReachedBottom}
                    >
                        {hasReachedBottom ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                                I Accept
                            </>
                        ) : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
                                Scroll to Accept
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
