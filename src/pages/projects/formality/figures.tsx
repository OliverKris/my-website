import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import {
    CORPUS_FR, ELI5_P, FAMILY_P, HIST, HUMAN_FR, HUMAN_P, LORA_FR_BOX, LORA_P_BOX, LORA_PAIRS,
    MODEL_FR, MODEL_P, SCATTER_HUMAN, SCATTER_LLM, VIOLINS,
} from "./figureData";

/*
  SVG versions of the study notebook's four figures, in their original layout: same chart
  types, axis ranges, reference lines, legends and palettes (seaborn Set2, coolwarm_r, tab10,
  Greens). Text, gridlines and frames take the site's ink colour so they follow dark mode;
  bars grow and points fade in when a figure scrolls into view.
*/

const EASE = [0.16, 1, 0.3, 1] as const;
const SET2 = ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"];
const COOLWARM_R = ["#d44e41", "#ea7b60", "#f6a283", "#f5c1a9", "#e8d6cc", "#d1dae9", "#b5cdfa", "#94b6ff", "#7597f6", "#5673e0"];
const TAB10 = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2"];
const GREENS = ["#c7e9c0", "#73c476", "#228a44"];
const SRC = { blended: "#2ecc71", eli5: "#16a085", lmsys: "#e74c3c", reddit: "#27ae60" };
const REF_GREEN = "#2f9e44";

/* ---------- primitives ---------- */

type Scale = (v: number) => number;
const lin = (d0: number, d1: number, r0: number, r1: number): Scale => (v) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
const range = (a: number, b: number, step: number) => {
    const out: number[] = [];
    for (let v = a; v <= b + step / 1e6; v += step) out.push(Math.round(v * 1e6) / 1e6);
    return out;
};

interface PanelGeom { W: number; H: number; L: number; R: number; T: number; B: number }

function Panel({ geom, title, xLabel, yLabel, xTicks, yTicks, x, y, fmtX = String, fmtY = String, xCats, rotateCats, children, label }: {
    geom: PanelGeom; title: string; xLabel?: string; yLabel?: string;
    xTicks?: number[]; yTicks?: number[]; x?: Scale; y?: Scale; fmtX?: (v: number) => string; fmtY?: (v: number) => string;
    xCats?: { at: number; label: string }[]; rotateCats?: boolean; children: ReactNode; label: string;
}) {
    const { W, H, L, R, T, B } = geom;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-auto text-main overflow-visible" role="img" aria-label={label}>
            <text x={(L + W - R) / 2} y={T - 12} textAnchor="middle" fontSize={16} fill="currentColor">{title}</text>
            {/* gridlines */}
            <g stroke="currentColor" strokeOpacity={0.13}>
                {x && xTicks?.map((t) => <line key={`x${t}`} x1={x(t)} x2={x(t)} y1={T} y2={H - B} />)}
                {y && yTicks?.map((t) => <line key={`y${t}`} x1={L} x2={W - R} y1={y(t)} y2={y(t)} />)}
            </g>
            {children}
            <rect x={L} y={T} width={W - L - R} height={H - T - B} fill="none" stroke="currentColor" strokeOpacity={0.3} />
            {/* tick labels */}
            <g fontSize={13.5} fill="currentColor" className="tabular-nums">
                {x && xTicks?.map((t) => <text key={`xt${t}`} x={x(t)} y={H - B + 20} textAnchor="middle">{fmtX(t)}</text>)}
                {y && yTicks?.map((t) => <text key={`yt${t}`} x={L - 8} y={y(t) + 4.5} textAnchor="end">{fmtY(t)}</text>)}
                {xCats?.map((c) => rotateCats
                    ? <text key={c.label} transform={`translate(${c.at + 6},${H - B + 16}) rotate(-20)`} textAnchor="end">{c.label}</text>
                    : <text key={c.label} x={c.at} y={H - B + 20} textAnchor="middle">{c.label}</text>)}
            </g>
            {xLabel && <text x={(L + W - R) / 2} y={H - 8} textAnchor="middle" fontSize={15} fill="currentColor">{xLabel}</text>}
            {yLabel && <text transform={`translate(14,${(T + H - B) / 2}) rotate(-90)`} textAnchor="middle" fontSize={15} fill="currentColor">{yLabel}</text>}
        </svg>
    );
}

