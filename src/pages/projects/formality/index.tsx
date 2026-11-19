import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { frame, Rise } from "../../../components/site/Rise";
import { computeFR, getVerdict, TIER1 } from "./lexicon";
import { SPECTRUM_DATA } from "./spectrum";

const REPO = "https://github.com/OliverKris/formal-language-bias-llms";

/* ---------- data from the study ---------- */

const SUBSTITUTIONS = [
    { formal: "delve", casual: "dig into" }, { formal: "utilize", casual: "use" },
    { formal: "commence", casual: "start" }, { formal: "elucidate", casual: "explain" },
    { formal: "furthermore", casual: "also" }, { formal: "endeavor", casual: "try" },
    { formal: "obtain", casual: "get" }, { formal: "demonstrate", casual: "show" },
];

const CORPORA = [
    { label: "BlendedSkillTalk", fr: 0.24, llm: false },
    { label: "Reddit", fr: 0.52, llm: false },
    { label: "ELI5", fr: 2.33, llm: false },
    { label: "LLM responses (LMSYS)", fr: 7.62, llm: true },
];

const FAMILIES = [
    { name: "PaLM", p: 0.86 }, { name: "GPT", p: 0.84 }, { name: "Vicuna", p: 0.83 },
    { name: "LLaMA", p: 0.82 }, { name: "Alpaca", p: 0.8 }, { name: "Claude", p: 0.79 },
];
const HUMAN_BASELINE = 0.51;

const TOPICS = [
    { type: "Casual", fr: "2.45", p: "0.61", note: "Lowest of the three, and still above every human corpus." },
    { type: "General", fr: "5.25", p: "0.76", note: "The most formal vocabulary, even when the structure is looser." },
    { type: "Task", fr: "4.68", p: "0.89", note: "The most formal structure: instructions read like documents." },
];

const MITIGATION = [
    {
        label: "Explaining machine learning",
        prompt: "Can you explain what machine learning is?",
        before: "I would be delighted to elucidate the fundamentals of machine learning. This domain encompasses a comprehensive set of algorithms that endeavor to facilitate automated learning from data.",
        after: "Sure! Machine learning is basically a way for computers to learn from data. Instead of writing out every rule yourself, you show the model examples and it figures out the patterns.",
        hits: ["elucidate", "endeavor", "facilitate", "comprehensive"],
    },
    {
        label: "Debugging advice",
        prompt: "What's a good way to debug my code?",
        before: "To commence the debugging process, I would recommend utilizing a systematic approach. Furthermore, implementing logging mechanisms can prove to be an optimal strategy for identifying errors.",
        after: "Start by reading the error message carefully: it usually tells you exactly where things went wrong. Adding print statements is a really useful way to track what your code is doing.",
        hits: ["commence", "utilizing", "furthermore", "implementing", "optimal"],
    },
];

const IMPACT = [
    { title: "Education", desc: "Overly formal AI tutors can alienate learners, especially those unfamiliar with academic register." },
    { title: "Mental health", desc: "Conversational agents in therapy contexts need accessible, warm language, not clinical prose." },
    { title: "Consumer assistants", desc: "Customer-facing tools sound distant and untrustworthy when they respond like a legal document." },
    { title: "Accessibility", desc: "Formal language raises comprehension barriers for readers with lower literacy and for non-native speakers." },
];

const SCORER_EXAMPLES = [
    { label: "LLM-flavoured", text: "I'd like to delve into the matter and elucidate the core concepts." },
    { label: "A text message", text: "yeah so basically you just gotta try it and see what happens lol" },
    { label: "Corporate", text: "Furthermore, we endeavor to implement a robust solution that facilitates optimal outcomes." },
    { label: "Plain opinion", text: "The arguments here seem weak honestly" },
];

/* ---------- pieces ---------- */

function SectionHead({ id, title, children }: { id: string; title: string; children?: ReactNode }) {
    return (
        <Rise as="header" className="flex flex-col gap-5 max-w-[62ch]">
            <h2 id={id} className="m-0 text-[clamp(36px,4.4vw,68px)] font-semibold leading-[1] tracking-[-0.04em]">{title}</h2>
            {children && <div className="text-[length:var(--text-body)] leading-[1.6] flex flex-col gap-4">{children}</div>}
        </Rise>
    );
}

