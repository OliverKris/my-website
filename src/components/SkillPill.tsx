import type { Skill } from "../data/skills";
import { SkillIcon } from "./SkillIcon";

export function SkillPill({ skill }: { skill: Skill }) {
    const content = (
        <>
            {/* Icon wrapper with neutral tint */}
            <span className="shrink-0 text-zinc-500 transition-theme group-hover:text-main">
                <SkillIcon name={skill.icon} />
            </span>
            {/* Label text */}
            <span className="font-medium">{skill.label}</span>
        </>
    );

    const baseStyles = `
        group flex items-center gap-2 rounded-full border border-layout 
        bg-card px-3 py-1.5 text-xs text-muted transition-theme 
        hover:border-zinc-300 hover:text-main hover:shadow-sm 
        dark:hover:border-zinc-700
    `;

    return skill.href ? (
        <a className={baseStyles} href={skill.href} target="_blank" rel="noreferrer">
            {content}
        </a>
    ) : (
        <span className={baseStyles}>
            {content}
        </span>
    );
}