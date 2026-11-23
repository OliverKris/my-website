import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";

/*
  The story half of the Easy-Sched case study: the department's problem, the Team COW capstone
  it started as, and what changed in the rebuild.

  Sources:
  - Courses: GWU Schedule of Classes, CSCI, Main Campus, Spring 2027 (term 202701). Cross-listed
    pairs counted once; cancelled, research, thesis, dissertation and colloquium listings left out.
  - Staffing rules (Oliver, from the department's practice): one GTA per course; core courses take
    2–3 UTAs and 1–3 LAs; other undergraduate courses take at least one UTA. Counts are estimates.
  - By hand: about a week of work per semester (Oliver).
  - Capstone: Team COW project page, final presentation (9.44035092 × 10^10 combinations) and poster.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- count-up numbers ---------- */

function useCount(target: number, run: boolean, duration = 1400) {
    const [v, setV] = useState(0);
    useEffect(() => {
        if (!run) return;
        // With reduced motion the number lands on the first frame instead of counting.
        const span = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : duration;
        let raf = 0;
        const t0 = performance.now();
        const step = (t: number) => {
            const p = Math.min(1, (t - t0) / span);
            setV(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [target, run, duration]);
    return v;
}

function Num({ to, run, decimals = 0, duration }: { to: number; run: boolean; decimals?: number; duration?: number }) {
    const v = useCount(to, run, duration);
    return <>{v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}

export function StatStrip() {
    const ref = useRef<HTMLDListElement>(null);
    const run = useInView(ref, { once: true, amount: 0.5 });
    const stats = [
        { value: <Num to={41} run={run} />, label: "courses to staff on GW CS’s Spring 2027 schedule" },
        { value: <><Num to={84} run={run} />–<Num to={108} run={run} /></>, label: "GTA, UTA and LA positions a semester (estimated)" },
        { value: <>~<Num to={1} run={run} duration={600} /> week</>, label: "to build the schedule by hand" },
        { value: <><Num to={1.2} run={run} decimals={1} /> ms</>, label: "for the rebuilt solver to find the best one" },
    ];
    return (
        <dl ref={ref} className="m-0 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-layout">
            {stats.map((s, i) => (
                <motion.div key={i} className="bg-canvas p-6 md:p-7 flex flex-col-reverse gap-2"
                    initial={{ opacity: 0, y: 14 }} animate={run ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: EASE, delay: i * 0.08 }}>
                    <dt className="text-[14px] leading-[1.4] text-muted max-w-[24ch]">{s.label}</dt>
                    <dd className={`m-0 text-[clamp(32px,3.6vw,52px)] font-semibold leading-none tracking-[-0.04em] tabular-nums ${i === 3 ? "text-accent" : ""}`}>{s.value}</dd>
                </motion.div>
            ))}
        </dl>
    );
}

/* ---------- the staffing map: every course, every slot ---------- */

type Group = "core" | "ugrad" | "grad";
const COURSES: { n: string; g: Group }[] = [
    ...["1012", "1111", "1112", "1311", "2113", "2441/2541", "3313", "3401"].map((n) => ({ n, g: "core" as const })),
    ...["1022", "1023", "2460", "3552", "4237", "4244", "4364/6364", "4366/6366", "4431/6431", "4454", "4455", "4527/6527", "4531/6531", "4541/6541", "4554",
        "4907 Cloud", "4907 AI Sec", "4907 Data Mgmt", "4907/6444"].map((n) => ({ n, g: "ugrad" as const })),
    ...["6212", "6221", "6231", "6234", "6418", "6421", "6442", "6443", "6461", "6513", "6534", "6548", "6554", "6562"].map((n) => ({ n, g: "grad" as const })),
];
/** Slots per course: [GTA, required UTAs, flexible UTAs, required LAs, flexible LAs]. */
const SLOTS: Record<Group, [number, number, number, number, number]> = { core: [1, 2, 1, 1, 2], ugrad: [1, 1, 0, 0, 0], grad: [1, 0, 0, 0, 0] };
const GROUPS: { g: Group; title: string; note: string }[] = [
    { g: "core", title: "Core & intro", note: "1 GTA · 2–3 UTAs · 1–3 LAs" },
    { g: "ugrad", title: "Undergraduate electives & others", note: "1 GTA · 1+ UTA" },
    { g: "grad", title: "Graduate", note: "1 GTA" },
];
const REQUIRED = COURSES.reduce((n, c) => { const s = SLOTS[c.g]; return n + s[0] + s[1] + s[3]; }, 0); // 84
const FLEXIBLE = COURSES.reduce((n, c) => { const s = SLOTS[c.g]; return n + s[2] + s[4]; }, 0); // 24

function Pip({ kind, filled, flexible }: { kind: "G" | "U" | "L"; filled: boolean; flexible?: boolean }) {
    const shape = kind === "G" ? "rounded-full w-3 h-3" : kind === "U" ? "rounded-[3px] w-2.5 h-2.5" : "rounded-full w-2 h-2";
    if (flexible) return <span aria-hidden="true" className={`${shape} border border-dashed border-main/40`} />;
    return (
        <span aria-hidden="true" className={`${shape} border transition-colors duration-300 ${filled ? "bg-accent border-accent" : "border-main/40"}`} />
    );
}

export function StaffingMap() {
    const ref = useRef<HTMLDivElement>(null);
    const seen = useInView(ref, { once: true, amount: 0.25 });
    const [filled, setFilled] = useState(0);
    const [mode, setMode] = useState<"idle" | "hand" | "solved">("idle");
    const timer = useRef<number | null>(null);
    const stop = () => { if (timer.current !== null) { window.clearInterval(timer.current); timer.current = null; } };
    useEffect(() => stop, []);

    const byHand = () => {
        stop();
        setMode("hand");
        setFilled(0);
        let k = 0;
        timer.current = window.setInterval(() => {
            k += 1;
            setFilled(k);
            if (k >= REQUIRED) stop();
        }, 7000 / REQUIRED);
    };
    const solve = () => { stop(); setMode("solved"); setFilled(REQUIRED); };
    const reset = () => { stop(); setMode("idle"); setFilled(0); };
    const day = Math.max(1, Math.ceil((filled / REQUIRED) * 7));

    // Slot order for filling: course by course, GTA first.
    let index = 0;
    const tile = (c: { n: string; g: Group }, i: number) => {
        const [g, u, uf, l, lf] = SLOTS[c.g];
        const pips: { kind: "G" | "U" | "L"; flexible?: boolean; at?: number }[] = [];
        for (let k = 0; k < g; k++) pips.push({ kind: "G", at: index++ });
        for (let k = 0; k < u; k++) pips.push({ kind: "U", at: index++ });
        for (let k = 0; k < uf; k++) pips.push({ kind: "U", flexible: true });
        for (let k = 0; k < l; k++) pips.push({ kind: "L", at: index++ });
        for (let k = 0; k < lf; k++) pips.push({ kind: "L", flexible: true });
        const [num, ...rest] = c.n.split(" ");
        return (
            <motion.li key={c.n} className="list-none rounded-xl bg-canvas px-3 py-2.5 flex flex-col gap-2 min-w-[92px]"
                initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={seen ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.45, ease: EASE, delay: 0.1 + i * 0.018 }}>
                <span className="text-[13px] font-semibold tabular-nums leading-none whitespace-nowrap">
                    {num}{rest.length > 0 && <span className="font-normal text-muted"> {rest.join(" ")}</span>}
                </span>
                <span className="flex items-center gap-1 h-3">{pips.map((p, k) => <Pip key={k} kind={p.kind} flexible={p.flexible} filled={p.at !== undefined && p.at < filled} />)}</span>
            </motion.li>
        );
    };

    let order = 0;
    return (
        <div ref={ref} className="rounded-2xl bg-card p-5 md:p-8 flex flex-col gap-7" data-ui>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="m-0 text-[15px] text-muted flex flex-wrap gap-x-5 gap-y-2" aria-hidden="true">
                    <span className="inline-flex items-center gap-2"><Pip kind="G" filled />GTA</span>
                    <span className="inline-flex items-center gap-2"><Pip kind="U" filled />UTA</span>
                    <span className="inline-flex items-center gap-2"><Pip kind="L" filled />LA</span>
                    <span className="inline-flex items-center gap-2"><Pip kind="U" filled={false} flexible />Flexible slot</span>
                </p>
                <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={byHand} className="h-11 px-4 rounded-full bg-canvas text-main text-[15px] cursor-pointer hover:bg-raised transition-colors">Fill it by hand</button>
                    <button type="button" onClick={solve} className="h-11 px-5 rounded-full bg-accent text-accent-ink text-[15px] font-medium cursor-pointer transition-transform hover:scale-[1.03] active:scale-[0.98]">Solve it</button>
                    {mode !== "idle" && <button type="button" onClick={reset} className="h-11 px-4 rounded-full text-main text-[15px] cursor-pointer hover:bg-raised transition-colors">Reset</button>}
                </div>
            </div>

            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                {GROUPS.map((grp) => {
                    const list = COURSES.filter((c) => c.g === grp.g);
                    return (
                        <section key={grp.g} className={`flex flex-col gap-3 ${grp.g === "ugrad" ? "lg:row-span-2" : ""}`}>
                            <h3 className="m-0 flex flex-wrap items-baseline justify-between gap-2">
                                <span className="text-[16px] font-semibold">{grp.title} <span className="text-muted font-normal tabular-nums">· {list.length}</span></span>
                                <span className="text-[13px] text-muted">{grp.note}</span>
                            </h3>
                            <ul className="m-0 p-0 flex flex-wrap gap-2">{list.map((c) => tile(c, order++))}</ul>
                        </section>
                    );
                })}
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-4 pt-1 border-t border-layout" aria-live="polite">
                <p className="m-0 pt-4 text-[clamp(20px,2vw,28px)] font-semibold tracking-[-0.02em] tabular-nums">
                    {mode === "idle" && <>{REQUIRED} slots to fill, plus up to {FLEXIBLE} flexible ones.</>}
                    {mode === "hand" && (filled < REQUIRED ? <>Day {day}: {filled} of {REQUIRED} filled…</> : <>About a week later, all {REQUIRED} filled.</>)}
                    {mode === "solved" && <span className="text-accent">All {REQUIRED} filled in about a millisecond.</span>}
                </p>
                <p className="m-0 pt-4 text-[13px] text-muted max-w-[52ch]">
                    The 41 classes on GW CS’s Spring 2027 schedule, staffed by the department’s rule of thumb. Slot counts are an
                    estimate; the week is the department’s, the millisecond is the solver’s benchmark at 136 slots.
                </p>
            </div>
        </div>
    );
}

export function Combinations() {
    const ref = useRef<HTMLDivElement>(null);
    const run = useInView(ref, { once: true, amount: 0.3 });
    return (
        <div ref={ref} className="flex flex-col gap-2">
            <p className="m-0 text-[clamp(34px,4.2vw,64px)] font-semibold leading-[0.95] tracking-[-0.04em] tabular-nums whitespace-nowrap">
                <Num to={94403509200} run={run} duration={2200} />
            </p>
            <p className="m-0 text-[16px] leading-[1.5] text-muted max-w-[50ch]">
                Possible assignments for one term (9.44 × 10¹⁰), the figure Team COW used in our final presentation to show why
                nobody should do this by hand.
            </p>
        </div>
    );
}

/* ---------- the original: timeline, team, workflow ---------- */

const MILESTONES = [
    { when: "Fall 2024", what: "Team COW forms", text: "Three seniors in GW’s CS capstone (CSCI 4243W) take on the department’s TA scheduling, with Professor Tim Wood as client." },
    { when: "Dec 15, 2024", what: "Final presentation", text: "The design, the scoring and scheduling algorithms, and the scale of the problem: 9.44 × 10¹⁰ possible assignments." },
    { when: "Spring 2025", what: "Built and demoed", text: "A Django app that scores every applicant instantly and assigns them automatically. The project poster followed on April 16; the app was demoed to the department, which didn’t adopt it." },
    { when: "July 2026", what: "I start over, alone", text: "To hit the stretch goals we never reached: a real database, a REST API and a scheduling algorithm written from scratch. React and FastAPI replace Django." },
    { when: "Nov 2026", what: "Exact, explained, live", text: "An exact matching solver, an explanation for every slot, department rule profiles, 188 tests, CI, and a public demo." },
];

export function Timeline() {
    const ref = useRef<HTMLOListElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
    const grow = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
    return (
        <ol ref={ref} className="relative m-0 p-0 list-none flex flex-col gap-10 pl-10">
            <span aria-hidden="true" className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-layout rounded-full" />
            <motion.span aria-hidden="true" className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-accent rounded-full origin-top" style={{ scaleY: grow }} />
            {MILESTONES.map((m, i) => (
                <motion.li key={m.when} className="relative flex flex-col gap-1.5"
                    initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: EASE }}>
                    <span aria-hidden="true" className={`absolute -left-10 top-1 w-4 h-4 rounded-full border-2 ${i >= 3 ? "bg-accent border-accent" : "bg-canvas border-accent"}`} />
                    <span className="text-[14px] font-semibold text-accent tabular-nums">{m.when}</span>
                    <span className="text-[clamp(20px,1.8vw,26px)] font-semibold tracking-[-0.02em] leading-[1.15]">{m.what}</span>
                    <span className="text-[16px] leading-[1.6] max-w-[56ch]">{m.text}</span>
                </motion.li>
            ))}
        </ol>
    );
}

