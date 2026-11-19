import { useMemo, useState } from "react";
import { maxWeightMatching } from "../../lib/hungarian";
import { APPLICANTS, DEFAULT_WEIGHTS, SLOTS, type Feature } from "../../data/easySchedSample";

const FEATURES: { key: Feature; label: string }[] = [
    { key: "grade", label: "Grade in the course" },
    { key: "preference", label: "Their own ranking" },
    { key: "experience", label: "Teaching experience" },
    { key: "recommendation", label: "Recommendations" },
    { key: "skill", label: "Skill match" },
    { key: "utaBonus", label: "UTA readiness" },
];

const EXAMPLES = ["CSCI 1031", "Algorithms", "Grace", "UTA"];
const PEOPLE = Object.keys(APPLICANTS);

interface Placement { person: string | null; score: number; parts: { key: Feature; points: number }[] }

/** Re-solve the whole sample term with the given weights. */
function solve(weights: Record<Feature, number>) {
    const matrix = SLOTS.map((slot) => PEOPLE.map((p) => {
        const c = slot.candidates.find((c) => c.id === p);
        if (!c) return null;
        return (Object.entries(c.f) as [Feature, number][]).reduce((t, [k, v]) => t + weights[k] * v, 0);
    }));
    const pick = maxWeightMatching(matrix);
    const placements = new Map<string, Placement>();
    let total = 0;
    SLOTS.forEach((slot, i) => {
        const j = pick[i];
        if (j < 0) { placements.set(slot.id, { person: null, score: 0, parts: [] }); return; }
        const c = slot.candidates.find((c) => c.id === PEOPLE[j])!;
        const parts = (Object.entries(c.f) as [Feature, number][])
            .map(([key, v]) => ({ key, points: weights[key] * v }))
            .filter((p) => p.points > 0.005)
            .sort((a, b) => b.points - a.points);
        const score = matrix[i][j]!;
        total += score;
        placements.set(slot.id, { person: PEOPLE[j], score, parts });
    });
    return { placements, total };
}

/**
 * The live thing: Easy-Sched's sample term, solved in the browser with the
 * same max-weight matching the app runs on the server. Type a course, a
 * person or a role; drag a weight and every slot is re-decided.
 */
