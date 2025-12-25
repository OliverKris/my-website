import styles from "./Projects.module.css";
import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
    return (
        <section className={styles.page}>
            <header className={styles.header}>
                <h1>Projects</h1>
                <p className={styles.subtext}>
                    Selected work across systems programming, machine learning, and tooling.
                </p>
            </header>

            <div className={styles.grid}>
                {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
                ))}
            </div>
        </section>
    );
}
