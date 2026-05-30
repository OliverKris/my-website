import { useNavigate } from "react-router-dom";
import type { Project } from "../data/projects";

interface Props {
    project: Project;
}

export default function ProjectCard({ project }: Props) {
    const navigate = useNavigate();
    const { title, pitch, highlights, tech, url, urlType, liveUrl, demoPath } = project;

    return (
        <article className="flex flex-col justify-between border border-(--border) rounded-[10px] overflow-hidden bg-(--surface) transition-[box-shadow,transform] duration-200 ease-out hover:border-(--border-hover) hover:[box-shadow:var(--shadow-hover)]">
            {/* Body */}
            <div className="flex flex-col gap-[0.65rem] flex-1 p-6 pb-4">
                <h2 className="m-0 text-[1rem] font-semibold leading-[1.35] text-(--text)">{title}</h2>
                <p className="m-0 text-[0.875rem] text-(--muted) leading-[1.65]">{pitch}</p>

                <ul className="mt-1 pl-[1.1rem] flex flex-col gap-[0.35rem] list-disc">
                    {highlights.map((h, i) => (
                        <li key={i} className="text-[0.8rem] text-(--muted) leading-[1.55]">{h}</li>
                    ))}
                </ul>
            </div>

            {/* Footer */}
            <footer className="flex flex-col gap-3 px-6 py-4 pt-4 border-t border-(--border)">
                {/* Tech tags */}
                <div className="flex flex-wrap gap-[0.35rem]">
                    {tech.map((t) => (
                        <span
                            key={t}
                            className="text-[0.68rem] px-[0.55rem] py-[0.2rem] rounded-full bg-(--surface-active) text-(--muted) tracking-[0.02em] font-medium"
                        >
                            {t}
                        </span>
                    ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 items-center">
                    {demoPath && (
                        <a
                            className="inline-flex items-center gap-1.25 px-[0.8rem] py-[0.38rem] text-[0.75rem] font-medium rounded-md cursor-pointer tracking-[0.02em] bg-(--accent) text-white! no-underline! border border-transparent hover:bg-(--accent-hover) transition-[background-color] duration-(--theme-dur) ease-(--theme-ease)"
                            onClick={() => navigate(demoPath)}
                        >
                            Live Demo
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </a>
                    )}

                    {liveUrl && (
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.25 px-[0.8rem] py-[0.38rem] text-[0.75rem] font-medium rounded-md tracking-[0.02em] text-(--accent)! border border-(--accent) bg-transparent hover:bg-(--accent) hover:text-white! no-underline! transition-[background-color,color] duration-100 ease-out"
                        >
                            {urlType === "Website" ? "Visit Site" : "Live"}
                            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
                                <path d="M2 9L9 2M9 2H4M9 2v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </a>
                    )}

                    <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.25 px-[0.8rem] py-[0.38rem] text-[0.75rem] font-medium rounded-md tracking-[0.02em] text-(--muted)! border border-(--border) bg-transparent hover:bg-(--surface-active) hover:text-(--text)! hover:border-(--border-hover) no-underline! transition-[background-color,color,border-color] duration-100 ease-out"
                    >
                        {urlType === "GitHub" ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                </svg>
                                GitHub
                            </>
                        ) : urlType}
                    </a>
                </div>
            </footer>
        </article>
    );
}