export function SolverPlayground({ headingLevel = "h2", onCard = false }: { headingLevel?: "h2" | "h3"; onCard?: boolean }) {
    // Rows and controls take the surface one step away from whatever the widget sits on.
    const tile = onCard ? "bg-canvas" : "bg-card";
    const tileHover = "hover:bg-raised";
    const [query, setQuery] = useState("CSCI 1031");
    const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
    const { placements, total } = useMemo(() => solve(weights), [weights]);

    // When a re-solve hands a slot to someone else, bump its flash count: the
    // row remounts under a new key and its highlight animation plays once.
    const [prev, setPrev] = useState(placements);
    const [flash, setFlash] = useState<Record<string, number>>({});
    if (prev !== placements) {
        const next = { ...flash };
        for (const [id, p] of placements) {
            if (prev.get(id)?.person !== p.person) next[id] = (next[id] ?? 0) + 1;
        }
        setPrev(placements);
        setFlash(next);
    }

    const q = query.trim().toLowerCase();
    const rows = SLOTS.filter((s) => {
        if (!q) return true;
        const who = placements.get(s.id)?.person;
        const name = who ? APPLICANTS[who].toLowerCase() : "";
        return [s.course, s.title, s.section, s.position].some((t) => t.toLowerCase().includes(q)) || (name && name.includes(q));
    });
    const filled = [...placements.values()].filter((p) => p.person).length;
    const Heading = headingLevel;
    const maxPoints = 4;

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-wrap items-baseline gap-x-[0.3em] text-[clamp(40px,6.4vw,104px)] font-semibold leading-[1] tracking-[-0.045em]">
                <Heading className="m-0 text-[length:inherit] font-semibold">Who should teach</Heading>
                <label className="relative flex-1 min-w-[6ch]" data-ui>
                    <span className="sr-only">A course, a person or a role</span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        spellCheck={false}
                        className="w-full bg-transparent border-0 p-0 m-0 text-accent font-semibold tracking-[-0.045em] outline-none caret-accent placeholder:text-muted/50"
                        placeholder="any course"
                    />
                </label>
            </div>

            <div className="flex flex-wrap gap-2" aria-label="Examples">
                {EXAMPLES.map((ex) => (
                    <button
                        key={ex}
                        type="button"
                        onClick={() => setQuery(ex)}
                        className={`h-11 px-4 rounded-full text-[15px] cursor-pointer transition-colors ${
                            query === ex ? "bg-main text-canvas" : `${tile} text-main ${tileHover}`}`}
                    >
                        {ex}
                    </button>
                ))}
                <button type="button" onClick={() => setQuery("")} className="h-11 px-4 rounded-full text-[15px] text-muted hover:text-main cursor-pointer">
                    Show all
                </button>
            </div>

            <div className="grid gap-10 lg:grid-cols-12 items-start" data-ui>
                <div className="lg:col-span-8 flex flex-col">
                    <div className="flex flex-wrap items-baseline justify-between gap-3 pb-3 text-[15px] text-muted">
                        <span><strong className="text-main font-semibold tabular-nums">{filled}</strong> of {SLOTS.length} slots filled</span>
                        <span>total fit <strong className="text-main font-semibold tabular-nums">{total.toFixed(2)}</strong></span>
                    </div>
                    <ul className="list-none m-0 p-0 flex flex-col gap-2" aria-live="polite">
                        {rows.map((slot) => {
                            const p = placements.get(slot.id)!;
                            return (
                                <li
                                    key={`${slot.id}-${flash[slot.id] ?? 0}`}
                                    className={`grid grid-cols-[1fr_auto] sm:grid-cols-[180px_1fr_auto] gap-x-5 gap-y-1 items-center px-4 py-3.5 rounded-xl ${tile} ${flash[slot.id] ? "slot-flash" : ""}`}
                                >
                                    <span className="text-[15px] text-muted sm:col-auto col-span-2">
                                        {slot.section} · {slot.position}<span className="sr-only"> · {slot.title}</span>
                                    </span>
                                    {p.person ? (
                                        <span className="flex flex-col gap-1.5 min-w-0">
                                            <span className="text-[17px] font-medium">{APPLICANTS[p.person]}</span>
                                            <span className={`flex h-1.5 rounded-full overflow-hidden max-w-80 ${onCard ? "bg-card" : "bg-canvas"}`} aria-hidden="true">
                                                {p.parts.map((part, i) => (
                                                    <span
                                                        key={part.key}
                                                        title={`${FEATURES.find((f) => f.key === part.key)?.label}: ${part.points.toFixed(2)}`}
                                                        className="h-full transition-[width] duration-500"
                                                        style={{ width: `${(part.points / (maxPoints * 4)) * 100}%`, background: "var(--color-accent-base)", opacity: 1 - i * 0.16 }}
                                                    />
                                                ))}
                                            </span>
                                        </span>
                                    ) : (
                                        <span className="text-[17px] text-muted">Left empty: no eligible person is free</span>
                                    )}
                                    <span className="text-[17px] tabular-nums text-right">{p.person ? p.score.toFixed(2) : "—"}</span>
                                </li>
                            );
                        })}
                        {rows.length === 0 && <li className={`px-4 py-3.5 rounded-xl ${tile} text-muted`}>Nothing in this term matches “{query}”.</li>}
                    </ul>
                </div>

                <fieldset className={`lg:col-span-4 m-0 p-6 rounded-xl ${tile} border-0 flex flex-col gap-5`}>
                    <legend className="float-left w-full p-0 text-[17px] font-semibold mb-1">How much each factor counts</legend>
                    {FEATURES.map((f) => (
                        <label key={f.key} className="flex flex-col gap-2 text-[15px]">
                            <span className="flex justify-between"><span>{f.label}</span><span className="tabular-nums text-muted">{weights[f.key].toFixed(1)}</span></span>
                            <input
                                type="range"
                                min={0}
                                max={5}
                                step={0.5}
                                value={weights[f.key]}
                                onChange={(e) => setWeights((w) => ({ ...w, [f.key]: Number(e.target.value) }))}
                                className="w-full accent-[var(--color-accent-base)] h-6 cursor-pointer"
                            />
                        </label>
                    ))}
                    <button
                        type="button"
                        onClick={() => setWeights(DEFAULT_WEIGHTS)}
                        className={`self-start h-11 px-4 rounded-full text-main text-[15px] cursor-pointer transition-colors ${onCard ? "bg-card hover:bg-raised" : "bg-raised hover:bg-canvas"}`}
                    >
                        Reset to the department's weights
                    </button>
                </fieldset>
            </div>
        </div>
    );
}
