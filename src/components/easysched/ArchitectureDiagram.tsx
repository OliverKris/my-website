import { useState } from "react";

type NodeId = "react" | "api" | "db" | "compiler" | "solver" | "explain";

interface Part {
    id: NodeId;
    name: string;
    tech: string;
    does: string;
    files: string[];
    /** grid placement on desktop */
    col: string;
    row: number;
}

const PARTS: Part[] = [
    {
        id: "react", name: "React app", tech: "React 19 · TypeScript · TanStack Query · Tailwind v4",
        does: "Every screen a coordinator works in: the setup checklist, editors, CSV upload with a dry-run preview, and the assignments board. Server state lives in TanStack Query; each browser gets an anonymous id sent as X-Client-Id.",
        files: ["frontend/src/features/assign/AssignPage.tsx", "frontend/src/api/hooks.ts", "frontend/src/lib/api.ts"],
        col: "md:col-start-1 md:col-span-3 md:row-start-1", row: 1,
    },
    {
        id: "api", name: "FastAPI", tech: "FastAPI · Pydantic v2 · Uvicorn",
        does: "Validates every request, checks the workspace belongs to this browser, and serves the built frontend in production, so the whole product is one service on one URL.",
        files: ["backend/api.py"],
        col: "md:col-start-5 md:col-span-3 md:row-start-1", row: 1,
    },
    {
        id: "db", name: "SQLite", tech: "SQLAlchemy 2",
        does: "Workspaces, courses, sections, applicants, locks and finalized schedules. Each workspace is an isolated dataset, seeded from a sample or started blank.",
        files: ["backend/ta_assignment/db/models.py", "backend/ta_assignment/db/workspaces.py"],
        col: "md:col-start-9 md:col-span-3 md:row-start-1", row: 1,
    },
    {
        id: "compiler", name: "Rule compiler", tech: "Pydantic schema · plain Python closures",
        does: "Turns a department profile written in JSON (hard rules plus weighted scoring terms) into fast eligibility checks and scoring functions. The solver never knows what “GPA” or “lab” means.",
        files: ["backend/ta_assignment/rules/compiler.py", "backend/profiles/gwu_cs.json"],
        col: "md:col-start-9 md:col-span-3 md:row-start-3", row: 2,
    },
    {
        id: "solver", name: "Matching solver", tech: "NumPy · SciPy linear_sum_assignment",
        does: "Builds a slot × applicant score matrix, masks ineligible pairs, honours locks and blocks, and finds the maximum-weight matching: the provably best schedule, in about a millisecond.",
        files: ["backend/ta_assignment/matching_solver.py", "backend/ta_assignment/csp_solver.py"],
        col: "md:col-start-5 md:col-span-3 md:row-start-3", row: 2,
    },
    {
        id: "explain", name: "Explanations", tech: "Python",
        does: "For every slot: the score broken down by rule, the next-best people and where they went instead, and for empty slots the first rule that ruled each person out.",
        files: ["backend/solve_view.py"],
        col: "md:col-start-1 md:col-span-3 md:row-start-3", row: 2,
    },
];

/** One solve, end to end. Each step lights the parts it touches. */
const TRACE: { at: NodeId[]; text: string }[] = [
    { at: ["react"], text: "The coordinator presses Re-run. TanStack Query posts the workspace id, rule settings and weights to /api/solve." },
    { at: ["api", "db"], text: "FastAPI checks the workspace belongs to this browser, then loads its sections, applicants and locks from SQLite." },
    { at: ["compiler"], text: "The rule compiler turns the department profile into eligibility checks and scoring functions." },
    { at: ["solver"], text: "The solver scores every eligible pair, applies locks, and runs linear_sum_assignment for the best possible schedule." },
    { at: ["explain"], text: "Each slot gets its reasons: the score breakdown, the alternatives, and why anyone was left out." },
    { at: ["react"], text: "The board re-renders. Slots that changed hands flash, so the coordinator sees exactly what moved." },
];

/**
 * Easy-Sched's architecture as a figure you can question: click a part to
 * see what it does and where it lives, or step through one solve request.
 */
