import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import {
    CORPUS_FR, ELI5_P, FAMILY_P, HIST, HUMAN_FR, HUMAN_P, LORA_FR_BOX, LORA_P_BOX, LORA_PAIRS,
    MODEL_FR, MODEL_P, SCATTER_HUMAN, SCATTER_LLM, VIOLINS,
} from "./figureData";

/*
  The study notebook's four figures, kept in their original arrangement (same panels, chart
  types, axis ranges and reference lines) but drawn in the site's own language: one ink, one
  accent. LLM data is always the accent; the three human corpora are the ink at three
  strengths, darker the more formal the corpus. Every panel is drawn at its real pixel size
  (measured with a ResizeObserver), so lines stay hairline-sharp and text stays 12–14px on
  any screen. Hover or tap a mark for its value.
*/

const EASE = [0.16, 1, 0.3, 1] as const;

/** Ink strengths for the human corpora, lightest (most casual) to darkest (most formal). */
const HUMAN = { blended: 0.26, reddit: 0.46, eli5: 0.72 } as const;
const HUMAN_NAME = { blended: "BlendedSkillTalk", reddit: "Reddit", eli5: "ELI5" } as const;

type Scale = (v: number) => number;
const lin = (d0: number, d1: number, r0: number, r1: number): Scale => (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
const range = (a: number, b: number, step: number) => {
    const out: number[] = [];
    for (let v = a; v <= b + step / 1e6; v += step) out.push(Math.round(v * 1e6) / 1e6);
    return out;
};

/* ---------- frame, legend, tooltip ---------- */

export function Swatch({ kind, opacity = 1 }: { kind: "accent" | "ink" | "dash" | "band" | "dot"; opacity?: number }) {
    if (kind === "dash") return <span aria-hidden="true" className="inline-block w-5 border-t-2 border-dashed border-main/60" />;
    if (kind === "band") return <span aria-hidden="true" className="inline-block w-4 h-3 rounded-[3px] bg-main/10" />;
    if (kind === "dot") return <span aria-hidden="true" className="inline-block w-2.5 h-2.5 rounded-full bg-accent" />;
    return <span aria-hidden="true" className={`inline-block w-3 h-3 rounded-[3px] ${kind === "accent" ? "bg-accent" : "bg-main"}`} style={kind === "ink" ? { opacity } : undefined} />;
}

function LegendRow({ items }: { items: { swatch: ReactNode; label: string }[] }) {
    return (
        <p className="m-0 flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-muted">
            {items.map((it) => <span key={it.label} className="inline-flex items-center gap-2">{it.swatch}{it.label}</span>)}
        </p>
    );
}

interface Ctx { w: number; h: number; inView: boolean; show: (x: number, y: number, text: string) => void; hide: () => void }

/** One chart panel: title, optional legend, and an SVG drawn at its measured pixel width. */
function Panel({ title, legend, height, label, children }: {
    title: string; legend?: ReactNode; height: (w: number) => number; label: string; children: (c: Ctx) => ReactNode;
}) {
    const box = useRef<HTMLDivElement>(null);
    const [w, setW] = useState(480);
    const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);
    useLayoutEffect(() => {
        const el = box.current;
        if (!el) return;
        const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.round(e.contentRect.width))));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);
    // Each panel animates when it scrolls into view, and again whenever it comes back.
    const inView = useInView(box, { amount: 0.35 });
    const h = height(w);
    const ctx: Ctx = { w, h, inView, show: (x, y, text) => setTip({ x, y, text }), hide: () => setTip(null) };
    return (
        <div className="flex flex-col gap-3 min-w-0">
            <div className="flex flex-col gap-1.5">
                <h4 className="m-0 text-[15px] font-semibold tracking-[-0.01em]">{title}</h4>
                {legend}
            </div>
            <div ref={box} className="relative" onMouseLeave={() => setTip(null)}>
                <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block text-main overflow-visible" role="img" aria-label={label}
                    style={{ fontFamily: "inherit", shapeRendering: "geometricPrecision" }}>
                    {children(ctx)}
                </svg>
                {tip && (
                    <span role="status" className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full -mt-2 whitespace-nowrap rounded-lg bg-main text-canvas px-2.5 py-1.5 text-[12.5px] tabular-nums shadow-lg"
                        style={{ left: Math.min(Math.max(tip.x, 70), w - 70), top: tip.y }}>
                        {tip.text}
                    </span>
                )}
            </div>
        </div>
    );
}

/** Hover/tap/focus handlers that show a tooltip anchored at (x, y). */
const hover = (c: Ctx, x: number, y: number, text: string) => ({
    onMouseEnter: () => c.show(x, y, text),
    onFocus: () => c.show(x, y, text),
    onClick: () => c.show(x, y, text),
    onBlur: c.hide,
    tabIndex: 0,
    className: "outline-none cursor-default",
});

