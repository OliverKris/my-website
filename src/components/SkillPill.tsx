import type { Skill } from "../data/skills";
import { SkillIcon } from "./SkillIcon";

const pillClass = [
    "inline-flex items-center gap-2",
    "px-[0.7rem] py-[0.45rem]",
    "border border-(--border) rounded-full",
    "bg-(--surface) text-(--text)! no-underline!",
    "font-semibold text-[0.95rem]",
    "will-change-transform",
    // single transition covers theme vars + independent transform timing
    "[transition:background-color_var(--theme-dur)_var(--theme-ease),color_var(--theme-dur)_var(--theme-ease),border-color_var(--theme-dur)_var(--theme-ease),box-shadow_var(--theme-dur)_var(--theme-ease),transform_140ms_ease]",
    "hover:bg-(--surface-hover) hover:border-(--border-hover) hover:[box-shadow:var(--shadow-hover)] hover:-translate-y-[3px]",
].join(" ");

export function SkillPill({ skill }: { skill: Skill }) {
    const content = (
        <>
            <span className="inline-flex items-center text-(--muted)" aria-hidden="true">
                <SkillIcon name={skill.icon} />
            </span>
            <span className="leading-none">{skill.label}</span>
        </>
    );

    return skill.href ? (
        <a className={pillClass} href={skill.href} target="_blank" rel="noreferrer">
            {content}
        </a>
    ) : (
        <span className={pillClass}>{content}</span>
    );
}