/** The opening demonstration: an AI reply types itself, then its formal words are swapped for plain ones. */
const REPLY = [
    { text: "I would be delighted to ", formal: null },
    { text: "elucidate", formal: "explain" },
    { text: " the matter. To ", formal: null },
    { text: "commence", formal: "start" },
    { text: ", let us ", formal: null },
    { text: "delve into", formal: "get into" },
    { text: " the core concepts.", formal: null },
] as const;
const REPLY_LENGTH = REPLY.reduce((n, s) => n + s.text.length, 0);
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function RegisterDemo() {
    const [run, setRun] = useState(0);
    const [typed, setTyped] = useState(() => (prefersReduced() ? REPLY_LENGTH : 0));
    const [swapped, setSwapped] = useState(() => (prefersReduced() ? 3 : 0));

    useEffect(() => {
        if (prefersReduced()) return;
        let cancelled = false;
        let i = 0;
        let k = 0;
        const timers: number[] = [];
        const swap = () => {
            if (cancelled) return;
            k += 1;
            setSwapped(k);
            if (k < 3) timers.push(window.setTimeout(swap, 650));
        };
        const tick = () => {
            if (cancelled) return;
            i += 1;
            setTyped(i);
            if (i < REPLY_LENGTH) timers.push(window.setTimeout(tick, 26));
            else timers.push(window.setTimeout(swap, 700));
        };
        timers.push(window.setTimeout(() => { setTyped(0); setSwapped(0); tick(); }, 500));
        return () => { cancelled = true; timers.forEach(clearTimeout); };
    }, [run]);

    let offset = 0;
    let formalIndex = 0;
    return (
        <figure className="m-0 rounded-2xl bg-card p-6 md:p-8 flex flex-col gap-5" data-ui>
            <figcaption className="flex items-center justify-between gap-4 text-[15px] text-muted">
                <span>A typical assistant reply, and what a person would say</span>
                <button type="button" onClick={() => setRun((r) => r + 1)} className="h-9 px-3 rounded-full bg-canvas text-main text-[14px] cursor-pointer hover:bg-raised transition-colors">
                    Replay
                </button>
            </figcaption>
            <p className="m-0 min-h-[4.5em] text-[clamp(20px,1.9vw,28px)] leading-[1.5] tracking-[-0.01em]" aria-label="I would be delighted to elucidate the matter. To commence, let us delve into the core concepts.">
                {REPLY.map((seg) => {
                    const shown = seg.text.slice(0, Math.max(0, typed - offset));
                    offset += seg.text.length;
                    if (!seg.formal) return <span key={seg.text} aria-hidden="true">{shown}</span>;
                    const idx = formalIndex++;
                    const struck = idx < swapped;
                    return (
                        <span key={seg.text} aria-hidden="true">
                            <span className={`transition-colors duration-300 ${struck ? "line-through decoration-2 text-muted" : shown ? "font-semibold" : ""}`}>{shown}</span>
                            {struck && <span className="fade-up inline-block ml-[0.3em] font-semibold text-accent">{seg.formal}</span>}
                        </span>
                    );
                })}
                {typed < REPLY_LENGTH && <span aria-hidden="true" className="inline-block w-[2px] h-[1em] align-[-0.12em] bg-accent ml-0.5 animate-pulse" />}
            </p>
        </figure>
    );
}

