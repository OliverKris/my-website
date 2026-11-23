import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { projects, type Project } from "../data/projects";
import { frame, Rise } from "../components/site/Rise";
import { LoopVideo, ThemedImg } from "../components/site/Media";

/* Two supporting pictures under each case study's main picture or film: the project's key scenes. */
const EXTRA: Record<string, { src: string; alt: string }[]> = {
    "easysched-reworked": [
        { src: "/media/easy-sched/board-{theme}.webp", alt: "The assignments board: every section's slots filled by the solver, with the reasons panel open" },
        { src: "/media/easy-sched/rules-{theme}.webp", alt: "Department rules: GPA floors and the weights that decide what makes a good fit" },
    ],
    "formality-bias-nlu": [
        { src: "/media/formality/dist-{theme}.webp", alt: "Distribution of RoBERTa P(formal): human corpora pile up near 0, LLM replies near 1" },
        { src: "/media/formality/family-{theme}.webp", alt: "Mean P(formal) by model family: every family above the ELI5 human baseline" },
    ],
    "sengoku-jidai": [
        { src: "/media/sengoku/main-menu.webp", alt: "The title screen: Sengoku Jidai, The Age of Warring States, over a woodblock print of Mount Fuji and cherry blossoms" },
        { src: "/media/sengoku/chapter-2.webp", alt: "Chapter 2, the largest map: blue holds seven of seventeen cities while red armies march down four roads" },
    ],
};

const CATEGORY: Record<Project["category"], string> = { systems: "Systems", ai: "Machine learning", web: "Full-stack", game: "Games" };

function isInternal(url: string) {
    return url.startsWith("/");
}

function ProjectLink({ url, label, strong = false }: { url: string; label: string; strong?: boolean }) {
    const look = strong
        ? "inline-flex items-center h-11 px-5 rounded-full bg-main text-canvas text-[15px] font-medium no-underline transition-transform hover:scale-[1.03] active:scale-[0.98]"
        : "inline-flex items-center h-11 px-4 rounded-full bg-canvas text-main text-[15px] no-underline hover:bg-raised transition-colors";
    return isInternal(url)
        ? <Link to={url} className={look}>{label}</Link>
        : <a href={url} target="_blank" rel="noopener noreferrer" className={look}>{label}</a>;
}