function Legend({ x, y, items, w }: { x: number; y: number; w: number; items: { kind: "dash" | "band" | "box" | "dot"; color: string; label: string; opacity?: number }[] }) {
    return (
        <g transform={`translate(${x},${y})`} fontSize={11.5}>
            <rect width={w} height={items.length * 18 + 8} rx={3} className="fill-canvas" fillOpacity={0.85} stroke="currentColor" strokeOpacity={0.2} />
            {items.map((it, i) => (
                <g key={it.label} transform={`translate(8,${14 + i * 18})`}>
                    {it.kind === "dash" && <line x1={0} x2={22} y1={-4} y2={-4} stroke={it.color} strokeWidth={2} strokeDasharray="5 3" />}
                    {it.kind === "band" && <rect x={0} y={-9} width={22} height={9} fill={it.color} fillOpacity={it.opacity ?? 0.15} stroke={it.color} strokeOpacity={0.3} />}
                    {it.kind === "box" && <rect x={0} y={-9} width={22} height={9} fill={it.color} fillOpacity={it.opacity ?? 1} />}
                    {it.kind === "dot" && <circle cx={11} cy={-4} r={4} fill={it.color} fillOpacity={it.opacity ?? 1} />}
                    <text x={30} y={0} fill="currentColor">{it.label}</text>
                </g>
            ))}
        </g>
    );
}

/** Wraps a figure: optional bold suptitle, responsive panel grid, caption. */
function Figure({ title, cols, children, note, inViewRef }: {
    title?: string; cols: string; children: ReactNode; note?: ReactNode; inViewRef: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <figure className="m-0 rounded-2xl bg-canvas p-5 md:p-8 flex flex-col gap-5" data-ui>
            {title && <figcaption className="text-center text-[16px] md:text-[17px] font-bold">{title}</figcaption>}
            <div ref={inViewRef} className={`grid gap-x-8 gap-y-10 ${cols}`}>{children}</div>
            {note && <p className="m-0 text-[14px] leading-[1.5] text-muted">{note}</p>}
        </figure>
    );
}

const grow = (inView: boolean, i: number) => ({ duration: 0.9, ease: EASE, delay: inView ? 0.1 + i * 0.05 : 0 });

/* ---------- Figure 1: formality rate by corpus and by model ---------- */

