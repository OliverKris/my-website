import { useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

/*
  Native, animated charts for the formality study. Every number comes from the
  final report (NLU Report, section 7) or the notebook's final-results printout.
  Bars grow in when the chart scrolls into view and re-animate when a toggle
  changes what they show. Colours come from the site tokens, so the charts
  follow light and dark mode.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

export interface BarRow {
    label: string;
    value: number;
    /** optional error range [low, high] in the same units as value */
    range?: [number, number];
    accent?: boolean;
}

export interface RefLine { value: number; label: string }

/** Horizontal bars with optional error whiskers and dashed reference lines. */
export function HBarChart({ rows, max, format, refs = [], labelWidth = "10rem", ticks = 4, ariaLabel }: {
    rows: BarRow[]; max: number; format: (v: number) => string; refs?: RefLine[]; labelWidth?: string; ticks?: number; ariaLabel: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { amount: 0.3 }); // replays each time it scrolls back into view
    const pct = (v: number) => `${(Math.max(0, Math.min(max, v)) / max) * 100}%`;
    const grid = `${labelWidth} minmax(0,1fr) 4rem`;

    return (
        <div ref={ref} role="img" aria-label={ariaLabel} className="flex flex-col gap-4">
            <div className="relative flex flex-col gap-3.5">
                {/* reference lines run behind every bar */}
                <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: grid, columnGap: "1rem" }} aria-hidden="true">
                    <span />
                    <span className="relative">
                        {Array.from({ length: ticks + 1 }, (_, i) => (
                            <span key={i} className="absolute top-0 bottom-0 border-l border-main/10" style={{ left: `${(i / ticks) * 100}%` }} />
                        ))}
                        {refs.map((r) => (
                            <motion.span
                                key={r.label}
                                className="absolute -top-1 -bottom-1 border-l-2 border-dashed border-main/55"
                                initial={false}
                                animate={{ left: pct(r.value), opacity: inView ? 1 : 0 }}
                                transition={{ duration: 0.7, ease: EASE }}
                            />
                        ))}
                    </span>
                    <span />
                </div>

                {rows.map((r, i) => (
                    <div key={r.label} className="relative grid items-center text-[15px] md:text-[16px]" style={{ gridTemplateColumns: grid, columnGap: "1rem" }}>
                        <span className={`leading-tight ${r.accent ? "font-semibold" : ""}`}>{r.label}</span>
                        <span className="relative h-5 flex items-center">
                            <span className="absolute inset-x-0 h-3 rounded-full bg-main/8" />
                            <motion.span
                                className={`relative h-3 rounded-full ${r.accent ? "bg-accent" : "bg-main/40"}`}
                                initial={{ width: 0 }}
                                animate={{ width: inView ? pct(r.value) : 0 }}
                                transition={{ duration: 0.9, ease: EASE, delay: inView ? i * 0.06 : 0 }}
                            />
                            {r.range && (
                                <motion.span
                                    className="absolute h-5 flex items-center"
                                    initial={false}
                                    animate={{ left: pct(r.range[0]), width: `calc(${pct(r.range[1])} - ${pct(r.range[0])})`, opacity: inView ? 1 : 0 }}
                                    transition={{ duration: 0.9, ease: EASE, delay: inView ? 0.3 + i * 0.06 : 0 }}
                                    aria-hidden="true"
                                >
                                    <span className="absolute left-0 h-3 border-l-2 border-main/70" />
                                    <span className="absolute inset-x-0 border-t-2 border-main/70" />
                                    <span className="absolute right-0 h-3 border-r-2 border-main/70" />
                                </motion.span>
                            )}
                        </span>
                        <span className={`text-right tabular-nums ${r.accent ? "font-semibold text-accent" : ""}`}>{format(r.value)}</span>
                    </div>
                ))}
            </div>

            <div className="grid text-[13px] text-muted tabular-nums" style={{ gridTemplateColumns: grid, columnGap: "1rem" }} aria-hidden="true">
                <span />
                <span className="relative h-4">
                    {Array.from({ length: ticks + 1 }, (_, i) => (
                        <span key={i} className="absolute -translate-x-1/2" style={{ left: `${(i / ticks) * 100}%` }}>{format((max * i) / ticks)}</span>
                    ))}
                </span>
                <span />
            </div>
            {refs.length > 0 && (
                <p className="m-0 text-[14px] text-muted flex flex-wrap gap-x-5 gap-y-1">
                    {refs.map((r) => (
                        <span key={r.label} className="inline-flex items-center gap-2">
                            <span aria-hidden="true" className="inline-block w-4 border-t-2 border-dashed border-main/55" />{r.label}
                        </span>
                    ))}
                </p>
            )}
        </div>
    );
}

