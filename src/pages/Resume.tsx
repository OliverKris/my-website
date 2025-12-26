import styles from "./Resume.module.css";
import { skills } from "../data/skills";
import { SkillPill } from "../components/SkillPill";
import { experience } from "../data/experience";
import ExperienceItem from "../components/ExperienceItem";
import { sortByLabel } from "../utils/sort";
import Reveal from "../components/Reveal"

export default function Resume() {
    return (
        <section className={styles.page}>
            <Reveal as="header" className={styles.header}>
                <h1>Resume</h1>
                <p className={styles.subtext}>Graduate-level work in systems programming, applied machine learning, and software tooling.</p>
            </Reveal>
            
            <div className={styles.page}>
                <Reveal className={styles.resumeSection} delayMs={120}>
                    <h2>Education</h2>
                    <section className={styles.education} aria-label="Education">
                        <article className={styles.educationCard}>
                            <header className={styles.educationHeader}>
                                <h3 className={styles.school}>The George Washington University</h3>
                                <span className={styles.location}>Washington, DC</span>
                            </header>

                            <div className={styles.degree}>
                                <div className={styles.degreeHeader}>
                                    <span className={styles.degreeTitle}>M.S. in Computer Science</span>
                                    <span className={styles.degreeDates}>Aug 2025 – Present</span>
                                </div>
                                <div className={styles.degreeMeta}>
                                    <span className={styles.metaItem}><strong>GPA:</strong> 4.0</span>
                                </div>
                                <div className={styles.degreeMeta}>
                                    <span className={styles.metaItem}><strong>Relevant Coursework:</strong> Artificial Intelligence, Machine Learning, Computer Networks</span>
                                </div>
                            </div>

                            <div className={styles.degree}>
                                <div className={styles.degreeHeader}>
                                    <span className={styles.degreeTitle}>B.S. in Computer Science</span>
                                    <span className={styles.degreeDates}>Aug 2021 – May 2025</span>
                                </div>
                                <div className={styles.degreeMeta}>
                                    <span className={styles.metaItem}><strong>GPA:</strong> 3.57</span>
                                </div>
                                <div className={styles.degreeMeta}>
                                    <span className={styles.metaItem}><strong>Relevant Coursework:</strong> Data Structure & Algorithms, Computer Architecture, Systems Programming, Software Engineering, Database & Team Projects, Operating Systems, Algorithms, Advanced Operating Systems, Design & Analysis of Algorithms</span>
                                </div>
                            </div>
                        </article>
                    </section>
                </Reveal>

                <Reveal className={styles.resumeSection} delayMs={240}>
                    <h2>Experience</h2>
                    <section className={styles.experienceList} aria-label="Experience">
                        {experience.map((e) => (
                        <ExperienceItem key={e.id} item={e} />
                        ))}
                    </section>
                </Reveal>
                
                <Reveal className={styles.resumeSection} delayMs={360}>
                    <h2>Skills</h2>
                    <div className={styles.pills}>
                        {sortByLabel(skills).map((s) => (
                        <SkillPill key={s.label} skill={s} />
                        ))}
                    </div>
                </Reveal>

                <Reveal as="section" className={styles.cta} delayMs={480}>
                    <a
                        className={styles.ctaButton}
                        href={`${import.meta.env.BASE_URL}resume.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        Download Resume (PDF)
                    </a>
                    <p className={styles.ctaMeta}>Last updated: Dec 2025</p>
                </Reveal>
            </div>
        </section>
    );
}
