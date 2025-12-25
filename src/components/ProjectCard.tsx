import type { Project } from "../data/projects";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <h3 className={styles.title}>{project.title}</h3>
                <div className={styles.links}>
                    <a href={project.repoUrl} target="_blank" rel="noreferrer">GitHub</a>
                    {project.liveUrl ? (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer">Live</a>
                    ) : null}
                </div>
            </header>

            <div className={styles.body}>
                <div className={styles.block}>
                    <div className={styles.label}>Problem</div>
                        <p className={styles.text}>{project.problem}</p>
                    </div>

                    <div className={styles.block}>
                        <div className={styles.label}>What I built</div>
                        <p className={styles.text}>{project.built}</p>
                    </div>

                    <div className={styles.techRow}>
                    {project.tech.map((t) => (
                        <span key={t} className={styles.techTag}>{t}</span>
                    ))}
                </div>
            </div>
        </article>
    );
}