const TEAM = [
    { name: "Cynthia Driskell", role: "Scheduling algorithm", lead: false },
    { name: "Oliver Krisetya", role: "Web application and backend integration over HTTP", lead: true, me: true },
    { name: "Will Huizinga", role: "Evaluation (scoring) algorithm", lead: false },
];

export function Team() {
    return (
        <ul className="m-0 p-0 list-none grid gap-3 sm:grid-cols-3">
            {TEAM.map((t, i) => (
                <motion.li key={t.name} className={`rounded-2xl p-5 flex flex-col gap-2 ${t.me ? "bg-accent-soft ring-1 ring-accent/40" : "bg-canvas"}`}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}>
                    <span className="text-[17px] font-semibold">{t.name}</span>
                    <span className="text-[15px] leading-[1.45]">{t.role}</span>
                    {t.lead && <span className="mt-auto pt-1 text-[13px] text-muted">Team lead</span>}
                </motion.li>
            ))}
        </ul>
    );
}

const FLOW = [
    { t: "Upload", d: "Applications and the term’s courses go into one database." },
    { t: "Score", d: "Every applicant is scored for every course, “nearly instantaneous”." },
    { t: "Adjust", d: "Change a weight and everyone is rescored on the spot." },
    { t: "Assign", d: "Pick people slot by slot, or auto-assign from the scores." },
];

