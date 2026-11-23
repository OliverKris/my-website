import { useState } from "react";
import { Link } from "react-router-dom";
import { frame, Rise } from "../../../components/site/Rise";
import { LoopVideo, Shot, ThemedShot } from "../../../components/site/Media";
import { SolverPlayground } from "../../../components/easysched/SolverPlayground";
import { ArchitectureDiagram } from "../../../components/easysched/ArchitectureDiagram";
import { CaseStudyBar } from "../../../components/site/CaseStudyBar";
import { Combinations, OriginalFlow, StaffingMap, StatStrip, Team, ThenNow, Timeline } from "../../../components/easysched/Story";

const LIVE = "https://easy-sched.onrender.com";
const REPO = "https://github.com/OliverKris/easy-sched-reworked";

const SCREENS = [
    { id: "board", label: "The board", alt: "Assignments board with a fill meter, filters, and a selected slot's explanation", caption: "Every section and slot at a glance. Empty slots say why they are empty; the panel explains whoever you click." },
    { id: "upload", label: "CSV upload", alt: "Spreadsheet upload with a template, column list and dry-run preview", caption: "Upload a spreadsheet, see every problem in every row before anything is saved, then merge or replace." },
    { id: "rules", label: "Rules", alt: "Rules screen with GPA floors and scoring weights", caption: "GPA floors and the weight of each factor. Changing a rule re-solves the board." },
    { id: "data", label: "Import & export", alt: "Import and export screen with workspace file options", caption: "Workspaces live in the browser. A versioned workspace file carries settings, data and the final schedule anywhere." },
    { id: "welcome", label: "First visit", alt: "Welcome screen offering a blank term, the sample term or a workspace file", caption: "A new coordinator starts from a blank term, the sample, or a file, and a checklist walks them through setup." },
] as const;

const BENCH = [
    { size: "Small", apps: 20, slots: 22, match: "0.3 ms", csp: "365 ms", gap: "5.6%" },
    { size: "Medium", apps: 50, slots: 64, match: "0.6 ms", csp: "337 ms", gap: "12.0%" },
    { size: "Large", apps: 100, slots: 136, match: "1.2 ms", csp: "336 ms", gap: "13.2%" },
];

const STACK = [
    { layer: "Interface", tools: "React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query, React Router, Papa Parse", role: "Six screens, light and dark themes, undo toasts, optimistic refresh after every change." },
    { layer: "API", tools: "FastAPI, Pydantic v2, Uvicorn", role: "Validated endpoints for solving, editing, CSV import, workspaces and export; serves the built app in production." },
    { layer: "Decisions", tools: "NumPy, SciPy, a JSON rule compiler", role: "Eligibility and scoring compiled from a department profile; optimal assignment by max-weight matching." },
    { layer: "Data", tools: "SQLAlchemy 2, SQLite", role: "Isolated workspaces per browser, seeded samples, locks, finalized schedules." },
    { layer: "Quality", tools: "pytest, golden results, a benchmark harness, ESLint", role: "188 tests; solver output pinned against golden files; benchmarks on generated terms." },
    { layer: "Delivery", tools: "Docker, GitHub Actions, Render", role: "CI lints, tests and builds the image; Render deploys main only after checks pass." },
];

const PROFILE = `{
  "department": "GWU Computer Science",
  "hard_rules": [
    { "id": "passed-course", "rule": "passed_course" },
    { "id": "lab", "rule": "conflict_free_lab" },
    { "id": "min-gpa", "rule": "cmp", "positions": ["LA"],
      "field": "applicant.gpa", "op": ">=", "value": 3.0 }
  ],
  "scoring": [
    { "id": "grade", "term": "course_grade", "weight": 3.0 },
    { "id": "experience", "term": "teaching_experience", "weight": 2.5 },
    { "id": "preference", "term": "preference_rank", "weight": 2.5 }
  ]
}`;

function SectionHead({ id, title, children }: { id: string; title: string; children?: React.ReactNode }) {
    return (
        <Rise as="header" className="flex flex-col gap-5 max-w-[60ch]">
            <h2 id={id} className="m-0 text-[clamp(36px,4.4vw,68px)] font-semibold leading-[1] tracking-[-0.04em]">{title}</h2>
            {children && <div className="text-[length:var(--text-body)] leading-[1.6] flex flex-col gap-4">{children}</div>}
        </Rise>
    );
}

