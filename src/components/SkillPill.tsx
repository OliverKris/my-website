import type { Skill } from "../data/skills";
import { SkillIcon } from "./SkillIcon";
import styles from "./SkillPill.module.css";

export function SkillPill({ skill }: { skill: Skill }) {
    const content = (
        <>
            <span className={styles.icon} aria-hidden="true">
                <SkillIcon name={skill.icon} />
            </span>
            <span className={styles.label}>{skill.label}</span>
        </>
    );

    return skill.href ? (
        <a className={styles.pill} href={skill.href} target="_blank" rel="noreferrer">
        {content}
        </a>
    ) : (
        <span className={styles.pill}>{content}</span>
    );
}