/** A horizontal bar that grows to its value when it scrolls into view. */
function Bar({ pct, accent, label }: { pct: number; accent: boolean; label: string }) {
    return (
        <span className="block h-3 rounded-full bg-main/10 overflow-hidden" role="img" aria-label={label}>
            <motion.span
                className={`block h-full rounded-full ${accent ? "bg-accent" : "bg-main/35"}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
        </span>
    );
}

function Spectrum() {
    const [value, setValue] = useState(50);
    const current = SPECTRUM_DATA.reduce((a, b) => (Math.abs(b.value - value) < Math.abs(a.value - value) ? b : a));
    return (
        <div className="rounded-2xl bg-card p-6 md:p-8 flex flex-col gap-6" data-ui>
            <label className="flex flex-col gap-3">
                <span className="flex justify-between text-[15px]"><span className="font-semibold">{current.label}</span><span className="text-muted">Drag to change the register</span></span>
                <input type="range" min={0} max={100} step={25} value={value} onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full h-6 cursor-pointer accent-[var(--color-accent-base)]" />
                <span className="flex justify-between text-[13px] text-muted"><span>Super casual</span><span>Highly formal</span></span>
            </label>
            <p key={current.label} className="m-0 fade-up text-[clamp(18px,1.6vw,24px)] leading-[1.45] tracking-[-0.01em]">“{current.example}”</p>
            <dl className="m-0 grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                    <dt className="text-[15px] text-muted">Formality Rate (hits per 1k tokens)</dt>
                    <dd className="m-0 text-[clamp(28px,3vw,44px)] font-semibold tracking-[-0.03em] tabular-nums">{current.fr}</dd>
                </div>
                <div className="flex flex-col gap-1">
                    <dt className="text-[15px] text-muted">RoBERTa P(formal)</dt>
                    <dd className="m-0 text-[clamp(28px,3vw,44px)] font-semibold tracking-[-0.03em] tabular-nums">{current.roberta}</dd>
                </div>
            </dl>
        </div>
    );
}

function Scorer() {
    const [text, setText] = useState(SCORER_EXAMPLES[0].text);
    const { fr, hits } = computeFR(text);
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const hitSet = new Set(hits);
    const parts = text.split(/(\b[\w']+\b)/);
    return (
        <div className="grid gap-8 lg:grid-cols-12 items-start" data-ui>
            <div className="lg:col-span-7 flex flex-col gap-4">
                <label className="flex flex-col gap-2">
                    <span className="sr-only">Text to score</span>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={5}
                        spellCheck={false}
                        placeholder="Paste or type any text…"
                        className="w-full rounded-2xl bg-card p-5 text-[18px] leading-[1.55] text-main border-0 outline-none focus:ring-2 focus:ring-accent resize-y"
                    />
                </label>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Examples">
                    {SCORER_EXAMPLES.map((ex) => (
                        <button key={ex.label} type="button" onClick={() => setText(ex.text)}
                            className={`h-11 px-4 rounded-full text-[15px] cursor-pointer transition-colors ${text === ex.text ? "bg-main text-canvas" : "bg-card text-main hover:bg-raised"}`}>
                            {ex.label}
                        </button>
                    ))}
                </div>
                <p className="m-0 mt-2 text-[18px] leading-[1.6]" aria-label="Your text with formal markers highlighted">
                    {parts.map((part, i) =>
                        hitSet.has(part.toLowerCase())
                            ? <mark key={i} className="bg-accent-soft text-main rounded px-1 font-medium" title={TIER1[part.toLowerCase()] ? `Plainer: ${TIER1[part.toLowerCase()]}` : undefined}>{part}</mark>
                            : <span key={i}>{part}</span>,
                    )}
                </p>
            </div>
            <div className="lg:col-span-5 rounded-2xl bg-card p-6 md:p-8 flex flex-col gap-6" aria-live="polite">
                <dl className="m-0 grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1">
                        <dt className="text-[15px] text-muted">Formality Rate</dt>
                        <dd className="m-0 text-[clamp(36px,4vw,56px)] font-semibold tracking-[-0.04em] tabular-nums text-accent">{words ? fr : "–"}</dd>
                    </div>
                    <div className="flex flex-col gap-1">
                        <dt className="text-[15px] text-muted">Words</dt>
                        <dd className="m-0 text-[clamp(36px,4vw,56px)] font-semibold tracking-[-0.04em] tabular-nums">{words || "–"}</dd>
                    </div>
                </dl>
                <div className="flex flex-col gap-2">
                    <span className="text-[15px] font-semibold">Formal markers, with plainer words</span>
                    <ul className="list-none m-0 p-0 flex flex-wrap gap-2">
                        {hits.length ? hits.map((h) => (
                            <li key={h} className="h-9 px-3 inline-flex items-center rounded-full bg-canvas text-[15px]">
                                {h}{TIER1[h] && <span className="text-muted ml-1.5">→ {TIER1[h]}</span>}
                            </li>
                        )) : <li className="text-[15px] text-muted">None detected.</li>}
                    </ul>
                </div>
                <p className="m-0 text-[16px] leading-[1.55]">{getVerdict(fr, words, hits.length)}</p>
            </div>
        </div>
    );
}

function MitigationExamples() {
    const [i, setI] = useState(0);
    const ex = MITIGATION[i];
    const mark = (t: string) => {
        const re = new RegExp(`\\b(${ex.hits.join("|")})\\b`, "gi");
        return t.split(re).map((part, j) =>
            ex.hits.some((h) => h.toLowerCase() === part.toLowerCase())
                ? <mark key={j} className="bg-accent-soft text-main rounded px-1 font-medium">{part}</mark>
                : <span key={j}>{part}</span>);
    };
    return (
        <div className="flex flex-col gap-6" data-ui>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Examples">
                {MITIGATION.map((m, j) => (
                    <button key={m.label} type="button" role="tab" aria-selected={i === j} onClick={() => setI(j)}
                        className={`h-11 px-4 rounded-full text-[15px] cursor-pointer transition-colors ${i === j ? "bg-main text-canvas" : "bg-card text-main hover:bg-raised"}`}>
                        {m.label}
                    </button>
                ))}
            </div>
            <p className="m-0 text-[17px]"><span className="text-muted">Prompt:</span> “{ex.prompt}”</p>
            <div key={ex.label} className="grid gap-4 md:grid-cols-2 fade-up">
                <div className="rounded-2xl bg-card p-6 flex flex-col gap-3">
                    <span className="text-[15px] font-semibold">Qwen2.5-3B-Instruct, as released</span>
                    <p className="m-0 text-[17px] leading-[1.6]">{mark(ex.before)}</p>
                </div>
                <div className="rounded-2xl bg-accent text-accent-ink p-6 flex flex-col gap-3">
                    <span className="text-[15px] font-semibold">After LoRA fine-tuning</span>
                    <p className="m-0 text-[17px] leading-[1.6]">{ex.after}</p>
                </div>
            </div>
        </div>
    );
}

/* ---------- page ---------- */

export default function FormalityCaseStudy() {
    return (
        <article>
            <header className={`${frame} pt-16 md:pt-24`}>
                <div className="grid gap-10 lg:grid-cols-12 items-end">
                    <div className="lg:col-span-8">
                        <h1 className="m-0 font-semibold text-[10.6vw] sm:text-[clamp(48px,7vw,112px)] leading-[0.95] tracking-[-0.05em]">
                            <span className="mask-line"><span>Why does AI</span></span>
                            <span className="mask-line"><span style={{ ["--line-delay" as string]: "110ms" }}>sound so formal?</span></span>
                        </h1>
                        <p className="mt-8 mb-0 text-[length:var(--text-lead)] leading-[1.35] tracking-[-0.01em] max-w-[40ch] fade-up" style={{ ["--fade-delay" as string]: "300ms" }}>
                            A corpus-level study of formality bias in large language models across six model families, with a lexical
                            metric, a RoBERTa classifier and LoRA mitigation.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3 fade-up" style={{ ["--fade-delay" as string]: "400ms" }}>
                            <a href={REPO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center h-12 px-6 rounded-full bg-accent text-accent-ink text-[16px] font-medium no-underline transition-transform hover:scale-[1.03] active:scale-[0.98]">
                                Code and data
                            </a>
                            <a href="#scorer" className="inline-flex items-center h-12 px-5 rounded-full bg-card text-main text-[16px] no-underline hover:bg-raised transition-colors">
                                Score your own writing
                            </a>
                        </div>
                    </div>
                    <dl className="lg:col-span-4 m-0 grid grid-cols-2 gap-x-6 gap-y-5 text-[15px] fade-up" style={{ ["--fade-delay" as string]: "500ms" }}>
                        <div><dt className="text-muted">Course</dt><dd className="m-0">CSCI 6515, Natural Language Understanding</dd></div>
                        <div><dt className="text-muted">When</dt><dd className="m-0">April 2026, GWU</dd></div>
                        <div><dt className="text-muted">Team</dt><dd className="m-0">Oliver Krisetya, Warren Nguyen</dd></div>
                        <div><dt className="text-muted">Data</dt><dd className="m-0">1M+ LMSYS conversations, three human corpora</dd></div>
                    </dl>
                </div>
            </header>

            <Rise className={`${frame} mt-14`} delay={200}><RegisterDemo /></Rise>

            {/* ---------- Background ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)] grid gap-12 lg:grid-cols-12`} aria-labelledby="background">
                <div className="lg:col-span-7">
                    <SectionHead id="background" title="AI doesn’t talk like us">
                        <p className="m-0">
                            Large language models now sit between people and written language: in education, software engineering,
                            customer support and creative work. Using them, we kept noticing the same thing. Replies sounded unusually
                            formal, even in casual conversation, reaching for “delve”, “commence” or “elucidate” where a person would
                            say “dig into”, “start” or “explain”. It was subtle, but consistent enough that people could tell a message
                            was AI-written.
                        </p>
                        <p className="m-0">
                            So we asked whether formality bias can actually be measured, how consistently it appears across model
                            families, and whether lightweight adaptation can reduce it. The answer became a multi-stage evaluation:
                            linguistic analysis, neural classification, statistical testing and mitigation experiments, across human
                            and AI conversational corpora.
                        </p>
                    </SectionHead>
                </div>
                <Rise delay={120} className="lg:col-span-5 self-end">
                    <table className="w-full border-collapse text-[17px]">
                        <caption className="text-left text-[15px] text-muted pb-3">LLMs prefer, people say</caption>
                        <tbody>
                            {SUBSTITUTIONS.map((s) => (
                                <tr key={s.formal} /* taste-skill-ignore: rows of a real table */ className="border-t">
                                    <td className="py-2.5 pr-4 font-semibold">{s.formal}</td>
                                    <td className="py-2.5 text-accent">{s.casual}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Rise>
            </section>

            {/* ---------- Method ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="method">
                <SectionHead id="method" title="Two ways to hear formality">
                    <p className="m-0">
                        “Utilize” instead of “use”. “Commence” instead of “start”. Each choice is minor; across millions of
                        conversations they add up to a systematic preference for formal language, a <em>register bias</em>.
                        Measuring something as subjective as formality takes more than one lens, so we built two that capture
                        different dimensions of it.
                    </p>
                </SectionHead>
                <div className="mt-14 grid gap-6 md:grid-cols-2">
                    <Rise className="rounded-2xl bg-card p-8 md:p-10 flex flex-col gap-4">
                        <h3 className="m-0 text-[clamp(22px,2vw,30px)] font-semibold tracking-[-0.02em]">Formality Rate, a lexicon</h3>
                        <p className="m-0 text-[17px] leading-[1.6]">
                            If you can list the formal words, you can count them, no machine learning required. A two-tiered lexicon:
                            the first tier catches classic LLM-isms like “delve” and “utilize”, the second covers broader formal vocabulary.
                        </p>
                        <p className="m-0 mt-auto text-[clamp(18px,1.6vw,22px)] font-semibold tracking-[-0.01em]">
                            FR = formal hits ÷ total tokens × 1000
                        </p>
                    </Rise>
                    <Rise delay={90} className="rounded-2xl bg-card p-8 md:p-10 flex flex-col gap-4">
                        <h3 className="m-0 text-[clamp(22px,2vw,30px)] font-semibold tracking-[-0.02em]">RoBERTa, a classifier</h3>
                        <p className="m-0 text-[17px] leading-[1.6]">
                            Formality also lives in how a sentence is built, not only in its words. A RoBERTa model, pretrained on GYAFC
                            and fine-tuned on Pavlick formality scores, outputs a continuous probability that a text is formal.
                        </p>
                        <p className="m-0 mt-auto text-[clamp(18px,1.6vw,22px)] font-semibold tracking-[-0.01em]">P(formal) from 0 to 1</p>
                    </Rise>
                </div>
                <Rise delay={120} className="mt-6"><Spectrum /></Rise>
            </section>

            {/* ---------- Results ---------- */}
            <section className="mt-[clamp(96px,12vw,200px)] bg-card py-[clamp(72px,9vw,140px)]" aria-labelledby="results">
                <div className={`${frame} grid gap-12 lg:grid-cols-12 items-start`}>
                    <div className="lg:col-span-5">
                        <SectionHead id="results" title="LLMs are more formal">
                            <p className="m-0">
                                We analysed over a million conversations from LMSYS-Chat-1M against three human conversational corpora.
                                LLM replies sit far above the human baseline on both metrics, whatever the conversation.
                            </p>
                            <p className="m-0">
                                Even casual LMSYS replies score FR 2.45, above the most formal human corpus (ELI5, 2.33). In general and
                                task-focused conversations the gap widens sharply.
                            </p>
                        </SectionHead>
                    </div>
                    <Rise delay={120} className="lg:col-span-7 rounded-2xl bg-canvas p-6 md:p-8 flex flex-col gap-5" as="figure">
                        <figcaption className="text-[15px] text-muted">Mean Formality Rate by corpus, hits per 1k tokens</figcaption>
                        {CORPORA.map((c) => (
                            <div key={c.label} className="grid grid-cols-[minmax(0,10rem)_1fr_3.5rem] items-center gap-4 text-[16px]">
                                <span className={c.llm ? "font-semibold" : ""}>{c.label}</span>
                                <Bar pct={(c.fr / 8) * 100} accent={c.llm} label={`${c.label}: ${c.fr}`} />
                                <span className={`text-right tabular-nums ${c.llm ? "font-semibold text-accent" : ""}`}>{c.fr}</span>
                            </div>
                        ))}
                    </Rise>
                </div>

                <div className={`${frame} mt-[clamp(80px,10vw,160px)] grid gap-12 lg:grid-cols-12 items-start`}>
                    <Rise className="lg:col-span-7 rounded-2xl bg-canvas p-6 md:p-8 flex flex-col gap-5 lg:order-1 order-2" as="figure">
                        <figcaption className="text-[15px] text-muted">RoBERTa P(formal) by model family; the human baseline is {HUMAN_BASELINE}</figcaption>
                        <div className="relative flex flex-col gap-4">
                            <span aria-hidden="true" className="absolute top-0 bottom-0 border-l-2 border-dashed border-main/40" style={{ left: `calc(5rem + 1rem + (100% - 5rem - 1rem - 3.5rem - 1rem) * ${HUMAN_BASELINE})` }} />
                            {FAMILIES.map((f) => (
                                <div key={f.name} className="grid grid-cols-[5rem_1fr_3.5rem] items-center gap-4 text-[16px]">
                                    <span className="font-semibold">{f.name}</span>
                                    <Bar pct={f.p * 100} accent label={`${f.name}: ${f.p}`} />
                                    <span className="text-right tabular-nums">{f.p.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </Rise>
                    <div className="lg:col-span-5 lg:order-2 order-1">
                        <SectionHead id="families" title="Every family, not one model">
                            <p className="m-0">
                                Run across every model family in the dataset, the classifier puts nearly all of them well above the human
                                baseline: 28 to 35 points higher. The variation between families points to pretraining data and alignment
                                choices, not architecture, as the main driver.
                            </p>
                        </SectionHead>
                    </div>
                </div>

                <div className={`${frame} mt-[clamp(80px,10vw,160px)]`}>
                    <SectionHead id="topics" title="The task changes the tone">
                        <p className="m-0">Splitting LMSYS conversations into casual, general and task-oriented ones shows how much register moves within LLMs themselves.</p>
                    </SectionHead>
                    <div className="mt-12 grid gap-6 md:grid-cols-3">
                        {TOPICS.map((t, i) => (
                            <Rise key={t.type} delay={i * 80} className="rounded-2xl bg-canvas p-6 md:p-8 flex flex-col gap-4">
                                <h3 className="m-0 text-[clamp(22px,2vw,28px)] font-semibold tracking-[-0.02em]">{t.type}</h3>
                                <dl className="m-0 grid grid-cols-2 gap-4">
                                    <div className="flex flex-col-reverse"><dt className="text-[14px] text-muted">Formality Rate</dt><dd className="m-0 text-[clamp(26px,2.4vw,36px)] font-semibold tabular-nums tracking-[-0.03em]">{t.fr}</dd></div>
                                    <div className="flex flex-col-reverse"><dt className="text-[14px] text-muted">P(formal)</dt><dd className="m-0 text-[clamp(26px,2.4vw,36px)] font-semibold tabular-nums tracking-[-0.03em]">{t.p}</dd></div>
                                </dl>
                                <p className="m-0 text-[16px] leading-[1.55]">{t.note}</p>
                            </Rise>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- Try it ---------- */}
            <section id="scorer" className={`${frame} pt-[clamp(96px,12vw,200px)] scroll-mt-24`} aria-labelledby="try">
                <SectionHead id="try" title="Where does your writing land?">
                    <p className="m-0">Type or paste anything: an email draft, an AI reply, a text message. It is scored live with the same two-tiered lexicon as the study.</p>
                </SectionHead>
                <Rise delay={120} className="mt-12"><Scorer /></Rise>
            </section>

            {/* ---------- Mitigation ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="mitigation">
                <SectionHead id="mitigation" title="Can we teach a model to relax?">
                    <p className="m-0">
                        With the bias measured, we tried reducing it. We applied LoRA fine-tuning to Qwen2.5-3B-Instruct on a curated
                        low-formality dataset and evaluated it on held-out LMSYS prompts. LoRA freezes the original weights and trains
                        small adapter matrices, so no full retraining is needed.
                    </p>
                </SectionHead>
                <Rise delay={120} className="mt-12"><MitigationExamples /></Rise>
                <Rise delay={150} className="mt-10 grid gap-14 md:gap-6 md:grid-cols-3">
                    {[
                        { v: "−12%", l: "Mean Formality Rate", d: "6.20 → 5.46" },
                        { v: "−0.07", l: "RoBERTa P(formal)", d: "0.868 → 0.794" },
                        { v: "≈", l: "ROUGE-L, content kept", d: "0.073 → 0.077" },
                    ].map((m) => (
                        <div key={m.l} className="flex flex-col gap-1">
                            <span className="text-[clamp(44px,5vw,72px)] font-semibold leading-[1] tracking-[-0.04em]">{m.v}</span>
                            <span className="text-[17px] font-medium">{m.l}</span>
                            <span className="text-[15px] text-muted tabular-nums">{m.d}</span>
                        </div>
                    ))}
                </Rise>
                <Rise delay={180} className="mt-10 max-w-[70ch]">
                    <p className="m-0 text-[16px] leading-[1.6]">
                        A caveat: the held-out set was small (50 prompts) and the paired t-test did not reach significance. The results
                        suggest register is steerable with lightweight adaptation, not that the model is debiased. Scaling to Mistral-7B
                        or LLaMA-3-8B with human evaluation is the next step.
                    </p>
                </Rise>
            </section>

            {/* ---------- Why it matters + next ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)] grid gap-12 lg:grid-cols-12`} aria-labelledby="matters">
                <div className="lg:col-span-5">
                    <SectionHead id="matters" title="Why register matters">
                        <p className="m-0">
                            Register is not a stylistic quirk. It affects comprehension, trust and who feels included. When assistants
                            default to document-style prose, they add friction exactly where natural language matters most.
                        </p>
                    </SectionHead>
                </div>
                <Rise delay={120} className="lg:col-span-7">
                    <dl className="m-0 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                        {IMPACT.map((x) => (
                            <div key={x.title} className="flex flex-col gap-2">
                                <dt className="text-[clamp(20px,1.7vw,24px)] font-semibold tracking-[-0.02em]">{x.title}</dt>
                                <dd className="m-0 text-[17px] leading-[1.55]">{x.desc}</dd>
                            </div>
                        ))}
                    </dl>
                </Rise>
            </section>

            <section className={`${frame} pt-[clamp(96px,12vw,200px)] pb-[clamp(96px,12vw,200px)] grid gap-12 lg:grid-cols-12`} aria-labelledby="team">
                <div className="lg:col-span-6 flex flex-col gap-10">
                    <SectionHead id="team" title="Who did what">
                        <p className="m-0">
                            Next: scaling the LoRA mitigation to larger models with human ratings of naturalness, separating the effects
                            of pretraining and RLHF, and extending the framework to multilingual register.
                        </p>
                    </SectionHead>
                    <Rise delay={90}>
                        <dl className="m-0 flex flex-col gap-6">
                            <div><dt className="text-[18px] font-semibold">Oliver Krisetya</dt><dd className="m-0 text-[16px] text-muted">Lexicon construction, the FR pipeline, bias-source analysis, statistical testing</dd></div>
                            <div><dt className="text-[18px] font-semibold">Warren Nguyen</dt><dd className="m-0 text-[16px] text-muted">Data collection and preprocessing, the RoBERTa classifier, LoRA mitigation, evaluation</dd></div>
                        </dl>
                    </Rise>
                </div>
                <Rise delay={120} className="lg:col-span-6 self-end">
                    <Link to="/projects/easy-sched" className="group block rounded-2xl bg-card p-8 md:p-10 no-underline text-main hover:bg-raised transition-colors">
                        <span className="flex items-baseline justify-between gap-4 text-[clamp(26px,3vw,44px)] font-semibold tracking-[-0.03em] leading-[1.05]">
                            Next: Easy-Sched
                            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                        <span className="block mt-3 text-[16px] text-muted">An optimal TA-assignment platform with a live solver.</span>
                    </Link>
                </Rise>
            </section>
        </article>
    );
}
