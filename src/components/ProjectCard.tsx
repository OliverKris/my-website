import { useNavigate } from "react-router-dom";
import type { Project } from "../data/projects";
import styles from "./ProjectCard.module.css";

interface Props {
    project: Project;
}

export default function ProjectCard({ project }: Props) {
    const navigate = useNavigate();
    const { title, pitch, highlights, tech, url, urlType, liveUrl, demoPath } = project;

    return (
        <article className={styles.card}>
            <div className={styles.body}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.pitch}>{pitch}</p>

                <ul className={styles.highlights}>
                    {highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                    ))}
                </ul>
            </div>

            <footer className={styles.footer}>
                {/* Tech tags */}
                <div className={styles.tags}>
                    {tech.map((t) => (
                        <span key={t} className={styles.tag}>{t}</span>
                    ))}
                </div>

                {/* Action buttons */}
                <div className={styles.actions}>
                    {/* Live demo — internal route, styled prominently */}
                    {demoPath && (
                        <button
                            className={`${styles.btn} ${styles.btnDemo}`}
                            onClick={() => navigate(demoPath)}
                        >
                            Live Demo
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    )}

                    {/* External live site */}
                    {liveUrl && (
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={`${styles.btn} ${styles.btnExternal}`}
                        >
                            {urlType === "Website" ? "Visit Site" : "Live"}
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
                                <path d="M2 9L9 2M9 2H4M9 2v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </a>
                    )}

                    {/* GitHub / primary URL */}
                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className={`${styles.btn} ${styles.btnGhost}`}
                    >
                        {urlType === "GitHub" ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                </svg>
                                GitHub
                            </>
                        ) : urlType}
                    </a>
                </div>
            </footer>
        </article>
    );
}