function Grid({ x, y, xTicks = [], yTicks = [], L, R, T, B }: { x?: Scale; y?: Scale; xTicks?: number[]; yTicks?: number[]; L: number; R: number; T: number; B: number }) {
    return (
        <g stroke="currentColor" strokeOpacity={0.08} shapeRendering="crispEdges">
            {x && xTicks.map((t) => <line key={`gx${t}`} x1={Math.round(x(t)) + 0.5} x2={Math.round(x(t)) + 0.5} y1={T} y2={B} />)}
            {y && yTicks.map((t) => <line key={`gy${t}`} x1={L} x2={R} y1={Math.round(y(t)) + 0.5} y2={Math.round(y(t)) + 0.5} />)}
        </g>
    );
}

function XTicks({ x, ticks, y, fmt = String }: { x: Scale; ticks: number[]; y: number; fmt?: (v: number) => string }) {
    return <g className="fill-muted tabular-nums" fontSize={12}>{ticks.map((t) => <text key={t} x={x(t)} y={y + 16} textAnchor="middle">{fmt(t)}</text>)}</g>;
}
function YTicks({ y, ticks, x, fmt = String }: { y: Scale; ticks: number[]; x: number; fmt?: (v: number) => string }) {
    return <g className="fill-muted tabular-nums" fontSize={12}>{ticks.map((t) => <text key={t} x={x - 8} y={y(t) + 4} textAnchor="end">{fmt(t)}</text>)}</g>;
}
function AxisTitle({ x, y, text, vertical }: { x: number; y: number; text: string; vertical?: boolean }) {
    return <text transform={vertical ? `translate(${x},${y}) rotate(-90)` : undefined} x={vertical ? 0 : x} y={vertical ? 0 : y}
        textAnchor="middle" fontSize={12.5} className="fill-muted">{text}</text>;
}
const Baseline = ({ x1, x2, y }: { x1: number; x2: number; y: number }) =>
    <line x1={x1} x2={x2} y1={Math.round(y) + 0.5} y2={Math.round(y) + 0.5} stroke="currentColor" strokeOpacity={0.3} shapeRendering="crispEdges" />;

function Figure({ title, cols, children, note, inViewRef }: {
    title: string; cols: string; children: ReactNode; note?: ReactNode; inViewRef: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <figure className="m-0 rounded-2xl bg-canvas p-5 md:p-8 flex flex-col gap-7" data-ui>
            <figcaption className="text-[16px] font-semibold">{title}</figcaption>
            <div ref={inViewRef} className={`grid gap-x-10 gap-y-12 ${cols}`}>{children}</div>
            {note && <p className="m-0 text-[14px] leading-[1.55] text-muted max-w-[90ch]">{note}</p>}
        </figure>
    );
}

const grow = (inView: boolean, i: number) => ({ duration: 0.9, ease: EASE, delay: inView ? 0.1 + i * 0.05 : 0 });
const fadeIn = (inView: boolean, i = 0) => ({ initial: { opacity: 0 }, animate: { opacity: inView ? 1 : 0 }, transition: { duration: 0.8, delay: inView ? 0.1 + i * 0.1 : 0 } });
/** Grow from the middle of the element along one axis (error bars outward from the mean, violins from their centre line). */
const stretch = (inView: boolean, axis: "x" | "y", delay: number, duration = 0.7) => ({
    initial: { [axis === "x" ? "scaleX" : "scaleY"]: 0, opacity: 0 },
    animate: { [axis === "x" ? "scaleX" : "scaleY"]: inView ? 1 : 0, opacity: inView ? 1 : 0 },
    transition: { duration, ease: EASE, delay: inView ? delay : 0 },
    style: { originX: 0.5, originY: 0.5 },
});
/** Draw a line or path from its first point to its last. */
const draw = (inView: boolean, delay: number, duration = 1.1) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: inView ? 1 : 0, opacity: inView ? 1 : 0 },
    transition: { duration, ease: EASE, delay: inView ? delay : 0 },
});
/** A clip rectangle that sweeps open left to right, revealing what it clips. */
function Sweep({ id, x, y, w, h, inView, delay = 0.1, duration = 1.2 }: { id: string; x: number; y: number; w: number; h: number; inView: boolean; delay?: number; duration?: number }) {
    return (
        <clipPath id={id}>
            <motion.rect x={x} y={y} height={h} initial={{ width: 0 }} animate={{ width: inView ? w : 0 }}
                transition={{ duration, ease: EASE, delay: inView ? delay : 0 }} />
        </clipPath>
    );
}

