import { Link } from "react-router-dom";
import type { Project } from "../data/projects";

export default function FeaturedProjectCard({ project }: { project: Project }) {
    return (
        <article 
            className="group flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50/50 
                        p-6 transition-all hover:bg-zinc-50 dark:border-zinc-900 dark:bg-zinc-950/40 
                        dark:hover:bg-zinc-950/80"
        >

            {/* Header / Main Body Area */}
            <header className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                    {/* Project Title */}
                    <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                        {project.title}
                    </h3>

                    {/* Direct Links */}
                    <div className="flex items-center gap-3 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-300 hover:underline underline-offset-4"
                        >
                            {project.urlType}
                        </a>
                        {project.liveUrl ? (
                            <>
                                <span className="text-zinc-300 dark:text-zinc-800" aria-hidden="true">|</span>
                                <a 
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-300 hover:underline underline-offset-4"
                                >
                                    Live
                                </a>
                            </>
                        ) : null}
                    </div>
                </div>

                {/* Project Brief */}
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {project.pitch}
                </p>
            </header>

            {/* Footer Stack / Badges and Routing */}
            <footer className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-900">
                
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 4).map((t) => (
                        <span 
                            key={t}
                            className="rounded-full border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 
                                    dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400"
                        >
                            {t}
                        </span>
                    ))}
                </div>

                {/* Details Callout */}
                <Link 
                    className="inline-flex items-center text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900
                                dark:text-zinc-400 dark:hover:text-zinc-200"
                    to="/projects"
                >
                    Details 
                    <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
            </footer>
        </article>
    );
}