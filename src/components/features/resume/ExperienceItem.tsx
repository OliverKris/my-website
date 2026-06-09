import type { Experience } from "../../../data/experience";

const itemColorVars = [
    { border: "border-[var(--color-accent)]",    bg: "var(--color-accent)",    arrow: "text-[var(--color-accent)]" },
    { border: "border-[var(--color-secondary)]", bg: "var(--color-secondary)", arrow: "text-[var(--color-secondary)]" },
    { border: "border-[var(--color-tertiary)]",  bg: "var(--color-tertiary)",  arrow: "text-[var(--color-tertiary)]" },
];

interface Props {
    item: Experience;
    index: number; // pass this from the parent map
}

export default function ExperienceItem({ item, index }: Props) {
    const color = itemColorVars[index % itemColorVars.length];

    return (
        <div className={`relative pl-6 border-l-2 ${color.border}`}>
            {/* Timeline dot */}
            <div
                className="absolute -left-1.25 top-2.25 h-2 w-2 rounded-full"
                style={{ background: color.bg }}
                aria-hidden="true"
            />

            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                    <h3 className="font-medium text-main text-lg">{item.role}</h3>
                    <p className="text-md text-muted mt-0.5">
                        {item.org}{item.location ? ` · ${item.location}` : ""}
                    </p>
                </div>
                <span className="text-[12px] font-mono text-muted whitespace-nowrap mt-1">
                    {item.start} – {item.end}
                </span>
            </div>

            {/* Previous roles */}
            {item.previousRoles && item.previousRoles.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {item.previousRoles.map((r) => (
                        <span
                            key={r.role}
                            className="text-[11px] px-2.5 py-1 rounded-lg border border-layout bg-card text-muted"
                        >
                            <span className="font-bold text-main">↳  {r.role}</span>
                            <span className="text-muted"> · {r.start}–{r.end}</span> 
                        </span>
                    ))}
                </div>
            )}

            {/* Bullets */}
            <ul className="space-y-1.5 text-sm text-muted">
                {item.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 leading-relaxed">
                        <span className={`shrink-0 ${color.arrow}`} aria-hidden="true">▹</span>
                        <span>{b}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}