import styles from "./Projects.module.css";
import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";
import { useInView } from "../hooks/useInView.ts"

export default function Projects() {
    const {ref: focusRef, inView: focusInView } = useInView<HTMLDivElement>({ threshold: 0.2 });

    return (
        <section className={`${styles.page}`}>
            <header className={styles.header}>
                <h1>Projects</h1>
                <p className={styles.subtext}>
                    Selected work across systems programming, machine learning, and tooling.
                </p>
            </header>

            <div 
                ref={focusRef}
                className={` ${styles.grid} reveal ${focusInView ? "revealVisible":""}`}
            >
                {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
                ))}
            </div>
        </section>
    );
}