/** Horizontal bars for the ten most frequent models, with a human mean ± 1 std band. */
function ModelBars({ c, inView, rows, xMin, xMax, ticks, fmt, tickFmt, human, labelW }: {
    c: Ctx; inView: boolean; rows: readonly (readonly [string, number])[]; xMin: number; xMax: number; ticks: number[];
    fmt: (v: number) => string; tickFmt: (v: number) => string; human: { mean: number; sd: number }; labelW: number;
}) {
    const L = labelW, R = c.w - 8, T = 6, B = c.h - 40;
    const x = lin(xMin, xMax, L, R);
    const rowH = (B - T) / rows.length;
    const lo = Math.max(xMin, human.mean - human.sd), hi = Math.min(xMax, human.mean + human.sd);
    return (
        <>
            <motion.rect x={x(lo)} width={x(hi) - x(lo)} y={T} height={B - T} className="fill-main" fillOpacity={0.06} {...stretch(inView, "x", 0.05, 0.9)} />
            <Grid x={x} xTicks={ticks} L={L} R={R} T={T} B={B} />
            {rows.map(([m, v], i) => {
                const yc = T + rowH * (i + 0.5);
                const bh = Math.min(16, rowH * 0.58);
                return (
                    <g key={m} {...hover(c, x(v), yc - bh / 2, `${m}: ${fmt(v)}`)}>
                        <text x={L - 10} y={yc + 4} textAnchor="end" fontSize={12.5} fill="currentColor">{m}</text>
                        <rect x={L} width={R - L} y={yc - rowH / 2} height={rowH} fill="transparent" />
                        <motion.rect y={yc - bh / 2} height={bh} rx={3} x={x(0)} className="fill-accent"
                            initial={{ width: 0 }} animate={{ width: inView ? Math.max(0, x(v) - x(0)) : 0 }} transition={grow(inView, rows.length - i)} />
                    </g>
                );
            })}
            <motion.line x1={x(human.mean)} x2={x(human.mean)} y1={T - 2} stroke="currentColor" strokeOpacity={0.65} strokeWidth={1.5} strokeDasharray="5 4"
                initial={{ y2: T - 2 }} animate={{ y2: inView ? B : T - 2 }} transition={{ duration: 0.9, ease: EASE, delay: inView ? 0.2 : 0 }} />
            <Baseline x1={L} x2={R} y={B} />
            <XTicks x={x} ticks={ticks} y={B} fmt={tickFmt} />
        </>
    );
}

/* ---------- Figure 1: formality rate by corpus and by model ---------- */

export function FormalityRateFigure() {
    const ref = useRef<HTMLDivElement>(null);
    const corpusTone = [HUMAN.blended, HUMAN.reddit, HUMAN.eli5];
    const short = ["BlendedSkillTalk", "Reddit", "ELI5", "LLM (LMSYS)"];

    return (
        <Figure inViewRef={ref} title="Formality Rate: corpora and models" cols="lg:grid-cols-2"
            note="Formal hits per 1,000 tokens. Left: error bars are ±1 standard deviation, which run below zero because many texts score exactly 0. Right: the ten most frequent models in LMSYS against the pooled human mean.">
            <Panel title="Mean Formality Rate by corpus" height={(w) => Math.round(Math.min(380, Math.max(300, w * 0.72)))}
                label={`Mean formality rate: ${CORPUS_FR.map((c) => `${c.label} ${c.mean.toFixed(2)}`).join(", ")}`}
                legend={<LegendRow items={[{ swatch: <Swatch kind="ink" opacity={0.5} />, label: "Human corpora" }, { swatch: <Swatch kind="accent" />, label: "LLM replies" }]} />}>
                {(c) => {
                    const { inView } = c;
                    const L = 50, R = c.w - 4, T = 8, B = c.h - 46;
                    const y = lin(-6, 21, B, T);
                    const band = (R - L) / CORPUS_FR.length;
                    const cx = (i: number) => L + band * (i + 0.5);
                    const bw = Math.min(64, band * 0.62);
                    return (
                        <>
                            <Grid y={y} yTicks={range(-5, 20, 5)} L={L} R={R} T={T} B={B} />
                            {CORPUS_FR.map((d, i) => {
                                const llm = i === 3;
                                return (
                                    <g key={d.label} {...hover(c, cx(i), y(d.mean + d.sd), `${d.label}: ${d.mean.toFixed(2)} ± ${d.sd.toFixed(2)}`)}>
                                        <rect x={cx(i) - band / 2} width={band} y={T} height={B - T} fill="transparent" />
                                        <motion.rect x={cx(i) - bw / 2} width={bw} rx={3}
                                            className={llm ? "fill-accent" : "fill-main"} fillOpacity={llm ? 1 : corpusTone[i]}
                                            initial={{ y: y(0), height: 0 }} animate={{ y: inView ? y(d.mean) : y(0), height: inView ? Math.max(1.5, y(0) - y(d.mean)) : 0 }}
                                            transition={grow(inView, i)} />
                                        <motion.g stroke="currentColor" strokeOpacity={0.7} strokeWidth={1.5} {...stretch(inView, "y", 0.6 + i * 0.08, 0.6)}>
                                            <line x1={cx(i)} x2={cx(i)} y1={y(d.mean - d.sd)} y2={y(d.mean + d.sd)} />
                                            <line x1={cx(i) - 6} x2={cx(i) + 6} y1={y(d.mean - d.sd)} y2={y(d.mean - d.sd)} />
                                            <line x1={cx(i) - 6} x2={cx(i) + 6} y1={y(d.mean + d.sd)} y2={y(d.mean + d.sd)} />
                                        </motion.g>
                                    </g>
                                );
                            })}
                            <line x1={L} x2={R} y1={Math.round(y(0)) + 0.5} y2={Math.round(y(0)) + 0.5} stroke="currentColor" strokeOpacity={0.3} shapeRendering="crispEdges" />
                            <YTicks y={y} ticks={range(-5, 20, 5)} x={L} />
                            <g fontSize={12.5} fill="currentColor">
                                {short.map((s, i) => <text key={s} x={cx(i)} y={B + 18} textAnchor="middle" fontWeight={i === 3 ? 600 : 400}>{s}</text>)}
                            </g>
                            <AxisTitle x={(L + R) / 2} y={c.h - 4} text="Corpus" />
                            <AxisTitle x={9} y={(T + B) / 2} text="FR (hits / 1k tokens)" vertical />
                        </>
                    );
                }}
            </Panel>

            <Panel title="Mean Formality Rate by model (LMSYS)" height={(w) => Math.round(Math.min(400, Math.max(330, w * 0.74)))}
                label={`Mean formality rate by model: ${MODEL_FR.map(([m, v]) => `${m} ${v}`).join(", ")}; human mean ${HUMAN_FR.mean}`}
                legend={<LegendRow items={[
                    { swatch: <Swatch kind="accent" />, label: "Model mean" },
                    { swatch: <Swatch kind="dash" />, label: `Human mean (${HUMAN_FR.mean.toFixed(1)})` },
                    { swatch: <Swatch kind="band" />, label: "±1 std" },
                ]} />}>
                {(c) => <>
                    <ModelBars c={c} inView={c.inView} rows={MODEL_FR} xMin={-5.4} xMax={14.4} ticks={range(-5, 12.5, 2.5)} fmt={(v) => v.toFixed(2)} tickFmt={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))} human={HUMAN_FR} labelW={124} />
                    <AxisTitle x={(124 + c.w) / 2} y={c.h - 4} text="FR (hits / 1k tokens)" />
                </>}
            </Panel>
        </Figure>
    );
}