/** Small pill switch used above a chart. */
export function Toggle<T extends string>({ options, value, onChange, label }: {
    options: { key: T; label: string }[]; value: T; onChange: (v: T) => void; label: string;
}) {
    return (
        <div role="group" aria-label={label} className="inline-flex flex-wrap gap-1 p-1 rounded-full bg-main/8">
            {options.map((o) => (
                <button key={o.key} type="button" aria-pressed={value === o.key} onClick={() => onChange(o.key)}
                    className={`h-9 px-4 rounded-full text-[14px] cursor-pointer transition-colors ${value === o.key ? "bg-main text-canvas" : "text-main hover:bg-main/10"}`}>
                    {o.label}
                </button>
            ))}
        </div>
    );
}

export function ChartFrame({ title, controls, children, note }: { title: string; controls?: ReactNode; children: ReactNode; note?: ReactNode }) {
    return (
        <figure className="m-0 rounded-2xl bg-canvas p-6 md:p-8 flex flex-col gap-6" data-ui>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <figcaption className="text-[16px] font-semibold">{title}</figcaption>
                {controls}
            </div>
            {children}
            {note && <p className="m-0 text-[14px] leading-[1.5] text-muted">{note}</p>}
        </figure>
    );
}

/* ---------- 3. conversation type ---------- */

const TOPICS = [
    { type: "Casual", fr: 1.9021, p: 0.6326 },
    { type: "General", fr: 8.041, p: 0.8525 },
    { type: "Task", fr: 6.5871, p: 0.882 },
];

export function TopicCharts() {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <ChartFrame title="Formality Rate by conversation type">
                <HBarChart
                    ariaLabel="Formality Rate: casual 1.90, general 8.04, task 6.59"
                    rows={TOPICS.map((t) => ({ label: t.type, value: t.fr, accent: true }))}
                    max={10} format={(v) => v.toFixed(1)} labelWidth="4.5rem" ticks={5}
                    refs={[{ value: 2.33, label: "ELI5, 2.33" }, { value: 0.52, label: "Reddit, 0.52" }]}
                />
            </ChartFrame>
            <ChartFrame title="RoBERTa P(formal) by conversation type">
                <HBarChart
                    ariaLabel="P(formal): casual 0.63, general 0.85, task 0.88"
                    rows={TOPICS.map((t) => ({ label: t.type, value: t.p, accent: true }))}
                    max={1} format={(v) => v.toFixed(2)} labelWidth="4.5rem"
                    refs={[{ value: 0.801, label: "ELI5, 0.80" }, { value: 0.245, label: "Reddit, 0.25" }]}
                />
            </ChartFrame>
        </div>
    );
}

/* ---------- 4. top formal words ---------- */

const WORDS = {
    lmsys: [["such as", 6251], ["provide", 4353], ["it is important to", 1444], ["additionally", 1054], ["significant", 786], ["therefore", 610],
        ["in conclusion", 413], ["implement", 361], ["ultimately", 340], ["framework", 318], ["in order to", 315], ["comprehensive", 301]],
    eli5: [["such as", 278], ["thus", 192], ["therefore", 159], ["essentially", 158], ["in order to", 141], ["specifically", 123],
        ["provide", 93], ["significant", 87], ["hence", 62], ["ultimately", 40], ["additionally", 35], ["bandwidth", 23]],
} as const;

export function WordsChart() {
    const [corpus, setCorpus] = useState<"lmsys" | "eli5">("lmsys");
    const list = WORDS[corpus];
    // A round axis: step of 1, 2 or 5 × 10^k so the ticks read 0, 2,000, 4,000…
    const raw = list[0][1] / 4;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 5, 10].map((m) => m * mag).find((x) => x >= raw)!;
    const top = Math.ceil(list[0][1] / step) * step;
    return (
        <ChartFrame
            title="Most frequent formal markers"
            controls={<Toggle label="Corpus" value={corpus} onChange={setCorpus} options={[{ key: "lmsys", label: "LLM replies" }, { key: "eli5", label: "ELI5" }]} />}
            note="Raw counts from the lexicon. LMSYS is far larger than ELI5, so compare the order and the kind of words, not the totals."
        >
            <HBarChart
                key={corpus}
                ariaLabel={`Top formal markers in ${corpus === "lmsys" ? "LLM replies" : "ELI5"}: ${list.map(([w, n]) => `${w} ${n}`).join(", ")}`}
                rows={list.map(([w, n]) => ({ label: w, value: n, accent: corpus === "lmsys" }))}
                max={top} ticks={top / step} format={(v) => Math.round(v).toLocaleString("en-US")} labelWidth="minmax(7rem,10rem)"
            />
        </ChartFrame>
    );
}
