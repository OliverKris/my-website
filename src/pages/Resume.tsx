import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { experience } from "../data/experience";
import { educationData } from "../data/education";
import { skills, type Skill } from "../data/skills";
import { projects } from "../data/projects";
import { frame, Rise } from "../components/site/Rise";
import { RESUME_PDF } from "../components/site/Nav";

const AREAS: { key: "all" | Skill["category"]; label: string }[] = [
    { key: "all", label: "Everything" },
    { key: "systems", label: "Systems" },
    { key: "ai", label: "Machine learning" },
    { key: "web", label: "Web and data" },
    { key: "misc", label: "Tools" },
];

/** Words a project's tech list may use for a skill, so "Python" finds projects that list "Python 3". */
const ALIASES: Record<string, string[]> = {
    "C": ["c"],
    "SQL": ["sql", "sqlite", "postgresql", "mysql", "sqlalchemy"],
    "Tailwind": ["tailwind", "tailwind css"],
    "Linux": ["linux", "unix", "posix"],
};

function projectsUsing(label: string) {
    const keys = ALIASES[label] ?? [label.toLowerCase()];
    return projects.filter((p) =>
        p.tech.some((t) => {
            const tech = t.toLowerCase();
            return keys.some((k) => (k.length <= 2 ? tech === k || tech.startsWith(`${k} `) || tech.startsWith(`${k}(`) : tech.includes(k)));
        }),
    );
}

const clean = (s: string) => s.replace(/\s{2,}/g, " ").trim();
const year = (d: string) => d.slice(-4);