/* ---------- Figure 2: four-panel corpus analysis ---------- */

function violinPath(profile: [number, number][], cx: number, half: number, y: Scale) {
    const right = profile.map(([p, w]) => `${(cx + w * half).toFixed(1)},${y(p).toFixed(1)}`);
    const left = [...profile].reverse().map(([p, w]) => `${(cx - w * half).toFixed(1)},${y(p).toFixed(1)}`);
    return `M${right.join("L")}L${left.join("L")}Z`;
}
function widthAt(profile: [number, number][], p: number) {
    for (let i = 1; i < profile.length; i++) {
        const [p0, w0] = profile[i - 1];
        const [p1, w1] = profile[i];
        if (p >= p0 && p <= p1) return w0 + ((p - p0) / (p1 - p0 || 1)) * (w1 - w0);
    }
    return 0;
}
/** Deterministic jitter so points read off the saved figure don't sit on a visible lattice. */
const jit = (i: number, k: number) => (((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1) + 1) % 1 - 0.5;

export function CorpusAnalysisFigure() {
    const ref = useRef<HTMLDivElement>(null);
    const humans = ["blended", "reddit", "eli5"] as const;
    const corpusLegend = <LegendRow items={[
        ...humans.map((s) => ({ swatch: <Swatch kind="ink" opacity={HUMAN[s]} />, label: HUMAN_NAME[s] })),
        { swatch: <Swatch kind="accent" />, label: "LLM (LMSYS)" },
    ]} />;

    return (
        <Figure inViewRef={ref} title="Formal language bias: the classifier’s view" cols="lg:grid-cols-2"
            note="RoBERTa P(formal) is the classifier’s probability that a text is formal. The scatter shows a random sample of texts: LLM replies sit near 1 whatever their Formality Rate, while human texts with no listed formal words spread across the whole range.">
            <Panel title="Distribution of RoBERTa P(formal)" legend={corpusLegend} height={(w) => Math.round(Math.min(360, Math.max(280, w * 0.66)))}
                label="Histograms of P(formal): human corpora pile up near 0 and LLM replies near 1, with ELI5 also skewed high">
                {(c) => {
                    const { inView } = c;
                    const L = 50, R = c.w - 6, T = 6, B = c.h - 40;
                    const x = lin(-0.02, 1.02, L, R);
                    const y = lin(0, 28.8, B, T);
                    const step = (d: readonly number[]) => {
                        let p = `M${x(0)},${y(0)}`;
                        d.forEach((v, i) => { p += `L${x(i / 50)},${y(v)}L${x((i + 1) / 50)},${y(v)}`; });
                        return p + `L${x(1)},${y(0)}`;
                    };
                    return (
                        <>
                            <Grid x={x} y={y} xTicks={range(0, 1, 0.2)} yTicks={range(0, 25, 5)} L={L} R={R} T={T} B={B} />
                            <motion.path d={step(HIST.lmsys) + "Z"} className="fill-accent stroke-accent" fillOpacity={0.22} strokeWidth={1.5} strokeLinejoin="round"
                                initial={{ scaleY: 0 }} animate={{ scaleY: inView ? 1 : 0 }} transition={{ duration: 1, ease: EASE, delay: inView ? 0.9 : 0 }} style={{ originY: 1 }} />
                            {humans.map((s, i) => (
                                <motion.path key={s} d={step(HIST[s])} fill="none" stroke="currentColor" strokeOpacity={HUMAN[s]} strokeWidth={1.6} strokeLinejoin="round" {...draw(inView, 0.1 + i * 0.2, 1.4)} />
                            ))}
                            <Baseline x1={L} x2={R} y={B} />
                            <XTicks x={x} ticks={range(0, 1, 0.2)} y={B} fmt={(v) => v.toFixed(1)} />
                            <YTicks y={y} ticks={range(0, 25, 5)} x={L} />
                            <AxisTitle x={(L + R) / 2} y={c.h - 4} text="P(formal)" />
                            <AxisTitle x={9} y={(T + B) / 2} text="Density" vertical />
                        </>
                    );
                }}
            </Panel>

            <Panel title="Formality Rate vs. RoBERTa P(formal)" height={(w) => Math.round(Math.min(360, Math.max(280, w * 0.66)))}
                legend={<LegendRow items={[{ swatch: <Swatch kind="accent" />, label: "LLM (LMSYS)" }, { swatch: <Swatch kind="ink" opacity={0.5} />, label: "Human corpora" }]} />}
                label="Scatter of Formality Rate against P(formal) for LLM and human texts">
                {(c) => {
                    const { inView } = c;
                    const L = 50, R = c.w - 6, T = 6, B = c.h - 40;
                    const x = lin(-3, 80, L, R);
                    const y = lin(-0.04, 1.04, B, T);
                    return (
                        <>
                            <Grid x={x} y={y} xTicks={range(0, 80, 10)} yTicks={range(0, 1, 0.2)} L={L} R={R} T={T} B={B} />
                            <defs>
                                <Sweep id="fa-sweep-human" x={L - 8} y={T - 8} w={R - L + 16} h={B - T + 16} inView={inView} delay={0.1} duration={1.1} />
                                <Sweep id="fa-sweep-llm" x={L - 8} y={T - 8} w={R - L + 16} h={B - T + 16} inView={inView} delay={0.6} duration={1.3} />
                            </defs>
                            <motion.g className="fill-main" fillOpacity={0.3} clipPath="url(#fa-sweep-human)" {...fadeIn(inView, 0)}>
                                {SCATTER_HUMAN.map(([f, p], i) => <circle key={i} cx={x(f) + (f > 0 ? jit(i, 1) * 4 : jit(i, 1) * 2)} cy={y(p) + jit(i, 2) * 4} r={1.9} />)}
                            </motion.g>
                            <motion.g className="fill-accent" fillOpacity={0.42} clipPath="url(#fa-sweep-llm)" {...fadeIn(inView, 5)}>
                                {SCATTER_LLM.map(([f, p], i) => <circle key={i} cx={x(f) + (f > 0 ? jit(i, 3) * 4 : jit(i, 3) * 2)} cy={y(p) + jit(i, 4) * 4} r={1.9} />)}
                            </motion.g>
                            <Baseline x1={L} x2={R} y={B} />
                            <XTicks x={x} ticks={range(0, 80, 10)} y={B} />
                            <YTicks y={y} ticks={range(0, 1, 0.2)} x={L} fmt={(v) => v.toFixed(1)} />
                            <AxisTitle x={(L + R) / 2} y={c.h - 4} text="Formality Rate (hits / 1k tokens)" />
                            <AxisTitle x={9} y={(T + B) / 2} text="P(formal)" vertical />
                        </>
                    );
                }}
            </Panel>

            <Panel title="Mean RoBERTa P(formal) by model" height={(w) => Math.round(Math.min(400, Math.max(330, w * 0.74)))}
                label={`Mean P(formal) by model: ${MODEL_P.map(([m, v]) => `${m} ${v}`).join(", ")}; human mean 0.50`}
                legend={<LegendRow items={[
                    { swatch: <Swatch kind="accent" />, label: "Model mean" },
                    { swatch: <Swatch kind="dash" />, label: `Human mean (${HUMAN_P.mean.toFixed(2)})` },
                    { swatch: <Swatch kind="band" />, label: "±1 std" },
                ]} />}>
                {(c) => <>
                    <ModelBars c={c} inView={c.inView} rows={MODEL_P} xMin={0} xMax={1} ticks={range(0, 1, 0.2)} fmt={(v) => v.toFixed(3)} tickFmt={(v) => v.toFixed(1)} human={HUMAN_P} labelW={124} />
                    <AxisTitle x={(124 + c.w) / 2} y={c.h - 4} text="P(formal)" />
                </>}
            </Panel>

            <Panel title="P(formal) across the human corpora" height={(w) => Math.round(Math.min(400, Math.max(330, w * 0.74)))}
                legend={<LegendRow items={[
                    { swatch: <span aria-hidden="true" className="inline-block w-5 border-t-2 border-dashed border-main/80" />, label: "Median" },
                    { swatch: <span aria-hidden="true" className="inline-block w-5 border-t-2 border-dotted border-main/80" />, label: "Quartiles" },
                ]} />}
                label="Violin plots of P(formal): BlendedSkillTalk and Reddit concentrate near 0 with medians 0.08 and 0.06; ELI5 concentrates near 1 with median 0.93">
                {(c) => {
                    const { inView } = c;
                    const L = 50, R = c.w - 6, T = 6, B = c.h - 40;
                    const y = lin(-0.16, 1.16, B, T);
                    const band = (R - L) / 3;
                    const cx = (i: number) => L + band * (i + 0.5);
                    const half = Math.min(92, band * 0.42);
                    return (
                        <>
                            <Grid y={y} yTicks={range(0, 1, 0.2)} L={L} R={R} T={T} B={B} />
                            {VIOLINS.map((v, i) => {
                                const key = v.label as keyof typeof HUMAN;
                                return (
                                    <motion.g key={v.label} {...stretch(inView, "x", 0.1 + i * 0.15, 0.9)}
                                        {...hover(c, cx(i), y(v.q[2]) - 10, `${HUMAN_NAME[key]}: median ${v.q[1]}, quartiles ${v.q[0]}–${v.q[2]}`)}>
                                        <path d={violinPath(v.profile, cx(i), half, y)} className="fill-main" fillOpacity={HUMAN[key] * 0.75} stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.2} />
                                        {v.q.map((q, qi) => {
                                            const w = widthAt(v.profile, q) * half;
                                            return <line key={qi} x1={cx(i) - w} x2={cx(i) + w} y1={y(q)} y2={y(q)}
                                                className={HUMAN[key] > 0.6 ? "stroke-canvas" : "stroke-main"} strokeOpacity={0.95}
                                                strokeWidth={1.5} strokeDasharray={qi === 1 ? "6 3" : "1.5 3"} />;
                                        })}
                                    </motion.g>
                                );
                            })}
                            <Baseline x1={L} x2={R} y={B} />
                            <YTicks y={y} ticks={range(0, 1, 0.2)} x={L} fmt={(v) => v.toFixed(1)} />
                            <g fontSize={12.5} fill="currentColor">
                                {VIOLINS.map((v, i) => <text key={v.label} x={cx(i)} y={B + 18} textAnchor="middle">{HUMAN_NAME[v.label as keyof typeof HUMAN]}</text>)}
                            </g>
                            <AxisTitle x={9} y={(T + B) / 2} text="P(formal)" vertical />
                        </>
                    );
                }}
            </Panel>
        </Figure>
    );
}

