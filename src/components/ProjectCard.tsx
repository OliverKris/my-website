import type { Project } from "../data/projects";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <h3 className={styles.title}>{project.title}</h3>
                <div className={styles.links}>
                    <a href={project.url} target="_blank" rel="noreferrer">{project.urlType}</a>
                    {project.liveUrl ? (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer">Live</a>
                    ) : null}
                </div>
            </header>

            <div className={styles.body}>
                <div className={styles.block}>
                    <p className={styles.text}>{project.pitch}</p>
                    </div>

                    <div className={styles.block}>
                        <div className={styles.label}>Highlights</div>
                        <ul className={styles.list}>
                            {project.highlights.map((h, i) => (
                                <li key={i} className={styles.listItem}>{h}</li>
                            ))}
                        </ul>
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