/** Pick a skill, see where it was used. */
function SkillExplorer() {
    const [area, setArea] = useState<(typeof AREAS)[number]["key"]>("all");
    const [picked, setPicked] = useState<string>("Python");
    const shown = skills.filter((s) => area === "all" || s.category === area);
    const used = useMemo(() => projectsUsing(picked), [picked]);

    return (
        <div className="grid gap-10 lg:grid-cols-12 items-start" data-ui>
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter skills by area">
                    {AREAS.map((a) => (
                        <button key={a.key} type="button" aria-pressed={area === a.key} onClick={() => setArea(a.key)}
                            className={`h-10 px-4 rounded-full text-[15px] cursor-pointer transition-colors ${area === a.key ? "bg-main text-canvas" : "text-muted hover:text-main"}`}>
                            {a.label}
                        </button>
                    ))}
                </div>
                <ul className="list-none m-0 p-0 flex flex-wrap gap-2" aria-label="Skills">
                    {shown.map((s) => {
                        const count = projectsUsing(s.label).length;
                        const on = picked === s.label;
                        return (
                            <li key={s.label} className="fade-up">
                                <button type="button" aria-pressed={on} onClick={() => setPicked(s.label)}
                                    className={`h-11 px-4 rounded-full text-[16px] cursor-pointer inline-flex items-center gap-2 transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${
                                        on ? "bg-accent text-accent-ink" : "bg-card text-main hover:bg-raised"}`}>
                                    {s.label}
                                    {count > 0 && <span className={`text-[13px] tabular-nums ${on ? "opacity-80" : "text-muted"}`}>{count}</span>}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-card p-6 md:p-8 flex flex-col gap-5 lg:sticky lg:top-28" aria-live="polite">
                <h3 key={picked} className="m-0 fade-up text-[clamp(28px,2.8vw,40px)] font-semibold tracking-[-0.03em] leading-[1.05]">{picked}</h3>
                {used.length ? (
                    <>
                        <p className="m-0 text-[16px] text-muted">Used in {used.length} {used.length === 1 ? "project" : "projects"}:</p>
                        <ul className="list-none m-0 p-0 flex flex-col gap-2">
                            {used.map((p) => (
                                <li key={p.id} className="fade-up">
                                    <Link to={p.caseStudy?.path ?? `/projects#${p.id}`}
                                        className="group flex items-baseline justify-between gap-4 rounded-xl bg-canvas px-4 py-3.5 text-main no-underline hover:bg-raised transition-colors">
                                        <span className="flex flex-col gap-0.5">
                                            <span className="text-[17px] font-medium">{p.short ?? p.title}</span>
                                            <span className="text-[14px] text-muted line-clamp-1">{p.pitch}</span>
                                        </span>
                                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : (
                    <p className="m-0 text-[16px] leading-[1.55]">Used in coursework and teaching rather than a project on this site.</p>
                )}
            </div>
        </div>
    );
}

export default function Resume() {
    const ta = experience.find((e) => e.id === "gwu-ta")!;
    const club = experience.find((e) => e.id === "esports-club")!;
    const teaching = [...(ta.previousRoles ?? [])].reverse().concat([{ role: ta.role, start: ta.start, end: ta.end }]);
    const [degree, setDegree] = useState(educationData[educationData.length - 1].id);
    const edu = educationData.find((e) => e.id === degree)!;

    return (
        <div className="pb-[clamp(96px,12vw,200px)]">
            {/* ---------- Title ---------- */}
            <header className={`${frame} pt-16 md:pt-24 grid gap-10 lg:grid-cols-12 items-end`}>
                <div className="lg:col-span-8">
                    <h1 className="m-0 font-semibold text-[length:var(--text-display)] leading-[0.92] tracking-[-0.05em]">
                        <span className="mask-line"><span>Résumé</span></span>
                    </h1>
                    <p className="mt-8 mb-0 text-[length:var(--text-lead)] leading-[1.35] tracking-[-0.01em] max-w-[40ch] fade-up" style={{ ["--fade-delay" as string]: "250ms" }}>
                        Software engineer with a B.S. and M.S. in Computer Science from George Washington University. Systems,
                        machine learning and full-stack products, and three years as a teaching assistant.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 fade-up" style={{ ["--fade-delay" as string]: "350ms" }}>
                        <a href={RESUME_PDF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-accent text-accent-ink text-[16px] font-medium no-underline transition-transform hover:scale-[1.03] active:scale-[0.98]">
                            Download the PDF <span aria-hidden="true">↓</span>
                        </a>
                        <Link to="/contact" className="inline-flex items-center h-12 px-5 rounded-full bg-card text-main text-[16px] no-underline hover:bg-raised transition-colors">
                            Get in touch
                        </Link>
                    </div>
                </div>
                <dl className="lg:col-span-4 m-0 grid grid-cols-2 gap-x-6 gap-y-6 fade-up" style={{ ["--fade-delay" as string]: "450ms" }}>
                    {[
                        { k: "M.S. GPA", v: "3.93" },
                        { k: "Honours", v: "Summa cum laude" },
                        { k: "Graduated", v: "May 2026" },
                        { k: "Based in", v: "New York and DC" },
                    ].map((f) => (
                        <div key={f.k} className="flex flex-col-reverse gap-1">
                            <dt className="text-[14px] text-muted">{f.k}</dt>
                            <dd className="m-0 text-[clamp(18px,1.6vw,24px)] font-semibold tracking-[-0.02em]">{f.v}</dd>
                        </div>
                    ))}
                </dl>
            </header>

            {/* ---------- Skills ---------- */}
            <section className={`${frame} pt-[clamp(80px,10vw,160px)]`} aria-labelledby="skills">
                <Rise as="header" className="flex flex-col gap-4 max-w-[60ch] mb-10">
                    <h2 id="skills" className="m-0 text-[clamp(36px,4.4vw,68px)] font-semibold leading-[1] tracking-[-0.04em]">Pick a skill, see the work</h2>
                    <p className="m-0 text-[length:var(--text-body)] leading-[1.6]">Every skill links to the projects on this site that use it.</p>
                </Rise>
                <Rise delay={90}><SkillExplorer /></Rise>
            </section>

            {/* ---------- Teaching ---------- */}
            <section className="mt-[clamp(96px,12vw,200px)] bg-card py-[clamp(72px,9vw,140px)]" aria-labelledby="teaching">
                <div className={`${frame} grid gap-12 lg:grid-cols-12`}>
                    <Rise as="header" className="lg:col-span-5 flex flex-col gap-5">
                        <h2 id="teaching" className="m-0 text-[clamp(36px,4.4vw,68px)] font-semibold leading-[1] tracking-[-0.04em]">Teaching at GWU</h2>
                        <p className="m-0 text-[length:var(--text-body)] leading-[1.6]">From learning assistant to graduate TA, {year(teaching[0].start)} to {year(ta.end)}.</p>
                    </Rise>
                    <Rise delay={90} className="lg:col-span-7 flex flex-col gap-10">
                        <ol className="list-none m-0 p-0 grid grid-cols-3 gap-3" aria-label="Roles in order">
                            {teaching.map((r, i) => (
                                <li key={r.role} className="flex flex-col gap-3">
                                    <span className="h-2 rounded-full bg-accent" style={{ opacity: 0.4 + i * 0.3 }} aria-hidden="true" />
                                    <span className="text-[clamp(16px,1.4vw,19px)] font-semibold leading-tight">{r.role}</span>
                                    <span className="text-[14px] text-muted tabular-nums">{year(r.start)}–{year(r.end)}</span>
                                </li>
                            ))}
                        </ol>
                        <ul className="m-0 pl-5 flex flex-col gap-3 text-[17px] leading-[1.6]">
                            {ta.bullets.map((b) => <li key={b}>{clean(b)}</li>)}
                        </ul>
                    </Rise>
                </div>
            </section>

            {/* ---------- Leadership ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)] grid gap-12 lg:grid-cols-12`} aria-labelledby="leadership">
                <Rise as="header" className="lg:col-span-5 flex flex-col gap-5">
                    <h2 id="leadership" className="m-0 text-[clamp(36px,4.4vw,68px)] font-semibold leading-[1] tracking-[-0.04em]">Leading GW Esports</h2>
                    <ul className="list-none m-0 p-0 flex flex-col gap-2.5 text-[16px]">
                        {[{ role: club.role, start: club.start, end: club.end }, ...(club.previousRoles ?? [])].map((r) => (
                            <li key={r.role} className="flex justify-between gap-6 max-w-[26rem]">
                                <span className={r.role === club.role ? "font-semibold" : ""}>{r.role}</span>
                                <span className="text-muted tabular-nums">{year(r.start)}–{year(r.end)}</span>
                            </li>
                        ))}
                    </ul>
                </Rise>
                <Rise delay={90} className="lg:col-span-7">
                    <ul className="m-0 pl-5 flex flex-col gap-3 text-[17px] leading-[1.6]">
                        {club.bullets.map((b) => <li key={b}>{clean(b)}</li>)}
                    </ul>
                </Rise>
            </section>

            {/* ---------- Education ---------- */}
            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="education">
                <Rise as="header" className="flex flex-wrap items-end justify-between gap-6 mb-10">
                    <h2 id="education" className="m-0 text-[clamp(36px,4.4vw,68px)] font-semibold leading-[1] tracking-[-0.04em]">Education</h2>
                    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Degrees">
                        {educationData.map((e) => (
                            <button key={e.id} type="button" role="tab" aria-selected={degree === e.id} onClick={() => setDegree(e.id)}
                                className={`h-11 px-4 rounded-full text-[15px] cursor-pointer transition-colors ${degree === e.id ? "bg-main text-canvas" : "bg-card text-main hover:bg-raised"}`}>
                                {e.degree.replace(" in Computer Science", "")}, {e.year.replace(" - ", "–")}
                            </button>
                        ))}
                    </div>
                </Rise>
                <Rise delay={90}>
                    <div key={edu.id} role="tabpanel" className="fade-up grid gap-10 lg:grid-cols-12">
                        <div className="lg:col-span-5 flex flex-col gap-3">
                            <h3 className="m-0 text-[clamp(26px,2.6vw,36px)] font-semibold tracking-[-0.03em] leading-[1.1]">{edu.degree}</h3>
                            <p className="m-0 text-[17px]">{edu.school}</p>
                            {edu.description && <p className="m-0 text-[16px] text-muted">{edu.description}</p>}
                        </div>
                        <div className="lg:col-span-7 grid gap-10 sm:grid-cols-2">
                            <div className="flex flex-col gap-3">
                                <h4 className="m-0 text-[15px] font-semibold">Coursework</h4>
                                <ul className="list-none m-0 p-0 flex flex-wrap gap-2">
                                    {edu.coursework?.map((c) => <li key={c} className="px-3 py-1.5 rounded-full bg-card text-[15px]">{c}</li>)}
                                </ul>
                            </div>
                            <div className="flex flex-col gap-3">
                                <h4 className="m-0 text-[15px] font-semibold">Highlights</h4>
                                <ul className="m-0 pl-5 flex flex-col gap-2 text-[16px] leading-[1.5]">
                                    {edu.highlights?.map((h) => <li key={h}>{h.replace(" — ", ": ")}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </Rise>
            </section>

            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="pdf">
                <Rise className="rounded-2xl bg-accent text-accent-ink p-8 md:p-12 flex flex-wrap items-end justify-between gap-8">
                    <div className="flex flex-col gap-3 max-w-[40ch]">
                        <h2 id="pdf" className="m-0 text-[clamp(32px,3.6vw,56px)] font-semibold leading-[1] tracking-[-0.04em]">The one-page version</h2>
                        <p className="m-0 text-[17px]">Everything above on a single page, for applications and printing. Updated July 2026.</p>
                    </div>
                    <a href={RESUME_PDF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-accent-ink text-accent text-[16px] font-semibold no-underline transition-transform hover:scale-[1.03] active:scale-[0.98]">
                        Download the PDF <span aria-hidden="true">↓</span>
                    </a>
                </Rise>
            </section>
        </div>
    );
}