export function OriginalFlow() {
    const ref = useRef<HTMLOListElement>(null);
    const run = useInView(ref, { once: true, amount: 0.5 });
    return (
        <div className="flex flex-col gap-4">
            <ol ref={ref} className="relative m-0 p-0 list-none grid gap-6 sm:grid-cols-4">
                <motion.span aria-hidden="true" className="hidden sm:block absolute left-[18px] right-[18px] top-[17px] h-[2px] bg-accent/50 origin-left"
                    initial={{ scaleX: 0 }} animate={run ? { scaleX: 1 } : {}} transition={{ duration: 1.2, ease: EASE, delay: 0.15 }} />
                {FLOW.map((f, i) => (
                    <motion.li key={f.t} className="relative flex flex-col gap-2"
                        initial={{ opacity: 0, y: 12 }} animate={run ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, ease: EASE, delay: 0.2 + i * 0.22 }}>
                        <span className="relative z-10 grid place-items-center w-9 h-9 rounded-full bg-accent text-accent-ink text-[15px] font-semibold">{i + 1}</span>
                        <span className="text-[18px] font-semibold">{f.t}</span>
                        <span className="text-[15px] leading-[1.5] text-muted">{f.d}</span>
                    </motion.li>
                ))}
            </ol>
            <p className="m-0 text-[14px] text-muted">Built with Django, Python, SQLite, HTML and JavaScript. Unfinished: the “longevity” features, a database that would learn from past terms.</p>
        </div>
    );
}

