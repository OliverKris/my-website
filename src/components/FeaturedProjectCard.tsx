import { Link } from "react-router-dom";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import type { Project } from "../data/projects";

export function FeaturedProjectCard({ project }: { project: Project }) {
    return (
        <article className="group relative flex flex-col justify-between rounded-xl border border-layout bg-card p-6 transition-theme hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
            
            {/* The Accent Highlight Bar (Custom animation stays) */}
            <div className="absolute left-0 top-0 h-1.5 w-full rounded-t-xl bg-linear-to-r from-accent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <header className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold tracking-tight text-main transition-theme group-hover:text-accent">
                        {project.title}
                    </h3>

                    {/* Standardized Links using Button primitive */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" as="a" href={project.url} target="_blank" className="px-0 py-0 text-xs uppercase tracking-wider">
                            {project.urlType}
                        </Button>
                        {project.liveUrl && (
                            <Button variant="ghost" as="a" href={project.liveUrl} target="_blank" className="px-0 py-0 text-xs uppercase tracking-wider">
                                Live
                            </Button>
                        )}
                    </div>
                </div>

                <p className="text-sm leading-relaxed text-muted transition-theme">
                    {project.pitch}
                </p>
            </header>

            <footer className="mt-6 flex items-center justify-between border-t border-layout pt-4">
                {/* Reusing your Badge primitive */}
                <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 4).map((t) => (
                        <Badge key={t} category="web" className="text-[10px]! font-bold uppercase">{t}</Badge>
                    ))}
                </div>

                <Link 
                    className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-theme group-hover:translate-x-1"
                    to={`/projects`}
                >
                    Details →
                </Link>
            </footer>
        </article>
    );
}