export function FormalityRateFigure() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.25 });

    const g1: PanelGeom = { W: 470, H: 430, L: 112, R: 14, T: 34, B: 118 };
    const y1 = lin(-6, 21, g1.H - g1.B, g1.T);
    const band = (g1.W - g1.L - g1.R) / CORPUS_FR.length;
    const cx = (i: number) => g1.L + band * (i + 0.5);

    const g2: PanelGeom = { W: 470, H: 430, L: 150, R: 12, T: 34, B: 52 };
    const x2 = lin(-5.4, 14.4, g2.L, g2.W - g2.R);
    const rowH = (g2.H - g2.T - g2.B) / MODEL_FR.length;
    const ry = (i: number) => g2.T + rowH * (i + 0.5);

    return (
        <Figure inViewRef={ref} cols="md:grid-cols-2"
            note="Formal hits per 1,000 tokens. Left: error bars are ±1 standard deviation, which runs below zero because many texts score exactly 0. Right: the ten most frequent models in LMSYS against the pooled human mean.">
            <Panel geom={g1} title="Mean Formality Rate by Corpus" xLabel="Corpus" yLabel="FR (hits / 1k tokens)"
                y={y1} yTicks={range(-5, 20, 5)} xCats={CORPUS_FR.map((c, i) => ({ at: cx(i), label: c.label }))} rotateCats
                label={`Mean formality rate: ${CORPUS_FR.map((c) => `${c.label} ${c.mean.toFixed(2)}`).join(", ")}`}>
                {CORPUS_FR.map((c, i) => (
                    <g key={c.label}>
                        <motion.rect x={cx(i) - band * 0.4} width={band * 0.8} fill={SET2[i]}
                            initial={{ y: y1(0), height: 0 }}
                            animate={{ y: inView ? y1(c.mean) : y1(0), height: inView ? y1(0) - y1(c.mean) : 0 }}
                            transition={grow(inView, i)}>
                            <title>{`${c.label}: ${c.mean.toFixed(2)} ± ${c.sd.toFixed(2)}`}</title>
                        </motion.rect>
                        <motion.line x1={cx(i)} x2={cx(i)} y1={y1(c.mean - c.sd)} y2={y1(c.mean + c.sd)} stroke="currentColor" strokeOpacity={0.75} strokeWidth={3}
                            initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ duration: 0.5, delay: inView ? 0.6 + i * 0.05 : 0 }} />
                    </g>
                ))}
            </Panel>

            <Panel geom={g2} title="Mean Formality Rate by Model (LMSYS)" xLabel="FR (hits / 1k tokens)" yLabel="Model"
                x={x2} xTicks={range(-5, 12.5, 2.5)} fmtX={(v) => v.toFixed(1)}
                label={`Mean formality rate by model: ${MODEL_FR.map(([m, v]) => `${m} ${v}`).join(", ")}; human mean ${HUMAN_FR.mean}`}>
                {MODEL_FR.map(([m, v], i) => (
                    <g key={m}>
                        <text x={g2.L - 8} y={ry(i) + 4.5} textAnchor="end" fontSize={13.5} fill="currentColor">{m}</text>
                        <motion.rect y={ry(i) - rowH * 0.25} height={rowH * 0.5} x={x2(0)} fill={SET2[(MODEL_FR.length - 1 - i) % 8]}
                            initial={{ width: 0 }} animate={{ width: inView ? x2(v) - x2(0) : 0 }} transition={grow(inView, MODEL_FR.length - i)}>
                            <title>{`${m}: ${v.toFixed(2)}`}</title>
                        </motion.rect>
                    </g>
                ))}
                <rect x={x2(HUMAN_FR.mean - HUMAN_FR.sd)} width={x2(HUMAN_FR.mean + HUMAN_FR.sd) - x2(HUMAN_FR.mean - HUMAN_FR.sd)}
                    y={g2.T} height={g2.H - g2.T - g2.B} fill={REF_GREEN} fillOpacity={0.1} pointerEvents="none" />
                <line x1={x2(HUMAN_FR.mean)} x2={x2(HUMAN_FR.mean)} y1={g2.T} y2={g2.H - g2.B} stroke={REF_GREEN} strokeWidth={2} strokeDasharray="6 4" />
                <Legend x={g2.W - g2.R - 132} y={g2.T + 6} w={126} items={[
                    { kind: "dash", color: REF_GREEN, label: `Human mean (${HUMAN_FR.mean.toFixed(1)})` },
                    { kind: "band", color: REF_GREEN, label: "±1 std" },
                    { kind: "box", color: SET2[0], label: "FR" },
                ]} />
            </Panel>
        </Figure>
    );
}

/* ---------- Figure 2: four-panel corpus analysis ---------- */

