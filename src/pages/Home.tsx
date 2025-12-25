import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { projects } from "../data/projects";
import { getFeaturedProjects } from "../utils/projects";
import ProjectCard from "../components/ProjectCard";

export default function Home() {
    const featured = getFeaturedProjects(projects, 2);

    return (
        <section className={styles.page}>
            <header className={styles.hero}>
                <h1 className={styles.name}>Oliver Krisetya</h1>
                <p className={styles.title}>Graduate Student, Computer Science — GWU</p>

                <p className={styles.summary}>
                I build systems and ML projects with an emphasis on correctness,
                performance, and reproducibility.
                </p>

                <div className={styles.ctas}>
                    <Link className={styles.primaryCta} to="/projects">View Projects</Link>
                    <a
                        className={styles.secondaryCta}
                        href={`${import.meta.env.BASE_URL}resume.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download Resume
                    </a>
                    <Link className={styles.textCta} to="/contact">Contact</Link>
                </div>
            </header>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Featured Projects</h2>
                <div className={styles.featuredGrid}>
                    {featured.map((p) => (
                        <ProjectCard key={p.id} project={p} />
                    ))}
                </div>
                <div className={styles.moreLinkRow}>
                    <Link className={styles.moreLink} to="/projects">View all projects →</Link>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Current Focus</h2>
                <ul className={styles.focusList}>
                    <li>Systems coursework and tooling: C, Linux, processes, sockets.</li>
                    <li>ML experimentation in PyTorch with feature engineering and evaluation.</li>
                    <li>Building maintainable UI with React, TypeScript, and reusable components.</li>
                </ul>
            </section>
        </section>
    );
}