/** One project as a row that opens to its details. */
function ProjectRow({ project, open, onToggle }: { project: Project; open: boolean; onToggle: () => void }) {
    const panelId = `${project.id}-details`;
    return (
        <li id={project.id} className={`rounded-2xl transition-colors scroll-mt-24 ${open ? "bg-card" : "hover:bg-card/60"}`}>
            <h3 className="m-0">
                <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={onToggle}
                    className="w-full grid grid-cols-[1fr_auto] md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_170px] gap-x-8 gap-y-2 items-baseline text-left px-5 md:px-6 py-6 cursor-pointer"
                >
                    <span className="text-[clamp(22px,2vw,30px)] font-semibold tracking-[-0.02em] leading-[1.15]">{project.short ?? project.title}</span>
                    <span className="hidden md:block text-[16px] leading-[1.5] line-clamp-2">{project.pitch}</span>
                    <span className="flex items-center justify-end gap-4 text-[15px] text-muted">
                        <span className="hidden sm:inline">{CATEGORY[project.category]}</span>
                        <span aria-hidden="true" className={`inline-block text-[22px] leading-none text-main transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
                    </span>
                </button>
            </h3>
            <div
                id={panelId}
                className={`grid transition-[grid-template-rows,visibility] duration-400 ease-out ${open ? "grid-rows-[1fr] visible" : "grid-rows-[0fr] invisible"}`}
            >
                <div className="overflow-hidden">
                    <div className="px-5 md:px-6 pb-8 grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_170px] md:gap-x-8">
                        <div className="flex flex-col gap-5">
                            <p className="m-0 text-[17px] leading-[1.6] md:hidden">{project.pitch}</p>
                            <p className="m-0 text-[15px] text-muted">{project.tech.join(", ")}</p>
                            <div className="flex flex-wrap gap-2">
                                {project.links.map((l, i) => <ProjectLink key={l.url} url={l.url} label={l.label} strong={i === 0} />)}
                            </div>
                        </div>
                        <ul className="m-0 pl-5 flex flex-col gap-2.5 text-[16px] leading-[1.55]">
                            {project.highlights.map((h) => <li key={h}>{h}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    );
}

export default function Projects() {
    const { hash } = useLocation();
    const cases = projects.filter((p) => p.caseStudy).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    const rest = projects.filter((p) => !p.caseStudy);
    const [open, setOpen] = useState<string | null>(hash ? hash.slice(1) : null);
    // Arriving with #project-id opens that row.
    const [seenHash, setSeenHash] = useState(hash);
    if (hash !== seenHash) {
        setSeenHash(hash);
        if (hash) setOpen(hash.slice(1));
    }
    useEffect(() => {
        if (!hash) return;
        requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }, [hash]);

    return (
        <div className="pb-[clamp(96px,12vw,200px)]">
            <header className={`${frame} pt-16 md:pt-24 grid gap-8 lg:grid-cols-12 items-end`}>
                <h1 className="lg:col-span-7 m-0 font-semibold text-[length:var(--text-display)] leading-[0.92] tracking-[-0.05em]">
                    <span className="mask-line"><span>Work</span></span>
                </h1>
                <p className="lg:col-span-5 m-0 text-[length:var(--text-lead)] leading-[1.35] tracking-[-0.01em] fade-up" style={{ ["--fade-delay" as string]: "250ms" }}>
                    Three case studies told in full, and {rest.length} more projects in systems, machine learning and the web.
                </p>
            </header>

            {/* ---------- Case studies: one large picture each, alternating sides ---------- */}
            <section className={`${frame} pt-[clamp(72px,9vw,140px)] flex flex-col gap-[clamp(72px,9vw,140px)]`} aria-label="Case studies">
                {cases.map((p, i) => {
                    const cs = p.caseStudy!;
                    return (
                        <article key={p.id} className="grid gap-10 lg:grid-cols-12 items-center">
                            <Rise as="figure" className={`m-0 lg:col-span-7 grid grid-cols-2 gap-4 ${i % 2 ? "lg:order-2" : ""}`}>
                                <Link to={cs.path} className="group col-span-2 block rounded-2xl border border-layout bg-raised p-1.5 md:p-2" aria-label={`${p.short} case study`} data-ui><span className="block rounded-xl overflow-hidden bg-card">
                                    {cs.video ? (
                                        <LoopVideo src={cs.video.src} poster={cs.video.poster} label={cs.video.label} start={cs.video.start} />
                                    ) : (
                                        <ThemedImg src={cs.cover.src} alt={cs.cover.alt} width={cs.cover.width} height={cs.cover.height} eager={i === 0}
                                            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
                                    )}
                                </span></Link>
                                {(EXTRA[p.id] ?? []).map((x) => (
                                    <div key={x.src} data-ui className="rounded-xl border border-layout bg-raised p-1 aspect-[16/10]"><div className="rounded-lg overflow-hidden bg-card h-full">
                                        <ThemedImg src={x.src} alt={x.alt} width={800} height={500} className="h-full! object-cover object-center" />
                                    </div></div>
                                ))}
                            </Rise>
                            <Rise delay={90} className={`lg:col-span-5 flex flex-col gap-6 ${i % 2 ? "lg:order-1" : ""}`}>
                                <h2 className="m-0 text-[clamp(36px,4.2vw,64px)] font-semibold leading-[1] tracking-[-0.04em]">{p.short}</h2>
                                <p className="m-0 text-[length:var(--text-body)] leading-[1.6]">{cs.summary}</p>
                                <dl className="m-0 grid grid-cols-3 gap-4">
                                    {cs.facts.map((f) => (
                                        <div key={f.label} className="flex flex-col-reverse gap-1">
                                            <dt className="text-[14px] text-muted">{f.label}</dt>
                                            <dd className="m-0 text-[clamp(18px,1.6vw,24px)] font-semibold tracking-[-0.02em]">{f.value}</dd>
                                        </div>
                                    ))}
                                </dl>
                                <div className="flex flex-wrap gap-2">
                                    <Link to={cs.path} className="inline-flex items-center h-12 px-6 rounded-full bg-accent text-accent-ink text-[16px] font-medium no-underline transition-transform hover:scale-[1.03] active:scale-[0.98]">
                                        Read the case study
                                    </Link>
                                    {p.links.filter((l) => !isInternal(l.url)).slice(0, 2).map((l) => (
                                        <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center h-12 px-5 rounded-full bg-card text-main text-[16px] no-underline hover:bg-raised transition-colors">
                                            {l.label}
                                        </a>
                                    ))}
                                </div>
                            </Rise>
                        </article>
                    );
                })}
            </section>

            {/* ---------- Everything else, as rows that open ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="more">
                <Rise as="header" className="flex flex-wrap items-end justify-between gap-6 mb-8">
                    <h2 id="more" className="m-0 text-[clamp(36px,4.4vw,68px)] font-semibold leading-[1] tracking-[-0.04em]">More projects</h2>
                    <p className="m-0 text-[15px] text-muted">Open a row for what I built, the stack and the code.</p>
                </Rise>
                <Rise delay={90}>
                    <ul className="list-none m-0 p-0 flex flex-col gap-1">
                        {rest.map((p) => (
                            <ProjectRow key={p.id} project={p} open={open === p.id} onToggle={() => setOpen((o) => (o === p.id ? null : p.id))} />
                        ))}
                    </ul>
                </Rise>
            </section>
        </div>
    );
}
