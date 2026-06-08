// components/ExperienceItem.tsx
import type { Experience } from "../../../data/experience";

export default function ExperienceItem({ item }: { item: Experience }) {
    return (
        <div className="grid md:grid-cols-[1fr_auto] gap-x-4 gap-y-2">
            {/* Main Role & Org */}
            <h3 className="font-semibold text-main">{item.role}</h3>
            <span className="text-sm text-muted font-medium whitespace-nowrap">
                {item.start} – {item.end}
            </span>
            <p className="md:col-span-2 text-sm text-main font-medium">{item.org}</p>

            {/* Bullets */}
            <ul className="md:col-span-2 space-y-2 list-disc list-inside text-xs text-muted pl-1 mb-4">
                {item.bullets.map((b, i) => (
                    <li key={i} className="leading-relaxed">{b}</li>
                ))}
            </ul>

            {/* Previous Roles (The nested timeline) */}
            {item.previousRoles && item.previousRoles.length > 0 && (
                <div className="md:col-span-2 pl-4 border-l border-layout space-y-2">
                    {item.previousRoles.map((prev, i) => (
                        <div key={i} className="flex justify-between text-xs">
                            <span className="text-muted italic">{prev.role}</span>
                            <span className="text-zinc-400 font-medium">{prev.start} – {prev.end}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}