function violinPath(profile: [number, number][], cx: number, half: number, y: Scale) {
    const right = profile.map(([p, w]) => `${cx + w * half},${y(p)}`);
    const left = [...profile].reverse().map(([p, w]) => `${cx - w * half},${y(p)}`);
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

export function CorpusAnalysisFigure() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.15 });
    const fade = (i = 0) => ({ initial: { opacity: 0 }, animate: { opacity: inView ? 1 : 0 }, transition: { duration: 0.8, delay: inView ? 0.1 + i * 0.1 : 0 } });

    // histogram
    const gh: PanelGeom = { W: 520, H: 400, L: 58, R: 12, T: 34, B: 56 };
    const hx = lin(-0.05, 1.05, gh.L, gh.W - gh.R);
    const hy = lin(0, 28.8, gh.H - gh.B, gh.T);
    const order = ["blended", "eli5", "lmsys", "reddit"] as const;
    const names = { blended: "Human (BlendedSkillTalk)", eli5: "Human (ELI5)", lmsys: "LLM (LMSYS-Chat)", reddit: "Human (Reddit)" };

    // scatter
    const gs: PanelGeom = { W: 520, H: 400, L: 62, R: 12, T: 34, B: 56 };
    const sx = lin(-4, 81, gs.L, gs.W - gs.R);
    const sy = lin(-0.05, 1.05, gs.H - gs.B, gs.T);

    // per-model P(formal)
    const gb: PanelGeom = { W: 520, H: 430, L: 150, R: 12, T: 34, B: 56 };
    const bx = lin(0, 0.955, gb.L, gb.W - gb.R);
    const rowH = (gb.H - gb.T - gb.B) / MODEL_P.length;
    const by = (i: number) => gb.T + rowH * (i + 0.5);

    // violins
    const gv: PanelGeom = { W: 520, H: 430, L: 62, R: 12, T: 34, B: 70 };
    const vy = lin(-0.18, 1.18, gv.H - gv.B, gv.T);
    const vband = (gv.W - gv.L - gv.R) / 3;
    const vcx = (i: number) => gv.L + vband * (i + 0.5);
    const half = vband * 0.4;

    return (
        <Figure inViewRef={ref} title="Formal Language Bias Analysis" cols="lg:grid-cols-2"
            note="RoBERTa P(formal) is the classifier’s probability that a text is formal. The scatter shows a random sample of texts; LLM replies cluster at the top whatever their Formality Rate, while human texts with no listed formal words still spread across the whole range.">
            <Panel geom={gh} title="RoBERTa Formality Score Distribution" xLabel="P(Formal)" yLabel="Density"
                x={hx} xTicks={range(0, 1, 0.2)} fmtX={(v) => v.toFixed(1)} y={hy} yTicks={range(0, 25, 5)}
                label="Histograms of P(formal): human corpora pile up near 0 and LLM replies near 1, with ELI5 also skewed high">
                {order.map((s, si) => (
                    <motion.g key={s} {...fade(si)}>
                        {HIST[s].map((d, i) => (
                            <rect key={i} x={hx(i / 50)} width={hx(0.02) - hx(0) - 0.6} y={hy(d)} height={hy(0) - hy(d)} fill={SRC[s]} fillOpacity={0.55} />
                        ))}
                    </motion.g>
                ))}
                <Legend x={gh.L + 8} y={gh.T + 6} w={168} items={order.map((s) => ({ kind: "box" as const, color: SRC[s], opacity: 0.6, label: names[s] }))} />
            </Panel>

            <Panel geom={gs} title="FR vs. RoBERTa Formality Score" xLabel="Formality Rate (FR)" yLabel="RoBERTa P(Formal)"
                x={sx} xTicks={range(0, 80, 10)} y={sy} yTicks={range(0, 1, 0.2)} fmtY={(v) => v.toFixed(1)}
                label="Scatter of Formality Rate against P(formal) for LLM and human texts">
                <motion.g {...fade(0)}>
                    {SCATTER_LLM.map(([f, p], i) => <circle key={i} cx={sx(f)} cy={sy(p)} r={2.2} fill={SRC.lmsys} fillOpacity={0.3} />)}
                </motion.g>
                <motion.g {...fade(1)}>
                    {SCATTER_HUMAN.map(([f, p], i) => <circle key={i} cx={sx(f)} cy={sy(p)} r={2.2} fill={SRC.blended} fillOpacity={0.3} />)}
                </motion.g>
                <Legend x={gs.W - gs.R - 130} y={sy(0.62)} w={122} items={[
                    { kind: "box", color: SRC.lmsys, label: "LLM (LMSYS)" },
                    { kind: "box", color: SRC.blended, label: "Human baselines" },
                ]} />
            </Panel>

            <Panel geom={gb} title="Mean RoBERTa Formality by Model" xLabel="P(Formal)" yLabel="Model"
                x={bx} xTicks={range(0, 0.8, 0.2)} fmtX={(v) => v.toFixed(1)}
                label={`Mean P(formal) by model: ${MODEL_P.map(([m, v]) => `${m} ${v}`).join(", ")}; human mean 0.50`}>
                {MODEL_P.map(([m, v], i) => (
                    <g key={m}>
                        <text x={gb.L - 8} y={by(i) + 4.5} textAnchor="end" fontSize={13.5} fill="currentColor">{m}</text>
                        <motion.rect y={by(i) - rowH * 0.25} height={rowH * 0.5} x={bx(0)} fill={COOLWARM_R[MODEL_P.length - 1 - i]}
                            initial={{ width: 0 }} animate={{ width: inView ? bx(v) - bx(0) : 0 }} transition={grow(inView, MODEL_P.length - i)}>
                            <title>{`${m}: ${v.toFixed(3)}`}</title>
                        </motion.rect>
                    </g>
                ))}
                <rect x={bx(HUMAN_P.mean - HUMAN_P.sd)} width={bx(HUMAN_P.mean + HUMAN_P.sd) - bx(HUMAN_P.mean - HUMAN_P.sd)}
                    y={gb.T} height={gb.H - gb.T - gb.B} fill={REF_GREEN} fillOpacity={0.1} pointerEvents="none" />
                <line x1={bx(HUMAN_P.mean)} x2={bx(HUMAN_P.mean)} y1={gb.T} y2={gb.H - gb.B} stroke={REF_GREEN} strokeWidth={2} strokeDasharray="6 4" />
                <Legend x={gb.W - gb.R - 140} y={gb.T + 6} w={134} items={[
                    { kind: "dash", color: REF_GREEN, label: `Human mean (${HUMAN_P.mean.toFixed(2)})` },
                    { kind: "band", color: REF_GREEN, label: "±1 std" },
                    { kind: "box", color: COOLWARM_R[0], label: "P(formal)" },
                ]} />
            </Panel>

            <Panel geom={gv} title="Formality Across Human Baselines" xLabel="Human Corpus" yLabel="RoBERTa P(Formal)"
                y={vy} yTicks={range(0, 1, 0.2)} fmtY={(v) => v.toFixed(1)} xCats={VIOLINS.map((v, i) => ({ at: vcx(i), label: v.label }))} rotateCats
                label="Violin plots of P(formal): BlendedSkillTalk and Reddit concentrate near 0 with medians 0.08 and 0.06; ELI5 concentrates near 1 with median 0.93">
                {VIOLINS.map((v, i) => (
                    <motion.g key={v.label} {...fade(i)}>
                        <path d={violinPath(v.profile, vcx(i), half, vy)} fill={GREENS[i]} stroke="currentColor" strokeOpacity={0.8} strokeWidth={1.5} />
                        {v.q.map((q, qi) => {
                            const w = widthAt(v.profile, q) * half;
                            return <line key={qi} x1={vcx(i) - w} x2={vcx(i) + w} y1={vy(q)} y2={vy(q)} stroke="currentColor" strokeOpacity={0.85}
                                strokeWidth={1.4} strokeDasharray={qi === 1 ? "6 3" : "1.5 2.5"}><title>{`${["Q1", "Median", "Q3"][qi]}: ${q}`}</title></line>;
                        })}
                    </motion.g>
                ))}
            </Panel>
        </Figure>
    );
}

