import { Link } from "react-router-dom";
import type { Project } from "../data/projects";
import styles from "./FeaturedProjectCard.module.css";

export default function FeaturedProjectCard({ project }: { project: Project }) {
    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <div className={styles.titleRow}>
                    <h3 className={styles.title}>{project.title}</h3>
                    <div className={styles.links}>
                        <a href={project.url} target="_blank" rel="noopener noreferrer">
                            {project.urlType}
                        </a>
                        {project.liveUrl ? (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            Live
                        </a>
                        ) : null}
                    </div>
                </div>

                <p className={styles.pitch}>{project.pitch}</p>
            </header>

            <footer className={styles.footer}>
                <div className={styles.techRow}>
                    {project.tech.slice(0, 4).map((t) => (
                        <span key={t} className={styles.techTag}>
                            {t}
                        </span>
                    ))}
                </div>

                <Link className={styles.more} to="/projects">
                    Details →
                </Link>
            </footer>
        </article>
    );
}
