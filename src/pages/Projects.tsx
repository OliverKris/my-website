import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal.tsx";

export default function Projects() {
    return (
        <section className="mx-auto max-w-5xl px-6 pb-32 space-y-12 bg-canvas">
            
            {/* Header Block */}
            <Reveal 
                as="header" 
                className="flex flex-col gap-1 border-b border-layout pb-6 transition-theme"
            >
                <h1 className="text-2xl font-bold tracking-tight text-main transition-theme md:text-3xl">
                    Projects
                </h1>
                <p className="text-sm text-muted transition-theme">
                    Selected work across systems programming, machine learning, and tooling.
                </p>
            </Reveal>

            {/* Layout Grid */}
            <Reveal 
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3" 
                delayMs={120}
            >
                {projects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                ))}
            </Reveal>
        </section>
    );
}