export default function EasySchedCaseStudy() {
    const [screen, setScreen] = useState<(typeof SCREENS)[number]["id"]>("board");
    const current = SCREENS.find((s) => s.id === screen)!;

    return (
        <article>
            <CaseStudyBar
                title="Easy-Sched"
                next={{ to: "/projects/formality", label: "Formality bias" }}
                sections={[
                    { id: "problem", label: "The problem" }, { id: "original", label: "The original" }, { id: "rebuild", label: "Then & now" },
                    { id: "solver", label: "The solver" }, { id: "try-solver", label: "Try it" },
                    { id: "architecture", label: "Architecture" }, { id: "rules", label: "Rules" }, { id: "screens", label: "Screens" },
                    { id: "stack", label: "Stack" }, { id: "next", label: "Next" },
                ]}
            />
            {/* ---------- Title ---------- */}
            <header className={`${frame} pt-16 md:pt-24`}>
                <div className="grid gap-10 lg:grid-cols-12 items-end">
                    <div className="lg:col-span-8">
                        <h1 className="m-0 font-semibold text-[length:var(--text-display)] leading-[0.92] tracking-[-0.05em]">
                            <span className="mask-line"><span>Easy-Sched</span></span>
                        </h1>
                        <p className="mt-8 mb-0 text-[length:var(--text-lead)] leading-[1.35] tracking-[-0.01em] max-w-[38ch] fade-up" style={{ ["--fade-delay" as string]: "300ms" }}>
                            Every semester GW’s CS department staffs about forty courses with TAs and learning assistants, and it takes a
                            week by hand. Easy-Sched began as our capstone to fix that. I rebuilt it to find the provably best schedule in a
                            millisecond and explain every placement.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3 fade-up" style={{ ["--fade-delay" as string]: "400ms" }}>
                            <a href={LIVE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center h-12 px-6 rounded-full bg-accent text-accent-ink text-[16px] font-medium no-underline transition-transform hover:scale-[1.03] active:scale-[0.98]">
                                Open the live app
                            </a>
                            <a href={REPO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center h-12 px-5 rounded-full bg-card text-main text-[16px] no-underline hover:bg-raised transition-colors">
                                Read the code
                            </a>
                        </div>
                    </div>
                    <dl className="lg:col-span-4 m-0 grid grid-cols-2 gap-x-6 gap-y-5 text-[15px] fade-up" style={{ ["--fade-delay" as string]: "500ms" }}>
                        <div><dt className="text-muted">Client</dt><dd className="m-0">GW Computer Science</dd></div>
                        <div><dt className="text-muted">Timeline</dt><dd className="m-0">Capstone 2024–25, rebuilt 2026</dd></div>
                        <div><dt className="text-muted">Role</dt><dd className="m-0">Team lead on the capstone; all of the rebuild</dd></div>
                        <div><dt className="text-muted">Status</dt><dd className="m-0">Live, with CI and 188 tests</dd></div>
                    </dl>
                </div>
                <div className="mt-14 fade-up" style={{ ["--fade-delay" as string]: "600ms" }}><StatStrip /></div>
            </header>

            <Rise className={`${frame} mt-14`} delay={200}>
                <Shot ratio={1.6}>
                    <LoopVideo
                        src="/media/easy-sched/demo.mp4"
                        poster="/media/easy-sched/demo-poster.webp"
                        label="Easy-Sched walkthrough with captions: loading the sample term, seeing why each person was placed, locking, re-solving, searching, finalizing and uploading a spreadsheet"
                    />
                </Shot>
            </Rise>

            {/* ---------- The problem ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="problem">
                <div className="grid gap-12 lg:grid-cols-12 items-end">
                    <div className="lg:col-span-7">
                        <SectionHead id="problem" title="A week of work, every semester">
                            <p className="m-0">
                                Each course needs a graduate TA, and the core courses also need undergraduate TAs to run labs and learning
                                assistants to help in class. Every applicant has a GPA, grades in the courses they’d teach, a timetable and a
                                ranked wish list. The department matched them by hand, and it took about a week.
                            </p>
                            <p className="m-0">
                                I was a learning assistant, then an undergraduate TA, then a graduate TA here, so I’ve been on the receiving
                                end of that schedule three times.
                            </p>
                        </SectionHead>
                    </div>
                    <Rise delay={120} className="lg:col-span-5"><Combinations /></Rise>
                </div>
                <Rise delay={120} className="mt-14"><StaffingMap /></Rise>
            </section>

            {/* ---------- The original ---------- */}
            <section className="mt-[clamp(96px,12vw,200px)] bg-card py-[clamp(72px,9vw,140px)]" aria-labelledby="original">
                <div className={`${frame} grid gap-14 lg:grid-cols-12 items-start`}>
                    <div className="lg:col-span-5 flex flex-col gap-10 lg:sticky lg:top-[calc(var(--nav-h,64px)+5rem)]">
                        <SectionHead id="original" title="It started as Team COW’s capstone">
                            <p className="m-0">
                                Easy Sched, “an algorithm-assisted scheduling tool”, was our senior design project for the CS department in
                                2024–25. Three of us built it in a year. I led the team, built the web application and wired it to the scoring
                                and scheduling back end over HTTP.
                            </p>
                        </SectionHead>
                        <Team />
                    </div>
                    <div className="lg:col-span-7 flex flex-col gap-14">
                        <Timeline />
                        <div className="rounded-2xl bg-canvas p-6 md:p-8 flex flex-col gap-5">
                            <h3 className="m-0 text-[clamp(20px,1.8vw,26px)] font-semibold tracking-[-0.02em]">How the original worked</h3>
                            <OriginalFlow />
                        </div>
                    </div>
                </div>
            </section>

            {/* ---------- Then and now ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="rebuild">
                <div className="grid gap-12 lg:grid-cols-12 items-end">
                    <div className="lg:col-span-7">
                        <SectionHead id="rebuild" title="What the rebuild finished">
                            <p className="m-0">
                                The department never used ours. When I picked it up again in 2026 I kept the idea and rebuilt everything else,
                                aiming at the two questions a coordinator actually asks: is this the best possible schedule, and why did this
                                person get this slot?
                            </p>
                        </SectionHead>
                    </div>
                    <Rise as="figure" delay={120} className="lg:col-span-5 m-0">
                        <Shot ratio={760 / 845} fit={0.6}>
                            <ThemedShot name="panel" alt="The reasons panel for one slot: fit score, the score broken down by rule, and who else could take it" width={760} height={845} />
                        </Shot>
                        <figcaption className="mt-3 text-[15px] text-muted">Every placement explains itself: why this person, by how much, and who else could have taken it.</figcaption>
                    </Rise>
                </div>
                <Rise delay={120} className="mt-14"><ThenNow /></Rise>
            </section>

            {/* ---------- The solver ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="solver">
                <SectionHead id="solver" title="The best answer, in a millisecond">
                    <p className="m-0">
                        My first rebuild, in July 2026, used a backtracking search: try a person, recurse, undo. It was clever and it was
                        slow, and on a real-sized term it gave up at its node budget without knowing how far it was from the best answer. But once eligibility is
                        decided up front, assigning people to slots for the highest total fit is a textbook problem: maximum-weight
                        bipartite matching, solved exactly by the Hungarian algorithm in polynomial time.
                    </p>
                    <p className="m-0">
                        So the solver now filters eligibility first, scores every remaining person–slot pair, masks the rest, and hands the
                        matrix to SciPy’s <code className="font-mono text-[0.92em]">linear_sum_assignment</code>. Locked placements are
                        taken out before the solve; blocked pairs are masked. The result is optimal by construction.
                    </p>
                </SectionHead>

                <div className="mt-16 grid gap-6 md:grid-cols-2">
                    <Rise className="rounded-2xl bg-accent text-accent-ink p-8 md:p-10 flex flex-col gap-4">
                        <p className="m-0 text-[clamp(64px,8vw,128px)] font-semibold leading-[0.9] tracking-[-0.05em]">1.2 ms</p>
                        <p className="m-0 text-[17px] leading-[1.5] max-w-[36ch]">Max-weight matching on 100 applicants and 136 slots. Optimal on every benchmark instance.</p>
                    </Rise>
                    <Rise delay={90} className="rounded-2xl bg-card p-8 md:p-10 flex flex-col gap-4">
                        <p className="m-0 text-[clamp(64px,8vw,128px)] font-semibold leading-[0.9] tracking-[-0.05em]">336 ms</p>
                        <p className="m-0 text-[17px] leading-[1.5] max-w-[36ch]">The old backtracking search on the same term: it hit its 300,000-node budget and stopped 13% short of the best schedule.</p>
                    </Rise>
                </div>

                <Rise delay={120} className="mt-10 w-full">
                    <p className="m-0 pb-3 text-[15px] text-muted">Median search time on generated terms (benchmark harness in the repo, seed 3)</p>
                    <div className="w-full tabular-nums" role="table" aria-label="Benchmark results">
                        <div role="row" className="hidden md:grid grid-cols-6 gap-x-4 pb-2 text-[15px] text-muted">
                            <span role="columnheader">Term</span><span role="columnheader">Applicants</span><span role="columnheader">Slots</span>
                            <span role="columnheader">Matching</span><span role="columnheader">Backtracking</span><span role="columnheader">Short of best</span>
                        </div>
                        {BENCH.map((b) => (
                            <div key={b.size} role="row" className="grid grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-1 py-3 border-t border-layout text-[15px]">
                                <span role="rowheader" className="font-semibold col-span-3 md:col-span-1">{b.size}<span className="md:hidden font-normal text-muted"> · {b.apps} applicants, {b.slots} slots</span></span>
                                <span role="cell" className="hidden md:block">{b.apps}</span>
                                <span role="cell" className="hidden md:block">{b.slots}</span>
                                <span role="cell"><span className="md:hidden text-muted">Matching </span><strong className="text-accent">{b.match}</strong></span>
                                <span role="cell"><span className="md:hidden text-muted">Backtracking </span>{b.csp}</span>
                                <span role="cell"><span className="md:hidden text-muted">Short </span>{b.gap}</span>
                            </div>
                        ))}
                    </div>
                </Rise>
            </section>

            {/* ---------- Live ---------- */}
            <section className="mt-[clamp(96px,12vw,200px)] bg-card py-[clamp(72px,9vw,140px)]" id="try-solver" aria-label="Try the solver">
                <div className={frame}>
                    <Rise><SolverPlayground onCard /></Rise>
                    <Rise delay={120} className="mt-8 max-w-[62ch]">
                        <p className="m-0 text-[length:var(--text-body)] leading-[1.6]">
                            A term generated by the benchmark harness (20 applicants, 22 slots), with the scores the rule compiler
                            produced, solved in your browser by the same algorithm: a short TypeScript implementation of the Hungarian
                            method, where the backend uses SciPy. With the department’s weights it reproduces the server’s answer exactly,
                            18 of 22 slots at a total fit of 127.88. Names are made up.
                        </p>
                    </Rise>
                </div>
            </section>

            {/* ---------- Architecture ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="architecture">
                <SectionHead id="architecture" title="One service, six parts">
                    <p className="m-0">
                        The browser talks to a FastAPI backend that owns all the decisions. In production the same process serves the
                        built React app, so the product is one Docker image on one URL.
                    </p>
                </SectionHead>
                <Rise delay={120} className="mt-14"><ArchitectureDiagram /></Rise>
            </section>

            {/* ---------- Rules as data ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)] grid gap-12 lg:grid-cols-12 items-start`} aria-labelledby="rules">
                <div className="lg:col-span-5 min-w-0">
                    <SectionHead id="rules" title="Rules are data, not code">
                        <p className="m-0">
                            In the first rebuild, one department’s rules were constants in the code. Now a department is a JSON profile: hard rules
                            that decide who is eligible, and weighted scoring terms that rank everyone who is. A compiler validates the
                            profile against known fields and turns it into plain functions.
                        </p>
                        <p className="m-0">
                            The same compiled profile drives eligibility, scoring and the explanations, so the reasons the app gives are the
                            rules it actually used. A math department with different requirements is a different file.
                        </p>
                    </SectionHead>
                </div>
                <Rise delay={120} className="lg:col-span-7 min-w-0">
                    <pre className="m-0 p-6 md:p-8 rounded-2xl bg-card overflow-x-auto text-[14px] leading-[1.6]"><code className="font-mono">{PROFILE}</code></pre>
                    <p className="mt-3 text-[15px] text-muted">An excerpt of <code className="font-mono">backend/profiles/gwu_cs.json</code>.</p>
                </Rise>
            </section>

            {/* ---------- Screens ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="screens">
                <SectionHead id="screens" title="Built for the person doing it">
                    <p className="m-0">
                        A coordinator sets rules, adds courses and applicants, solves, adjusts and exports. Every change on the board can
                        be undone from its toast instead of a confirmation dialog. The screenshots follow this site’s theme.
                    </p>
                </SectionHead>
                <Rise delay={90} className="mt-10 flex flex-wrap gap-2" >
                    <div role="tablist" aria-label="Screens" className="flex flex-wrap gap-2">
                        {SCREENS.map((s) => (
                            <button
                                key={s.id}
                                role="tab"
                                aria-selected={screen === s.id}
                                aria-controls="screen-panel"
                                onClick={() => setScreen(s.id)}
                                className={`h-11 px-4 rounded-full text-[15px] cursor-pointer transition-colors ${screen === s.id ? "bg-main text-canvas" : "bg-card text-main hover:bg-raised"}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </Rise>
                <Rise delay={150} className="mt-6">
                    <figure id="screen-panel" role="tabpanel" className="m-0">
                        <Shot ratio={1.6} className="fade-up" key={current.id}>
                            <ThemedShot name={current.id} alt={current.alt} width={current.id === "board" ? 1800 : 1400} height={current.id === "board" ? 1125 : 875} />
                        </Shot>
                        <figcaption className="mt-3 text-[15px] text-muted max-w-[70ch] mx-auto text-center">{current.caption}</figcaption>
                    </figure>
                </Rise>
            </section>

            {/* ---------- Stack ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="stack">
                <SectionHead id="stack" title="What it is made of" />
                <Rise delay={90} className="mt-10 w-full">
                    <div className="w-full" role="table" aria-label="What Easy-Sched is made of">
                        <div role="row" className="hidden md:grid grid-cols-[minmax(0,2fr)_minmax(0,5fr)_minmax(0,6fr)] gap-x-8 pb-3 text-[15px] text-muted">
                            <span role="columnheader">Layer</span><span role="columnheader">Tools</span><span role="columnheader">What it does here</span>
                        </div>
                        {STACK.map((r) => (
                            <div key={r.layer} role="row"
                                className="w-full grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,5fr)_minmax(0,6fr)] gap-x-8 gap-y-1 py-5 border-t border-layout">
                                <span role="rowheader" className="text-[17px] font-semibold">{r.layer}</span>
                                <span role="cell" className="text-[16px]">{r.tools}</span>
                                <span role="cell" className="text-[16px] text-muted">{r.role}</span>
                            </div>
                        ))}
                    </div>
                </Rise>
            </section>

            {/* ---------- Next ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)] pb-[clamp(96px,12vw,200px)] grid gap-12 lg:grid-cols-12`} aria-labelledby="next">
                <div className="lg:col-span-6">
                    <SectionHead id="next" title="What comes next">
                        <ul className="m-0 pl-5 flex flex-col gap-3">
                            <li>A summary after each re-solve: who moved, which slots filled, each change clickable.</li>
                            <li>A by-person view of the board, with hours per person and who is still unplaced.</li>
                            <li>Profile templates and custom roles beyond LA and UTA, edited in the app.</li>
                            <li>A pilot with a real department for one term.</li>
                        </ul>
                    </SectionHead>
                </div>
                <Rise delay={90} className="lg:col-span-6 self-end">
                    <Link to="/projects/formality" className="group block rounded-2xl bg-card p-8 md:p-10 no-underline text-main hover:bg-raised transition-colors">
                        <span className="flex items-baseline justify-between gap-4 text-[clamp(26px,3vw,44px)] font-semibold tracking-[-0.03em] leading-[1.05]">
                            Next: formality bias in LLMs
                            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                        <span className="block mt-3 text-[16px] text-muted">Research across six model families, with a live formality scorer.</span>
                    </Link>
                </Rise>
            </section>
        </article>
    );
}
