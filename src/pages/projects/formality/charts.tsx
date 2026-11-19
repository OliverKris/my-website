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
    const inView = useInView(ref, { once: true, amount: 0.2 });
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

/* ---------- 1. corpus comparison ---------- */

const CORPORA = [
    { label: "BlendedSkillTalk", fr: 0.24, frSd: 3.6, p: 0.271, pSd: 0.337 },
    { label: "Reddit", fr: 0.52, frSd: 4.07, p: 0.245, pSd: 0.325 },
    { label: "ELI5", fr: 2.33, frSd: 7.03, p: 0.801, pSd: 0.271 },
    { label: "LLM replies (LMSYS)", fr: 7.62, frSd: 12.02, p: 0.8585, pSd: 0.271, llm: true },
];

export function CorpusChart() {
    const [metric, setMetric] = useState<"fr" | "p">("fr");
    const fr = metric === "fr";
    return (
        <ChartFrame
            title={fr ? "Mean Formality Rate by corpus" : "Mean RoBERTa P(formal) by corpus"}
            controls={<Toggle label="Metric" value={metric} onChange={setMetric} options={[{ key: "fr", label: "Formality Rate" }, { key: "p", label: "RoBERTa P(formal)" }]} />}
            note={fr
                ? "Formal hits per 1,000 tokens. Lines show ±1 standard deviation, cut off at the edge of the scale: LLM formality is uneven, with many replies at zero and some very dense."
                : "Probability the classifier assigns to “formal”. Lines show ±1 standard deviation, cut off at 0 and 1."}
        >
            <HBarChart
                ariaLabel={fr ? "Formality Rate: BlendedSkillTalk 0.24, Reddit 0.52, ELI5 2.33, LLM replies 7.62" : "RoBERTa P(formal): BlendedSkillTalk 0.271, Reddit 0.245, ELI5 0.801, LLM replies 0.859"}
                rows={CORPORA.map((c) => {
                    const v = fr ? c.fr : c.p;
                    const sd = fr ? c.frSd : c.pSd;
                    return { label: c.label, value: v, range: [Math.max(0, v - sd), v + sd] as [number, number], accent: c.llm };
                })}
                max={fr ? 20 : 1}
                format={fr ? (v) => (v >= 10 ? v.toFixed(0) : v.toFixed(2).replace(/\.?0+$/, "")) : (v) => v.toFixed(2)}
                labelWidth="minmax(6.5rem,10rem)"
            />
            {fr && (
                <p className="m-0 text-[clamp(18px,1.5vw,22px)] font-semibold tracking-[-0.01em]">
                    LLM replies use formal words 3× as often as ELI5, 14× Reddit and 31× BlendedSkillTalk.
                </p>
            )}
        </ChartFrame>
    );
}

/* ---------- 2. model families ---------- */

const FAMILIES = [
    { name: "PaLM", p: 0.8882, sem: 0.0213 }, { name: "GPT", p: 0.8676, sem: 0.0129 },
    { name: "Vicuna", p: 0.8637, sem: 0.0025 }, { name: "Other", p: 0.8567, sem: 0.0038 },
    { name: "LLaMA", p: 0.8563, sem: 0.0081 }, { name: "Claude", p: 0.8258, sem: 0.0121 },
    { name: "Alpaca", p: 0.8186, sem: 0.0102 },
];

export function FamilyChart() {
    const [base, setBase] = useState<"all" | "eli5">("all");
    const ref = base === "all" ? { value: 0.5, label: "All human text, 0.50" } : { value: 0.801, label: "ELI5, the most formal human corpus, 0.80" };
    return (
        <ChartFrame
            title="Mean RoBERTa P(formal) by model family"
            controls={<Toggle label="Compare with" value={base} onChange={setBase} options={[{ key: "all", label: "All human text" }, { key: "eli5", label: "ELI5" }]} />}
            note="Lines show ±1 standard error of the mean. “Other” groups the remaining models in LMSYS."
        >
            <HBarChart
                ariaLabel={`P(formal) by family: ${FAMILIES.map((f) => `${f.name} ${f.p.toFixed(2)}`).join(", ")}`}
                rows={FAMILIES.map((f) => ({ label: f.name, value: f.p, range: [f.p - f.sem, f.p + f.sem] as [number, number], accent: true }))}
                max={1}
                format={(v) => v.toFixed(2)}
                refs={[ref]}
                labelWidth="5rem"
            />
        </ChartFrame>
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

/* ---------- 5. LoRA mitigation ---------- */

const MITIGATION = [
    { metric: "Mean Formality Rate", base: 6.2029, tuned: 5.4601, max: 8, fmt: (v: number) => v.toFixed(2), better: "lower" },
    { metric: "Mean RoBERTa P(formal)", base: 0.8681, tuned: 0.7943, max: 1, fmt: (v: number) => v.toFixed(3), better: "lower" },
    { metric: "ROUGE-L (content kept)", base: 0.0727, tuned: 0.0766, max: 0.1, fmt: (v: number) => v.toFixed(4), better: "same" },
];

export function MitigationChart() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    return (
        <ChartFrame
            title="Qwen2.5-3B-Instruct before and after LoRA"
            note="Each row has its own scale. Held-out set of 50 prompts; the paired t-test was not significant, so treat this as preliminary."
        >
            <div ref={ref} className="flex flex-col gap-7" role="img"
                aria-label="Formality Rate 6.20 to 5.46; RoBERTa P(formal) 0.868 to 0.794; ROUGE-L 0.0727 to 0.0766">
                {MITIGATION.map((m, i) => {
                    const a = (m.base / m.max) * 100;
                    const b = (m.tuned / m.max) * 100;
                    const lo = Math.min(a, b);
                    return (
                        <div key={m.metric} className="flex flex-col gap-2.5">
                            <div className="flex flex-wrap justify-between gap-2 text-[15px]">
                                <span className="font-semibold">{m.metric}</span>
                                <span className="tabular-nums text-muted">{m.fmt(m.base)} → <span className="text-main font-semibold">{m.fmt(m.tuned)}</span></span>
                            </div>
                            <div className="relative h-6">
                                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-main/10" />
                                <motion.span className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-accent"
                                    initial={{ left: `${a}%`, width: 0 }}
                                    animate={inView ? { left: `${lo}%`, width: `${Math.abs(a - b)}%` } : {}}
                                    transition={{ duration: 1, ease: EASE, delay: 0.3 + i * 0.15 }} />
                                <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-main/45" style={{ left: `${a}%` }} title="Base model" />
                                <motion.span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-accent ring-4 ring-canvas"
                                    initial={{ left: `${a}%` }}
                                    animate={inView ? { left: `${b}%` } : {}}
                                    transition={{ duration: 1, ease: EASE, delay: 0.3 + i * 0.15 }} title="After LoRA" />
                            </div>
                        </div>
                    );
                })}
                <p className="m-0 flex flex-wrap gap-x-6 gap-y-1 text-[14px] text-muted">
                    <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-main/45" aria-hidden="true" />Base model</span>
                    <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-accent" aria-hidden="true" />After LoRA fine-tuning</span>
                </p>
            </div>
        </ChartFrame>
    );
}
