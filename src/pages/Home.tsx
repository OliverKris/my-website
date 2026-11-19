import { Fragment } from "react";
import { Link } from "react-router-dom";
import { projects, type Project } from "../data/projects";
import { experience } from "../data/experience";
import { frame, Rise } from "../components/site/Rise";
import { LoopVideo, ThemedShot } from "../components/site/Media";

const easySched = projects.find((p) => p.id === "easysched-reworked")!;
const formality = projects.find((p) => p.id === "formality-bias-nlu")!;

/* Inline frames after a name in the running list of work. */
const FRAMES: Record<string, string> = {
    "easysched-reworked": "/media/easy-sched/board-dark.webp",
    "formality-bias-nlu": "/media/formality/families.webp",
};

function projectHref(p: Project) {
    return p.caseStudy?.path ?? `/projects#${p.id}`;
}

export default function Home() {
    const work = [...projects].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    const ta = experience.find((e) => e.id === "gwu-ta")!;
    const club = experience.find((e) => e.id === "esports-club")!;

    return (
        <>
            {/* ---------- Hero: a composed void, then the statement on the 42% axis ---------- */}
            <section className={`${frame} relative flex flex-col justify-end min-h-[72svh] lg:min-h-[calc(100svh-6rem)] pb-[72px] pt-24`}>
                <div className="grid md:grid-cols-[42%_1fr] items-end gap-y-8">
                    <div className="order-2 md:order-1 md:pr-10 flex flex-col gap-6 max-w-[34ch]">
                        <p className="m-0 text-[18px] leading-[1.5] text-muted fade-up" style={{ ["--fade-delay" as string]: "700ms" }}>
                            <strong className="text-main font-medium">Oliver Krisetya</strong>, software engineer. B.S. and M.S. in
                            Computer Science from George Washington University. Systems, machine learning and full-stack products that ship.
                        </p>
                        <Link
                            to={easySched.caseStudy!.path}
                            className="self-start inline-flex items-center gap-2 h-12 px-6 rounded-full bg-main text-canvas text-[16px] font-medium no-underline transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98] fade-up"
                            style={{ ["--fade-delay" as string]: "800ms" }}
                        >
                            See Easy-Sched <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                    <h1 className="order-1 md:order-2 m-0 font-semibold text-[10.4vw] md:text-[clamp(56px,7.4vw,124px)] leading-[0.95] tracking-[-0.045em]">
                        <span className="mask-line"><span>I build software</span></span>
                        <span className="mask-line"><span style={{ ["--line-delay" as string]: "110ms" }}>that decides.</span></span>
                    </h1>
                </div>
            </section>

            {/* ---------- Easy-Sched: the flagship, with its film ---------- */}
            <section className="pt-[clamp(80px,12vw,200px)]" aria-labelledby="easy-sched-title">
                <div className={`${frame} grid gap-10 lg:grid-cols-12 items-end`}>
                    <Rise className="lg:col-span-7">
                        <h2 id="easy-sched-title" className="m-0 text-[length:var(--text-head)] font-semibold leading-[0.95] tracking-[-0.045em]">Easy-Sched</h2>
                        <p className="mt-6 mb-0 text-[length:var(--text-lead)] leading-[1.35] tracking-[-0.01em] max-w-[34ch]">
                            {easySched.caseStudy!.summary}
                        </p>
                    </Rise>
                    <Rise className="lg:col-span-5 flex flex-col gap-6" delay={90}>
                        <dl className="m-0 grid grid-cols-3 gap-4">
                            {easySched.caseStudy!.facts.map((f) => (
                                <div key={f.label} className="flex flex-col-reverse gap-1">
                                    <dt className="text-[14px] text-muted">{f.label}</dt>
                                    <dd className="m-0 text-[clamp(20px,1.8vw,26px)] font-semibold tracking-[-0.02em]">{f.value}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className="flex flex-wrap gap-3">
                            <Link to={easySched.caseStudy!.path} className="inline-flex items-center h-12 px-6 rounded-full bg-accent text-accent-ink text-[16px] font-medium no-underline transition-transform hover:scale-[1.03] active:scale-[0.98]">
                                Read the case study
                            </Link>
                            <a href="https://easy-sched.onrender.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center h-12 px-5 rounded-full bg-card text-main text-[16px] no-underline hover:bg-raised transition-colors">
                                Open the live app
                            </a>
                        </div>
                    </Rise>
                </div>
                <Rise className={`${frame} mt-12`} delay={150}>
                    <div className="rounded-2xl overflow-hidden bg-card">
                        <LoopVideo
                            src="/media/easy-sched/demo.mp4"
                            poster="/media/easy-sched/demo-poster.webp"
                            label="Easy-Sched walkthrough: loading the sample term, seeing why each person was placed, locking a placement, re-solving, searching, finalizing and uploading a spreadsheet"
                        />
                    </div>
                </Rise>
                <div className={`${frame} mt-6 grid gap-6 md:grid-cols-12 items-start`}>
                    <Rise as="figure" className="m-0 md:col-span-5">
                        <div className="rounded-2xl overflow-hidden bg-card">
                            <ThemedShot name="panel" alt="The reasons panel: a slot's fit score broken down by rule, and who else could take it" width={760} height={845} />
                        </div>
                        <figcaption className="mt-3 text-[15px] text-muted">Every placement explains itself, rule by rule.</figcaption>
                    </Rise>
                    <Rise as="figure" className="m-0 md:col-span-7" delay={90}>
                        <div className="rounded-2xl overflow-hidden bg-card">
                            <ThemedShot name="upload" alt="CSV upload screen with a template link, the accepted columns and a preview step" width={1400} height={875} />
                        </div>
                        <figcaption className="mt-3 text-[15px] text-muted">Spreadsheets are checked row by row before anything is saved.</figcaption>
                    </Rise>
                </div>
                <Rise className={`${frame} mt-14 grid gap-10 md:grid-cols-3`} delay={120}>
                    {[
                        { t: "Optimal, not just good", d: "Max-weight bipartite matching finds the best possible schedule under the department’s rules, every time." },
                        { t: "Every placement explained", d: "Each slot shows its score rule by rule, who else could take it, and why anyone was left out." },
                        { t: "The coordinator decides", d: "Lock, keep out or place people by hand, re-solve around those choices, undo anything, then export." },
                    ].map((o) => (
                        <div key={o.t} className="flex flex-col gap-2">
                            <h3 className="m-0 text-[clamp(20px,1.6vw,24px)] font-semibold tracking-[-0.02em]">{o.t}</h3>
                            <p className="m-0 text-[length:var(--text-body)] leading-[1.55]">{o.d}</p>
                        </div>
                    ))}
                </Rise>
            </section>

            {/* ---------- Formality: research, set on a tone-step field ---------- */}
            <section className="mt-[clamp(80px,12vw,200px)] bg-card py-[clamp(72px,9vw,140px)]" aria-labelledby="formality-title">
                <div className={`${frame} grid gap-12 lg:grid-cols-12 items-center`}>
                    <Rise as="figure" className="lg:col-span-7 m-0">
                        <img
                            src={formality.caseStudy!.cover.src}
                            alt={formality.caseStudy!.cover.alt}
                            width={formality.caseStudy!.cover.width}
                            height={formality.caseStudy!.cover.height}
                            loading="lazy"
                            className="block w-full h-auto rounded-2xl"
                        />
                    </Rise>
                    <Rise className="lg:col-span-5 flex flex-col gap-6" delay={90}>
                        <h2 id="formality-title" className="m-0 text-[clamp(36px,4.2vw,64px)] font-semibold leading-[1] tracking-[-0.04em]">Why does AI sound so formal?</h2>
                        <p className="m-0 text-[length:var(--text-body)] leading-[1.6]">{formality.caseStudy!.summary}</p>
                        <dl className="m-0 grid grid-cols-3 gap-4">
                            {formality.caseStudy!.facts.map((f) => (
                                <div key={f.label} className="flex flex-col-reverse gap-1">
                                    <dt className="text-[14px] text-muted">{f.label}</dt>
                                    <dd className="m-0 text-[clamp(18px,1.6vw,24px)] font-semibold tracking-[-0.02em]">{f.value}</dd>
                                </div>
                            ))}
                        </dl>
                        <div className="flex flex-wrap gap-3">
                            <Link to="/projects/formality" className="inline-flex items-center h-12 px-6 rounded-full bg-main text-canvas text-[16px] font-medium no-underline transition-transform hover:scale-[1.03] active:scale-[0.98]">
                                Explore the study
                            </Link>
                            <a href="https://github.com/OliverKris/formal-language-bias-llms" target="_blank" rel="noopener noreferrer" className="inline-flex items-center h-12 px-5 rounded-full bg-canvas text-main text-[16px] no-underline hover:bg-raised transition-colors">
                                Code and data
                            </a>
                        </div>
                    </Rise>
                </div>
            </section>

            {/* ---------- All the work, as one running paragraph of names ---------- */}
            <section className={`${frame} pt-[clamp(80px,12vw,200px)]`} aria-labelledby="work-title">
                <Rise className="text-[clamp(26px,2.6vw,36px)] leading-[1.3] tracking-[-0.02em] font-medium">
                    <h2 id="work-title" className="inline m-0 text-[length:inherit] font-semibold">Selected work: </h2>
                    {work.map((p, i) => (
                        <Fragment key={p.id}>
                            <Link to={projectHref(p)} className="group text-muted hover:text-main no-underline transition-colors">
                                {p.short ?? p.title}
                                {FRAMES[p.id] && (
                                    <span className="inline-block align-[-0.1em] ml-[0.25em] h-[0.8em] w-[1.25em] overflow-hidden rounded-[3px] origin-left transition-transform duration-300 group-hover:scale-[1.6]">
                                        <img src={FRAMES[p.id]} alt="" width={60} height={38} loading="lazy" className="block w-full h-full object-cover object-left-top" />
                                    </span>
                                )}
                            </Link>
                            {i < work.length - 1 ? <span className="text-muted">, </span> : <span className="text-muted">.</span>}
                        </Fragment>
                    ))}
                </Rise>
                <Rise delay={90} className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-[15px] text-muted">
                    <span>{projects.length} projects across systems, machine learning and the web</span>
                    <Link to="/projects" className="text-main underline underline-offset-4 decoration-1 hover:text-accent">See all of them with details</Link>
                </Rise>
            </section>

            {/* ---------- About: side facts, a wide paragraph, then the record ---------- */}
            <section className={`${frame} pt-[clamp(80px,12vw,200px)]`} aria-labelledby="about-title">
                <div className="grid gap-10 md:grid-cols-[34%_1fr]">
                    <Rise as="header" className="flex flex-col gap-5 text-[15px]">
                        <h2 id="about-title" className="m-0 text-[clamp(28px,2.6vw,40px)] font-semibold leading-[1.05] tracking-[-0.03em]">Both sides of the desk</h2>
                        <dl className="m-0 grid grid-cols-2 md:grid-cols-1 gap-5">
                            <div><dt className="text-muted">Based in</dt><dd className="m-0">New York and Washington, DC</dd></div>
                            <div><dt className="text-muted">Studied</dt><dd className="m-0">B.S. and M.S., Computer Science, GWU</dd></div>
                            <div><dt className="text-muted">Taught</dt><dd className="m-0">Three years, from LA to graduate TA</dd></div>
                        </dl>
                    </Rise>
                    <Rise delay={90} className="flex flex-col gap-6 md:max-w-[90%]">
                        <p className="m-0 text-[clamp(20px,1.7vw,26px)] leading-[1.4] tracking-[-0.01em]">
                            I studied computer science at George Washington University and spent three years teaching it: as a learning
                            assistant, an undergraduate TA, and a graduate TA writing C assignments and autograders for a systems course.
                            Easy-Sched began there. I have held every job it hands out.
                        </p>
                        <p className="m-0 text-[length:var(--text-body)] leading-[1.6]">
                            I like problems with an answer you can prove, and products people can actually use: a solver that is optimal
                            and also explains itself, research with the statistics to back it, a shell with no dependencies beyond libc.
                            Outside the code I led GW Esports, a 200-member club with twelve teams, and minored in music.
                        </p>
                    </Rise>
                </div>

                <div className="mt-[120px] grid gap-10 md:grid-cols-[34%_1fr]">
                    <Rise><h3 className="m-0 text-[17px] font-semibold">The record</h3></Rise>
                    <Rise delay={90} className="grid gap-12 sm:grid-cols-2">
                        {[{ title: ta.org.replace("The ", ""), roles: [{ role: ta.role, start: ta.start, end: ta.end }, ...(ta.previousRoles ?? [])] },
                          { title: club.org, roles: [{ role: club.role, start: club.start, end: club.end }, ...(club.previousRoles ?? [])] }].map((group) => (
                            <div key={group.title} className="flex flex-col gap-3">
                                <h4 className="m-0 text-[15px] font-semibold">{group.title}</h4>
                                <ul className="list-none m-0 p-0 flex flex-col gap-2.5 text-[15px]">
                                    {group.roles.map((r) => (
                                        <li key={r.role} className="flex justify-between gap-6">
                                            <span>{r.role}</span>
                                            <span className="text-muted tabular-nums whitespace-nowrap">{r.start.slice(-4)}–{r.end === "Present" ? "now" : r.end.slice(-2)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </Rise>
                </div>
            </section>

            {/* ---------- Contact: a full field in the accent ---------- */}
            <section className="mt-[clamp(80px,12vw,200px)] bg-accent text-accent-ink" aria-labelledby="contact-title">
                <div className={`${frame} min-h-[86svh] flex flex-col justify-between py-12 md:py-16`}>
                    <Rise><p className="m-0 text-[clamp(18px,1.6vw,22px)] max-w-[30ch] leading-[1.4]">Hiring for a software engineering role, or curious about the work? I’d like to hear from you.</p></Rise>
                    <Rise delay={90}>
                        <h2 id="contact-title" className="m-0">
                            <Link to="/contact" className="group inline-flex items-baseline gap-[0.2em] text-accent-ink transition-opacity active:opacity-80 no-underline text-[clamp(64px,13vw,220px)] font-semibold leading-[0.9] tracking-[-0.055em]">
                                Let’s talk<span aria-hidden="true" className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-[0.2em] group-focus-visible:translate-x-[0.2em]">→</span>
                            </Link>
                        </h2>
                    </Rise>
                    <div className="flex flex-wrap justify-between gap-4 text-[15px]">
                        <span>New York and Washington, DC</span>
                        <span className="flex gap-6">
                            <a className="text-accent-ink underline underline-offset-4" href="https://linkedin.com/in/okrisetya" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                            <a className="text-accent-ink underline underline-offset-4" href="https://github.com/OliverKris" target="_blank" rel="noopener noreferrer">GitHub</a>
                        </span>
                    </div>
                </div>
            </section>
        </>
    );
}
