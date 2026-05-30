import type { Experience } from "../data/experience";
import { formatDuration } from "../utils/date";

export default function ExperienceItem({ item }: { item: Experience }) {
    const { role, org, location, start, end, tag, bullets, previousRoles } = item;

    return (
        <article className="border border-(--border) rounded-(--radius) bg-(--surface) p-4">
            <header className="grid grid-cols-[1fr_auto] gap-4 items-start max-sm:grid-cols-1">
                {/* Left: role + org */}
                <div>
                    <h4 className="m-0 text-[1.1rem] font-[650]">{role}</h4>
                    <div className="mt-1 flex items-center gap-2 text-[0.95rem] text-(--muted)">
                        <span className="font-semibold text-(--text)">{org}</span>
                        {location ? (
                            <>
                                <span aria-hidden="true" className="opacity-70">•</span>
                                <span>{location}</span>
                            </>
                        ) : null}
                    </div>
                </div>

                {/* Right: dates + tag */}
                <div className="flex items-center gap-2 justify-end flex-wrap max-sm:justify-start">
                    <span className="text-(--muted) text-[0.95rem] whitespace-nowrap">{start} – {end}</span>
                    <span className="text-(--muted) opacity-70" aria-hidden="true">•</span>
                    <span className="text-(--muted) text-[0.9rem] whitespace-nowrap">{formatDuration(start, end)}</span>
                    {tag ? (
                        <div className="ml-1 px-[0.55rem] py-[0.2rem] rounded-full border border-(--border) bg-(--page) text-[0.85rem] font-bold text-(--text) whitespace-nowrap">
                            {tag}
                        </div>
                    ) : null}
                </div>
            </header>

            <ul className="mt-3 pl-5 grid gap-[0.35rem] list-disc">
                {bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                ))}
            </ul>

            {previousRoles && previousRoles.length > 0 ? (
                <div className="mt-[0.6rem] grid gap-1 text-[0.95rem] text-(--muted)">
                    <span className="font-semibold">Previously:</span>
                    <div className="grid gap-[0.15rem]">
                        {previousRoles.map((r, i) => (
                            <div key={i} className="inline-flex flex-wrap gap-[0.4rem] items-baseline">
                                <span className="font-semibold text-(--text)">{r.role}</span>
                                <span>{r.start} – {r.end}</span>
                                <span className="text-[0.85rem]">({formatDuration(r.start, r.end)})</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </article>
    );
}
