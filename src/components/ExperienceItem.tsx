import type { Experience } from "../data/experience";
import { formatDuration } from "../utils/date";
import styles from "./ExperienceItem.module.css";

export default function ExperienceItem({ item }: { item: Experience }) {
    const { role, org, location, start, end, tag, bullets, previousRoles } = item;

    return (
        <article className={styles.item}>
            <header className={styles.header}>
                <div className={styles.left}>
                    <h4 className={styles.role}>{role}</h4>
                    <div className={styles.meta}>
                        <span className={styles.org}>{org}</span>
                        {location ? (
                        <>
                            <span className={styles.dot} aria-hidden="true">•</span>
                            <span className={styles.location}>{location}</span>
                        </>
                        ) : null}
                    </div>
                </div>

                <div className={styles.right}>
                    <div className={styles.dates}>{start} – {end}</div>
                    <div className={styles.length}>{formatDuration(start, end)}</div>
                    {tag ? <div className={styles.tag}>{tag}</div> : null}
                </div>
            </header>

        {previousRoles && previousRoles.length > 0 ? (
            <div className={styles.previousRoles}>
            <span className={styles.previousLabel}>Previously:</span>
            <div className={styles.previousList}>
                {previousRoles.map((r, i) => (
                <div key={i} className={styles.previousItem}>
                    <span className={styles.previousRole}>{r.role}</span>
                    <span className={styles.previousDates}>{r.start} – {r.end}</span>
                    <span className={styles.previousLength}>
                    ({formatDuration(r.start, r.end)})
                    </span>
                </div>
                ))}
            </div>
            </div>
        ) : null}

        <ul className={styles.bullets}>
            {bullets.map((b, i) => (
            <li key={i}>{b}</li>
            ))}
        </ul>
        </article>
    );
}