/* ---------- Figure 3: model families ---------- */

export function FamilyFigure() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    const g: PanelGeom = { W: 640, H: 340, L: 62, R: 12, T: 34, B: 56 };
    const y = lin(0, 0.99, g.H - g.B, g.T);
    const band = (g.W - g.L - g.R) / FAMILY_P.length;
    const cx = (i: number) => g.L + band * (i + 0.5);
    return (
        <Figure inViewRef={ref} cols="grid-cols-1"
            note="Error bars show ±1 standard error of the mean. “Other” groups the remaining LMSYS models.">
            <Panel geom={g} title="Formality by Model Family (RoBERTa score)" xLabel="Model Family" yLabel="Mean P(Formal)"
                y={y} yTicks={range(0, 0.8, 0.2)} fmtY={(v) => v.toFixed(1)} xCats={FAMILY_P.map((f, i) => ({ at: cx(i), label: f.name }))}
                label={`Mean P(formal) by family: ${FAMILY_P.map((f) => `${f.name} ${f.mean.toFixed(2)}`).join(", ")}; ELI5 baseline ${ELI5_P.toFixed(2)}`}>
                {FAMILY_P.map((f, i) => (
                    <g key={f.name}>
                        <motion.rect x={cx(i) - band * 0.4} width={band * 0.8} fill={TAB10[i]}
                            initial={{ y: y(0), height: 0 }} animate={{ y: inView ? y(f.mean) : y(0), height: inView ? y(0) - y(f.mean) : 0 }}
                            transition={grow(inView, i)}>
                            <title>{`${f.name}: ${f.mean.toFixed(4)} ± ${f.sem.toFixed(4)}`}</title>
                        </motion.rect>
                        <motion.g stroke="currentColor" strokeOpacity={0.85} strokeWidth={1.5}
                            initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ duration: 0.5, delay: inView ? 0.7 + i * 0.05 : 0 }}>
                            <line x1={cx(i)} x2={cx(i)} y1={y(f.mean - f.sem)} y2={y(f.mean + f.sem)} />
                            <line x1={cx(i) - 6} x2={cx(i) + 6} y1={y(f.mean - f.sem)} y2={y(f.mean - f.sem)} />
                            <line x1={cx(i) - 6} x2={cx(i) + 6} y1={y(f.mean + f.sem)} y2={y(f.mean + f.sem)} />
                        </motion.g>
                    </g>
                ))}
                <line x1={g.L} x2={g.W - g.R} y1={y(ELI5_P)} y2={y(ELI5_P)} stroke={REF_GREEN} strokeWidth={2} strokeDasharray="6 4" />
                <Legend x={g.W - g.R - 176} y={g.T + 6} w={170} items={[{ kind: "dash", color: REF_GREEN, label: "Human baseline (ELI5)" }]} />
            </Panel>
        </Figure>
    );
}

