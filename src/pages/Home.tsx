import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { projects } from "../data/projects";
import { getFeaturedProjects } from "../utils/projects";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import Reveal from "../components/Reveal";

export default function Home() {
    const featured = getFeaturedProjects(projects, 2);

    return (
        <section className={styles.page}>
            <Reveal as="header" className={styles.hero}>
                <h1 className={styles.name}>Hi, I'm Oliver</h1>
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
            </Reveal>

            <Reveal as="section" className={styles.section} threshold={0.1} delayMs={120}>
                <h2 className={styles.sectionTitle}>Current Focus</h2>
                <ul className={styles.focusList}>
                    <li>Graduate coursework and research in computer science, with emphasis on systems and applied machine learning.</li>
                    <li>Graduate Teaching Assistant for database systems and team-based software engineering courses.</li>
                    <li>Designing and maintaining production-quality tooling and applications using C, Linux, Python, and React.</li>
                </ul>
            </Reveal>

            <Reveal as="section" className={styles.section} threshold={0.2} delayMs={240}>
                <h2 className={styles.sectionTitle}>Featured Projects</h2>
                <div className={styles.featuredGrid}>
                    {featured.map((p) => (
                        <FeaturedProjectCard key={p.id} project={p} />
                    ))}
                </div>
                <div className={styles.moreLinkRow}>
                    <Link className={styles.moreLink} to="/projects">View all projects →</Link>
                </div>
            </Reveal>
        </section>
    );
}
