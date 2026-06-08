import { skills } from "../data/skills";
import { SkillPill } from "../components/SkillPill";
import { experience } from "../data/experience";
import ExperienceItem from "../components/features/resume/ExperienceItem";
import { sortByLabel } from "../utils/sort";
import { EducationBlock } from "../components/features/resume/EducationBlock";
import { educationData } from "../data/education";
import { Container } from "../components/ui/Container";
import Reveal from "../components/Reveal";

export default function Resume() {
    return (
        <main className="mx-auto max-w-5xl px-6 pt-10 pb-32 space-y-12">
            {/* Header */}
            <Reveal as="header" className="flex flex-col gap-1 border-b border-layout pb-6 transition-theme">
                <h1 className="text-3xl font-bold text-main transition-theme">Resume</h1>
                <p className="text-muted transition-theme max-w-md">
                    Graduate-level work in systems programming, applied machine learning, and software tooling.
                </p>
            </Reveal>
            
            {/* Sections Container */}
            <div className="space-y-16">
            
                <Reveal className="space-y-6" delayMs={120}>
                    <div className="space-y-8 text-main">
                        <Container>
                            <EducationBlock education={educationData} ></EducationBlock>
                        </Container>
                    </div>
                </Reveal>

                {/* Experience */}
                <Reveal className="space-y-6" delayMs={240}>
                    <h2 className="text-2xl font-semibold text-main transition-theme pb-1">Experience</h2>
                    <div className="space-y-10">
                        {experience.map((e) => (
                            <ExperienceItem key={e.id} item={e} />
                        ))}
                    </div>
                </Reveal>
                
                {/* Skills */}
                <Reveal className="space-y-6" delayMs={360}>
                    <h2 className="text-2xl font-semibold text-main transition-theme pb-1">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {sortByLabel(skills).map((s) => (
                            <SkillPill key={s.label} skill={s} />
                        ))}
                    </div>
                </Reveal>

                {/* CTA */}
                <Reveal as="section" className="pt-8" delayMs={480}>
                    <a
                        className="inline-flex items-center justify-center rounded-lg border border-layout bg-card px-5 py-2.5 text-sm font-medium text-main shadow-xs transition-theme hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        href={`${import.meta.env.BASE_URL}resume.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download PDF Resume
                    </a>
                    <p className="text-[10px] text-muted mt-3">Last updated: Dec 2025</p>
                </Reveal>
            </div>
        </main>
    );
}