/* ---------- Figure 3: model families ---------- */

export function FamilyFigure() {
    const ref = useRef<HTMLDivElement>(null);
    return (
        <figure className="m-0 rounded-2xl bg-canvas p-5 md:p-8 flex flex-col gap-6" data-ui>
            <div ref={ref}>
                <Panel title="Mean RoBERTa P(formal) by model family" height={(w) => Math.round(Math.min(360, Math.max(280, w * 0.55)))}
                    legend={<LegendRow items={[{ swatch: <Swatch kind="accent" />, label: "Family mean ± 1 SEM" }, { swatch: <Swatch kind="dash" />, label: `Human baseline, ELI5 (${ELI5_P.toFixed(2)})` }]} />}
                    label={`Mean P(formal) by family: ${FAMILY_P.map((f) => `${f.name} ${f.mean.toFixed(2)}`).join(", ")}; ELI5 baseline ${ELI5_P.toFixed(2)}`}>
                    {(c) => {
                    const { inView } = c;
                        const L = 50, R = c.w - 4, T = 8, B = c.h - 42;
                        const y = lin(0, 1, B, T);
                        const band = (R - L) / FAMILY_P.length;
                        const cx = (i: number) => L + band * (i + 0.5);
                        const bw = Math.min(56, band * 0.62);
                        return (
                            <>
                                <Grid y={y} yTicks={range(0, 1, 0.2)} L={L} R={R} T={T} B={B} />
                                {FAMILY_P.map((f, i) => (
                                    <g key={f.name} {...hover(c, cx(i), y(f.mean + f.sem), `${f.name}: ${f.mean.toFixed(3)} ± ${f.sem.toFixed(3)}`)}>
                                        <rect x={cx(i) - band / 2} width={band} y={T} height={B - T} fill="transparent" />
                                        <motion.rect x={cx(i) - bw / 2} width={bw} rx={3} className="fill-accent"
                                            initial={{ y: y(0), height: 0 }} animate={{ y: inView ? y(f.mean) : y(0), height: inView ? y(0) - y(f.mean) : 0 }}
                                            transition={grow(inView, i)} />
                                        <motion.g stroke="currentColor" strokeOpacity={0.75} strokeWidth={1.5} {...stretch(inView, "y", 0.6 + i * 0.06, 0.5)}>
                                            <line x1={cx(i)} x2={cx(i)} y1={y(f.mean - f.sem)} y2={y(f.mean + f.sem)} />
                                            <line x1={cx(i) - 5} x2={cx(i) + 5} y1={y(f.mean - f.sem)} y2={y(f.mean - f.sem)} />
                                            <line x1={cx(i) - 5} x2={cx(i) + 5} y1={y(f.mean + f.sem)} y2={y(f.mean + f.sem)} />
                                        </motion.g>
                                    </g>
                                ))}
                                <line x1={L} x2={R} y1={y(ELI5_P)} y2={y(ELI5_P)} stroke="currentColor" strokeOpacity={0.65} strokeWidth={1.5} strokeDasharray="5 4" />
                                <Baseline x1={L} x2={R} y={B} />
                                <YTicks y={y} ticks={range(0, 1, 0.2)} x={L} fmt={(v) => v.toFixed(1)} />
                                <g fontSize={12.5} fill="currentColor">{FAMILY_P.map((f, i) => <text key={f.name} x={cx(i)} y={B + 18} textAnchor="middle">{f.name}</text>)}</g>
                                <AxisTitle x={9} y={(T + B) / 2} text="Mean P(formal)" vertical />
                            </>
                        );
                    }}
                </Panel>
            </div>
            <p className="m-0 text-[14px] leading-[1.55] text-muted">Error bars show ±1 standard error of the mean. “Other” groups the remaining LMSYS models.</p>
        </figure>
    );
}