/* ---------- Figure 4: LoRA mitigation ---------- */

function BoxPanel({ title, yLabel, data, yMin, yMax, ticks, fmt, fill, inView }: {
    title: string; yLabel: string; data: typeof LORA_FR_BOX; yMin: number; yMax: number; ticks: number[]; fmt: (v: number) => string; fill: string; inView: boolean;
}) {
    const g: PanelGeom = { W: 400, H: 380, L: 64, R: 12, T: 34, B: 40 };
    const y = lin(yMin, yMax, g.H - g.B, g.T);
    const band = (g.W - g.L - g.R) / data.length;
    const cx = (i: number) => g.L + band * (i + 0.5);
    const bw = 34;
    return (
        <Panel geom={g} title={title} yLabel={yLabel} y={y} yTicks={ticks} fmtY={fmt} xCats={data.map((d, i) => ({ at: cx(i), label: d.label }))}
            label={`${title}: ${data.map((d) => `${d.label} median ${d.med}, quartiles ${d.q1} to ${d.q3}`).join("; ")}`}>
            {data.map((d, i) => (
                <motion.g key={d.label} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ duration: 0.7, delay: inView ? 0.15 + i * 0.12 : 0 }}
                    stroke="currentColor" strokeOpacity={0.9} strokeWidth={1.3}>
                    <title>{`${d.label}: median ${d.med}, Q1 ${d.q1}, Q3 ${d.q3}, whiskers ${d.lo} to ${d.hi}`}</title>
                    <line x1={cx(i)} x2={cx(i)} y1={y(d.q3)} y2={y(d.hi)} />
                    <line x1={cx(i)} x2={cx(i)} y1={y(d.lo)} y2={y(d.q1)} />
                    <line x1={cx(i) - bw / 4} x2={cx(i) + bw / 4} y1={y(d.hi)} y2={y(d.hi)} />
                    <line x1={cx(i) - bw / 4} x2={cx(i) + bw / 4} y1={y(d.lo)} y2={y(d.lo)} />
                    <rect x={cx(i) - bw / 2} width={bw} y={y(d.q3)} height={Math.max(1, y(d.q1) - y(d.q3))} fill={fill} />
                    <line x1={cx(i) - bw / 2} x2={cx(i) + bw / 2} y1={y(d.med)} y2={y(d.med)} stroke="#ff7f0e" strokeOpacity={1} strokeWidth={1.8} />
                    {d.fliers.map((f, fi) => <circle key={fi} cx={cx(i)} cy={y(f)} r={4.5} fill="none" />)}
                </motion.g>
            ))}
        </Panel>
    );
}

