import { SkillIcon } from "./SkillIcon";
import type { Skill } from "../data/skills";

export function SkillPill({ skill, color }: { skill: Skill, color: string }) {
    const inner = (
        <a 
            href={skill.href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-md border border-layout bg-card px-2.5 py-1 text-xs font-medium text-main transition-theme hover:border-(--skill-hover) hover:text-(--skill-hover)"
            style={{ '--skill-hover': color } as React.CSSProperties}
        >
            <SkillIcon name={skill.icon} size={13} />
            {skill.label}
        </a>
    );

    if (skill.href) {
        return (
            <a href={skill.href} target="_blank" rel="noopener noreferrer">
                {inner}
            </a>
        );
    }

    return inner;
}