import { Link } from "react-router-dom";
import type { Project } from "../data/projects";

export default function FeaturedProjectCard({ project }: { project: Project }) {
    return (
        <article className="
            grid gap-3
            bg-(--surface) border border-(--border) rounded-(--radius)
            p-4 [box-shadow:var(--shadow-sm)]
            translate-y-0
            [transition:background-color_var(--theme-dur)_var(--theme-ease),border-color_var(--theme-dur)_var(--theme-ease),box-shadow_var(--theme-dur)_var(--theme-ease),transform_180ms_ease]
            hover:border-(--border-hover) hover:[box-shadow:var(--shadow-hover)]
        ">
            {/* Header */}
            <header className="grid gap-[0.35rem]">
                <div className="flex items-baseline justify-between gap-3">
                    <h3 className="m-0 text-[1.05rem] font-extrabold tracking-[-0.01em] text-(--text)">
                        {project.title}
                    </h3>
                    <div className="flex items-center gap-[0.65rem] shrink-0">
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-(--muted)! text-sm font-bold no-underline! hover:text-(--accent)! transition-colors duration-160"
                        >
                            {project.urlType}
                        </a>
                        {project.liveUrl ? (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-(--muted)! text-sm font-bold no-underline! hover:text-(--accent)! transition-colors duration-160"
                            >
                                Live
                            </a>
                        ) : null}
                    </div>
                </div>

                <p className="m-0 text-(--muted) text-sm leading-[1.45]">
                    {project.pitch}
                </p>
            </header>

            {/* Footer */}
            <footer className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-[0.4rem]">
                    {project.tech.slice(0, 4).map((t) => (
                        <span
                            key={t}
                            className="text-xs font-extrabold text-(--muted) bg-(--surface-active) border border-(--border) rounded-full px-2 py-1 transition-colors duration-(--theme-dur)"
                        >
                            {t}
                        </span>
                    ))}
                </div>

                <Link
                    to="/projects"
                    className="text-(--accent) font-extrabold text-sm no-underline hover:underline shrink-0"
                >
                    Details →
                </Link>
            </footer>
        </article>
    );
}