export function MitigationFigure() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.25 });
    const g: PanelGeom = { W: 400, H: 380, L: 56, R: 12, T: 34, B: 52 };
    const x = lin(-2.4, 51, g.L, g.W - g.R);
    const y = lin(-2.4, 51, g.H - g.B, g.T);
    const lim = 43.91 * 1.1;
    return (
        <Figure inViewRef={ref} title="Formality Bias Mitigation Results" cols="md:grid-cols-2 xl:grid-cols-3"
            note="Qwen2.5-3B-Instruct before and after LoRA on 24 held-out LMSYS prompts, from the notebook’s final run (mean FR 6.56 → 5.48, mean P(formal) 0.858 → 0.795). Most replies score 0 either way, so both FR medians sit at 0. Points below the dashed line got less formal.">
            <BoxPanel title="Formality Rate Before vs. After LoRA" yLabel="FR (hits / 1k tokens)" data={LORA_FR_BOX}
                yMin={-2.2} yMax={46} ticks={range(0, 40, 10)} fmt={String} fill="#add8e6" inView={inView} />
            <BoxPanel title="RoBERTa P(Formal) Before vs. After LoRA" yLabel="P(Formal)" data={LORA_P_BOX}
                yMin={-0.03} yMax={1.05} ticks={range(0, 1, 0.2)} fmt={(v) => v.toFixed(1)} fill="#ffffe0" inView={inView} />
            <Panel geom={g} title="Per-sample FR: Base vs. Fine-tuned" xLabel="Base FR" yLabel="Fine-tuned FR"
                x={x} xTicks={range(0, 50, 10)} y={y} yTicks={range(0, 50, 10)}
                label="Per-sample formality rate, base against fine-tuned: 13 prompts at zero on both, the rest scattered on both sides of the no-change line">
                <motion.line x1={x(0)} y1={y(0)} x2={x(lim)} y2={y(lim)} stroke="#d62728" strokeOpacity={0.8} strokeWidth={1.8} strokeDasharray="6 4"
                    initial={{ pathLength: 0 }} animate={{ pathLength: inView ? 1 : 0 }} transition={{ duration: 1, ease: EASE, delay: inView ? 0.2 : 0 }} />
                {LORA_PAIRS.map(([b, f], i) => (
                    <motion.circle key={i} cx={x(b)} cy={y(f)} r={5} fill="#4682b4" fillOpacity={0.6}
                        initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.4 }}
                        transition={{ duration: 0.4, delay: inView ? 0.4 + i * 0.03 : 0 }}>
                        <title>{`Base ${b}, fine-tuned ${f}`}</title>
                    </motion.circle>
                ))}
                <Legend x={g.L + 8} y={g.T + 6} w={100} items={[{ kind: "dash", color: "#d62728", label: "No change" }]} />
            </Panel>
        </Figure>
    );
}
