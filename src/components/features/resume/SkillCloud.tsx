import { SkillPill } from "../../SkillPill";
import { skills } from "../../../data/skills";

const categories: { key: string; label: string; colorVar: string }[] = [
    { key: "systems", label: "Systems",              colorVar: "var(--color-systems)" },
    { key: "ai",      label: "AI",                   colorVar: "var(--color-ai)" },
    { key: "web",     label: "Web",                  colorVar: "var(--color-web)" },
    { key: "misc",    label: "Misc",                 colorVar: "var(--color-muted)" },
];

export function SkillCloud() {
    return (
        <>
            <h2 className="text-2xl font-semibold text-main transition-theme pb-1">
                Technical Proficiencies
            </h2>
            <div className="space-y-5">
                {categories.map(({ key, label, colorVar }) => {
                    const filtered = skills.filter((s) => s.category === key);
                    if (!filtered.length) return null;
                    return (
                        <div key={key}>
                            <h3
                                className="text-[11px] font-semibold uppercase tracking-widest mb-2.5"
                                style={{ color: colorVar }}
                            >
                                {label}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {filtered.map((s) => (
                                    <SkillPill key={s.label} skill={s} color={colorVar} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}