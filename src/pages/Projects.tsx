import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal";

export default function Projects() {
    return (
        <section className="grid gap-6">
            <Reveal as="header" className="grid gap-2">
                <h1>Projects</h1>
                <p className="m-0 text-(--muted) max-w-[70ch]">
                    Selected work across systems programming, machine learning, and tooling.
                </p>
            </Reveal>

            <Reveal
                className="grid gap-8 grid-cols-1 md:grid-cols-2"
                delayMs={120}
            >
                {projects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                ))}
            </Reveal>
        </section>
    );
}