/* ---------- Figure 4: LoRA mitigation ---------- */

function BoxPanel({ title, yTitle, data, yMin, yMax, ticks, fmt }: {
    title: string; yTitle: string; data: typeof LORA_FR_BOX; yMin: number; yMax: number; ticks: number[]; fmt: (v: number) => string;
}) {
    return (
        <Panel title={title} height={(w) => Math.round(Math.min(340, Math.max(280, w * 0.85)))}
            label={`${title}: ${data.map((d) => `${d.label} median ${d.med}, quartiles ${d.q1} to ${d.q3}`).join("; ")}`}>
            {(c) => {
                    const { inView } = c;
                const L = 54, R = c.w - 4, T = 8, B = c.h - 30;
                const y = lin(yMin, yMax, B, T);
                const band = (R - L) / data.length;
                const cx = (i: number) => L + band * (i + 0.5);
                const bw = Math.min(56, band * 0.42);
                return (
                    <>
                        <Grid y={y} yTicks={ticks} L={L} R={R} T={T} B={B} />
                        {data.map((d, i) => {
                            const tuned = i === 1;
                            return (
                                <g key={d.label} {...hover(c, cx(i), y(d.hi) - 6, `${d.label}: median ${d.med}, IQR ${d.q1}–${d.q3}`)}>
                                    <rect x={cx(i) - band / 2} width={band} y={T} height={B - T} fill="transparent" />
                                    <g className={tuned ? "stroke-accent" : "stroke-main"} strokeOpacity={tuned ? 1 : 0.7} strokeWidth={1.5}>
                                        {/* whiskers grow out of the box, then the caps and outliers land */}
                                        <motion.line x1={cx(i)} x2={cx(i)} y1={y(d.q3)} y2={y(d.hi)} {...draw(inView, 0.55 + i * 0.2, 0.6)} />
                                        <motion.line x1={cx(i)} x2={cx(i)} y1={y(d.q1)} y2={y(d.lo)} {...draw(inView, 0.55 + i * 0.2, 0.6)} />
                                        <motion.g {...fadeIn(inView, 9 + i * 2)}>
                                            <line x1={cx(i) - bw / 4} x2={cx(i) + bw / 4} y1={y(d.hi)} y2={y(d.hi)} />
                                            <line x1={cx(i) - bw / 4} x2={cx(i) + bw / 4} y1={y(d.lo)} y2={y(d.lo)} />
                                            {d.fliers.map((f, fi) => <circle key={fi} cx={cx(i)} cy={y(f)} r={4} fill="none" />)}
                                        </motion.g>
                                    </g>
                                    {/* the box opens out from its middle */}
                                    <motion.g {...stretch(inView, "y", 0.15 + i * 0.2, 0.7)}>
                                        <rect x={cx(i) - bw / 2} width={bw} y={y(d.q3)} height={Math.max(2, y(d.q1) - y(d.q3))} rx={3}
                                            className={tuned ? "fill-accent-soft stroke-accent" : "fill-card stroke-main"} strokeOpacity={tuned ? 1 : 0.7} strokeWidth={1.5} />
                                        <line x1={cx(i) - bw / 2} x2={cx(i) + bw / 2} y1={y(d.med)} y2={y(d.med)} className={tuned ? "stroke-accent" : "stroke-main"} strokeWidth={2.5} />
                                    </motion.g>
                                </g>
                            );
                        })}
                        <Baseline x1={L} x2={R} y={B} />
                        <YTicks y={y} ticks={ticks} x={L} fmt={fmt} />
                        <g fontSize={12.5} fill="currentColor">{data.map((d, i) => <text key={d.label} x={cx(i)} y={B + 18} textAnchor="middle" fontWeight={i === 1 ? 600 : 400}>{d.label}</text>)}</g>
                        <AxisTitle x={9} y={(T + B) / 2} text={yTitle} vertical />
                    </>
                );
            }}
        </Panel>
    );
}