export function ArchitectureDiagram() {
    const [selected, setSelected] = useState<NodeId>("solver");
    const [step, setStep] = useState<number | null>(null);
    const lit = step === null ? [selected] : TRACE[step].at;
    const part = PARTS.find((p) => p.id === (step === null ? selected : TRACE[step].at[0]))!;

    return (
        <div className="grid gap-8 lg:grid-cols-12 items-start" data-ui>
            <figure className="lg:col-span-7 m-0 relative rounded-2xl bg-card p-5 md:p-8">
                <div className="relative grid grid-cols-2 md:grid-cols-11 md:grid-rows-[auto_44px_auto] gap-3 md:gap-x-0 md:gap-y-0">
                    {/* connectors sit in their own grid cells, so they always meet the parts */}
                    <Arrow className="md:col-start-4 md:row-start-1" dir="right" />
                    <Arrow className="md:col-start-8 md:row-start-1" dir="right" />
                    <Arrow className="md:col-start-10 md:row-start-2" dir="down" />
                    <Arrow className="md:col-start-8 md:row-start-3" dir="left" />
                    <Arrow className="md:col-start-4 md:row-start-3" dir="left" />
                    <Arrow className="md:col-start-2 md:row-start-2" dir="up" />
                    {PARTS.map((p) => {
                        const on = lit.includes(p.id);
                        return (
                            <button
                                key={p.id}
                                type="button"
                                aria-pressed={selected === p.id && step === null}
                                onClick={() => { setStep(null); setSelected(p.id); }}
                                className={`${p.col} text-left min-h-24 p-4 rounded-xl cursor-pointer transition-[background-color,color,transform] duration-300 ${
                                    on ? "bg-accent text-accent-ink scale-[1.03]" : "bg-canvas text-main hover:bg-raised"}`}
                            >
                                <span className="block text-[17px] font-semibold tracking-[-0.01em]">{p.name}</span>
                                <span className={`block mt-1 text-[13px] leading-snug ${on ? "opacity-80" : "text-muted"}`}>{p.tech.split(" · ")[0]}</span>
                            </button>
                        );
                    })}
                </div>
                <figcaption className="relative mt-6 text-[15px] text-muted">
                    Click a part to see what it does, or follow one request through the system.
                </figcaption>
            </figure>

            <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setStep((s) => (s === null ? 0 : Math.min(TRACE.length - 1, s + 1)))}
                        disabled={step === TRACE.length - 1}
                        className="h-11 px-5 rounded-full bg-accent text-accent-ink text-[15px] font-medium cursor-pointer disabled:opacity-40 disabled:cursor-default transition-transform active:scale-[0.98]"
                    >
                        {step === null ? "Trace a solve" : "Next step"}
                    </button>
                    {step !== null && (
                        <>
                            <button type="button" onClick={() => setStep((s) => (s ? s - 1 : 0))} disabled={step === 0}
                                className="h-11 px-4 rounded-full bg-card text-main text-[15px] cursor-pointer disabled:opacity-40">
                                Back
                            </button>
                            <button type="button" onClick={() => setStep(null)} className="h-11 px-4 rounded-full text-muted hover:text-main text-[15px] cursor-pointer">
                                Stop
                            </button>
                        </>
                    )}
                </div>

                <div key={step === null ? part.id : `step-${step}`} className="fade-up flex flex-col gap-4" aria-live="polite">
                    {step !== null ? (
                        <>
                            <span className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={TRACE.length} aria-valuenow={step + 1} aria-label="Progress through the request">
                                {TRACE.map((_, i) => <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? "bg-accent" : "bg-card"}`} />)}
                            </span>
                            <p className="m-0 text-[clamp(20px,1.7vw,26px)] leading-[1.35] tracking-[-0.01em]">{TRACE[step].text}</p>
                        </>
                    ) : (
                        <>
                            <h3 className="m-0 text-[clamp(24px,2.2vw,32px)] font-semibold tracking-[-0.02em]">{part.name}</h3>
                            <p className="m-0 text-[17px] leading-relaxed">{part.does}</p>
                            <p className="m-0 text-[15px] text-muted">{part.tech}</p>
                            <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
                                {part.files.map((f) => (
                                    <li key={f}>
                                        <a
                                            href={`https://github.com/OliverKris/easy-sched-reworked/blob/main/${f}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            /* taste-skill-ignore: a file path is literal code */ className="font-mono text-[14px] text-accent no-underline hover:underline break-all"
                                        >
                                            <code>{f}</code>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function Arrow({ dir, className = "" }: { dir: "right" | "left" | "down" | "up"; className?: string }) {
    const rotate = { right: 0, down: 90, left: 180, up: 270 }[dir];
    return (
        <span aria-hidden="true" className={`hidden md:flex items-center justify-center text-muted ${className}`}>
            <svg width="28" height="14" viewBox="0 0 28 14" style={{ transform: `rotate(${rotate}deg)` }}>
                <path d="M1 7h24M19 2l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    );
}