/* ---------- then and now ---------- */

const COMPARE = [
    { k: "Built by", then: "Team COW: three seniors, one capstone year", now: "Me, solo" },
    { k: "Stack", then: "Django, SQLite, HTML and JavaScript", now: "FastAPI, React 19, SQLite, SciPy, Docker" },
    { k: "Assignment", then: "By hand, or auto-assigned from the scores", now: "Exact max-weight matching: the best schedule, provably" },
    { k: "Rules", then: "Adjustable scoring weights", now: "Department profiles in JSON: hard rules plus weights" },
    { k: "Status", then: "Demoed to the department", now: "Live demo, 188 tests, CI and deploys on green" },
];

export function ThenNow() {
    return (
        <div className="w-full" role="table" aria-label="The capstone and the rebuild compared">
            <div role="row" className="hidden md:grid grid-cols-[minmax(0,2fr)_minmax(0,5fr)_minmax(0,6fr)] gap-x-8 pb-3 text-[15px] text-muted">
                <span role="columnheader" /><span role="columnheader">Capstone, 2024–25</span><span role="columnheader" className="text-accent font-semibold">Rebuild, 2026</span>
            </div>
            {COMPARE.map((r, i) => (
                <motion.div key={r.k} role="row" className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,5fr)_minmax(0,6fr)] gap-x-8 gap-y-1 py-5 border-t border-layout"
                    initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.55, ease: EASE, delay: i * 0.05 }}>
                    <span role="rowheader" className="text-[16px] font-semibold">{r.k}</span>
                    <span role="cell" className="text-[16px] text-muted"><span className="md:hidden text-[13px]">Capstone: </span>{r.then}</span>
                    <span role="cell" className="text-[16px]"><span className="md:hidden text-[13px] text-accent">Rebuild: </span>{r.now}</span>
                </motion.div>
            ))}
        </div>
    );
}