export function MitigationFigure() {
    const ref = useRef<HTMLDivElement>(null);
    const lim = 43.91 * 1.1;
    return (
        <Figure inViewRef={ref} title="Mitigation: Qwen2.5-3B-Instruct before and after LoRA" cols="md:grid-cols-2 xl:grid-cols-3"
            note={<>24 held-out LMSYS prompts, from the notebook’s final run (mean FR 6.56 → 5.48, mean P(formal) 0.858 → 0.795). Most replies score 0 either way, so both FR medians sit at 0. In the scatter, points below the dashed line got less formal.
                <span className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5"><span className="inline-flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-[3px] bg-card ring-1 ring-main/60" />Base model</span><span className="inline-flex items-center gap-2"><span className="inline-block w-3 h-3 rounded-[3px] bg-accent-soft ring-1 ring-accent" />After LoRA</span></span></>}>
            <BoxPanel title="Formality Rate" yTitle="FR (hits / 1k tokens)" data={LORA_FR_BOX} yMin={-2} yMax={46} ticks={range(0, 40, 10)} fmt={(v) => (Number.isInteger(v) ? String(v) : v.toFixed(1))} />
            <BoxPanel title="RoBERTa P(formal)" yTitle="P(formal)" data={LORA_P_BOX} yMin={-0.03} yMax={1.05} ticks={range(0, 1, 0.2)} fmt={(v) => v.toFixed(1)} />
            <Panel title="Per-sample Formality Rate" height={(w) => Math.round(Math.min(340, Math.max(280, w * 0.85)))}
                legend={<LegendRow items={[{ swatch: <Swatch kind="dot" />, label: "One prompt (13 at 0, 0)" }, { swatch: <Swatch kind="dash" />, label: "No change" }]} />}
                label="Per-sample formality rate, base against fine-tuned: 13 prompts at zero on both, the rest scattered on both sides of the no-change line">
                {(c) => {
                    const { inView } = c;
                    const L = 50, R = c.w - 6, T = 6, B = c.h - 40;
                    const x = lin(-2.5, 51, L, R);
                    const y = lin(-2.5, 51, B, T);
                    return (
                        <>
                            <Grid x={x} y={y} xTicks={range(0, 50, 10)} yTicks={range(0, 50, 10)} L={L} R={R} T={T} B={B} />
                            <defs><Sweep id="fa-sweep-diagonal" x={L} y={T - 4} w={R - L} h={B - T + 8} inView={inView} delay={0.15} duration={1.1} /></defs>
                            <line x1={x(0)} y1={y(0)} x2={x(lim)} y2={y(lim)} stroke="currentColor" strokeOpacity={0.55} strokeWidth={1.5} strokeDasharray="5 4"
                                clipPath="url(#fa-sweep-diagonal)" />
                            {LORA_PAIRS.map(([b, f], i) => (i > 11 ? null : (
                                <g key={i} {...hover(c, x(b), y(f) - 8, i === 11 ? "13 prompts: 0 before, 0 after" : `Base ${b}, after LoRA ${f}`)}>
                                    <motion.circle cx={x(b)} cy={y(f)} r={i === 11 ? 6.5 : 5} className="fill-accent" fillOpacity={i === 11 ? 0.9 : 0.7}
                                        initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.4 }}
                                        transition={{ duration: 0.4, delay: inView ? 0.4 + i * 0.04 : 0 }} />
                                </g>
                            )))}
                            <Baseline x1={L} x2={R} y={B} />
                            <XTicks x={x} ticks={range(0, 50, 10)} y={B} />
                            <YTicks y={y} ticks={range(0, 50, 10)} x={L} />
                            <AxisTitle x={(L + R) / 2} y={c.h - 4} text="Base model FR" />
                            <AxisTitle x={9} y={(T + B) / 2} text="After LoRA FR" vertical />
                        </>
                    );
                }}
            </Panel>
        </Figure>
    );
}
