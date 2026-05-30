import { skills } from "../data/skills";
import { SkillPill } from "../components/SkillPill";
import { experience } from "../data/experience";
import ExperienceItem from "../components/ExperienceItem";
import { sortByLabel } from "../utils/sort";
import Reveal from "../components/Reveal";

export default function Resume() {
    return (
        <section className="grid gap-5">
            <Reveal as="header" className="grid gap-2">
                <h1>Resume</h1>
                <p className="m-0 text-(--muted) max-w-[70ch]">
                    Graduate-level work in systems programming, applied machine learning, and software tooling.
                </p>
            </Reveal>

            <div className="grid gap-5">
                {/* Education */}
                <Reveal className="grid gap-5" delayMs={120}>
                    <h2>Education</h2>
                    <section aria-label="Education">
                        <article className="border border-(--border) rounded-(--radius) bg-(--surface) p-4">
                            <header className="flex justify-between items-baseline gap-4 mb-3">
                                <h3 className="m-0 text-[1.05rem] font-bold">The George Washington University</h3>
                                <span className="text-(--muted) text-[0.9rem] whitespace-nowrap">Washington, DC</span>
                            </header>

                            <div className="grid gap-[0.35rem]">
                                <div className="flex justify-between gap-4">
                                    <span className="font-bold">M.S. in Computer Science</span>
                                    <span className="text-(--muted) text-[0.9rem] whitespace-nowrap">Aug 2025 – Present</span>
                                </div>
                                <p className="m-0 text-(--muted) text-[0.9rem]"><strong className="text-(--text) font-bold">GPA:</strong> 4.0</p>
                                <p className="m-0 text-(--muted) text-[0.9rem]"><strong className="text-(--text) font-bold">Relevant Coursework:</strong> Artificial Intelligence, Machine Learning, Computer Networks</p>
                            </div>

                            <div className="grid gap-[0.35rem] mt-[0.85rem] pt-[0.85rem] border-t border-(--border)">
                                <div className="flex justify-between gap-4">
                                    <span className="font-bold">B.S. in Computer Science</span>
                                    <span className="text-(--muted) text-[0.9rem] whitespace-nowrap">Aug 2021 – May 2025</span>
                                </div>
                                <p className="m-0 text-(--muted) text-[0.9rem]"><strong className="text-(--text) font-bold">GPA:</strong> 3.57</p>
                                <p className="m-0 text-(--muted) text-[0.9rem]"><strong className="text-(--text) font-bold">Relevant Coursework:</strong> Data Structure &amp; Algorithms, Computer Architecture, Systems Programming, Software Engineering, Database &amp; Team Projects, Operating Systems, Algorithms, Advanced Operating Systems, Design &amp; Analysis of Algorithms</p>
                            </div>
                        </article>
                    </section>
                </Reveal>

                {/* Experience */}
                <Reveal className="grid gap-5" delayMs={240}>
                    <h2>Experience</h2>
                    <section className="grid gap-4" aria-label="Experience">
                        {experience.map((e) => (
                            <ExperienceItem key={e.id} item={e} />
                        ))}
                    </section>
                </Reveal>

                {/* Skills */}
                <Reveal className="grid gap-5" delayMs={360}>
                    <h2>Skills</h2>
                    <div className="flex flex-wrap gap-3">
                        {sortByLabel(skills).map((s) => (
                            <SkillPill key={s.label} skill={s} />
                        ))}
                    </div>
                </Reveal>

                {/* Download CTA */}
                <Reveal
                    as="section"
                    className="grid justify-items-start gap-2 mt-10 pt-6 border-t border-(--border)"
                    delayMs={480}
                >
                    <a
                        className="inline-flex items-center px-5 py-3 rounded-(--radius) bg-(--accent) text-white! font-extrabold no-underline! border border-(--accent) hover:bg-(--accent-hover) hover:border-(--accent-hover) hover:no-underline! transition-[background-color,border-color] duration-(--theme-dur) ease-(--theme-ease)"
                        href={`${import.meta.env.BASE_URL}resume.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download Resume (PDF)
                    </a>
                    <p className="m-0 text-[0.9rem] text-(--muted)">Last updated: Dec 2025</p>
                </Reveal>
            </div>
        </section>
    );
}
