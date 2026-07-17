import { experience } from "../data/experience";
import ExperienceItem from "../components/features/resume/ExperienceItem";
import { EducationBlock } from "../components/features/resume/EducationBlock";
import { educationData } from "../data/education";
import Reveal from "../components/Reveal";
import { SkillCloud } from "../components/features/resume/SkillCloud";

export default function Resume() {
    return (
        <main className="mx-auto max-w-5xl px-6 pt-10 pb-32 space-y-12">
            <header className="flex flex-col gap-1 border-b border-layout pb-6 transition-theme">
                <h1 className="text-3xl font-bold text-main transition-theme">Resume</h1>
                <p className="text-muted transition-theme max-w-md">
                    Graduate-level work in systems programming, applied machine learning, and software tooling.
                </p>
            </header>

            <div className="space-y-16">
                <section className="space-y-6">
                    <EducationBlock education={educationData} />
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-main transition-theme pb-1">Experience</h2>
                    <div className="space-y-10">
                        {experience.map((e, i) => (
                            <ExperienceItem key={e.id} item={e} index={i} />
                        ))}
                    </div>
                </section>

                <Reveal className="space-y-6">
                    <SkillCloud />
                </Reveal>

                <section className="pt-8">
                    <a
                        className="inline-flex items-center gap-2 rounded-lg border border-layout bg-card px-5 py-2.5 text-sm font-medium text-main shadow-xs transition-theme hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        href={`${import.meta.env.BASE_URL}resume-jul-2026.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download PDF Resume
                    </a>
                    <p className="text-[10px] text-muted mt-3">Last updated: Jul 2026</p>
                </section>
            </div>
        </main>
    );
}