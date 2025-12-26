import styles from "./Projects.module.css";
import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import Reveal from "../components/Reveal.tsx"

export default function Projects() {
    return (
        <section className={`${styles.page}`}>
            <Reveal as="header" className={styles.header}>
                <h1>Projects</h1>
                <p className={styles.subtext}>
                    Selected work across systems programming, machine learning, and tooling.
                </p>
            </Reveal>

            <Reveal className={styles.grid} delayMs={120}>
                {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
                ))}
            </Reveal>
        </section>
    );
}
