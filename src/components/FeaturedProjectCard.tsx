import { Link } from "react-router-dom";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import type { Project } from "../data/projects";

export function FeaturedProjectCard({ project }: { project: Project }) {
    return (
        <article className="group relative flex flex-col justify-between rounded-xl border border-layout bg-card p-6 transition-theme hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
            
            <div className="absolute left-0 top-0 h-1.5 w-full rounded-t-xl bg-linear-to-r from-accent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <header className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-bold tracking-tight text-main transition-theme group-hover:text-accent">
                        {project.title}
                    </h3>

                    {/* Multi-link Header Implementation */}
                    <div className="flex items-center gap-2">
                        {project.links
                            .filter((link) => link.label.toLowerCase() === "github")
                            .map((link) => (
                                <Button 
                                    key={link.label}
                                    variant="ghost" 
                                    as="a" 
                                    href={link.url} 
                                    target="_blank"
                                    className="px-0 py-0 text-[12px] uppercase tracking-wider"
                                >
                                    {link.label}
                                </Button>
                            ))}
                    </div>
                </div>

                <p className="text-sm leading-relaxed text-muted transition-theme">
                    {project.pitch}
                </p>
            </header>

            <footer className="mt-6 flex items-center justify-between border-t border-layout pt-4">
                <div className="flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 3).map((t) => (
                        <Badge key={t} category={project.category} className="text-[10px]! font-bold uppercase">
                            {t}
                        </Badge>
                    ))}
                </div>

                
                <Link 
                    className="inline-flex items-center gap-1 text-sm whitespace-nowrap font-semibold text-accent transition-theme group-hover:translate-x-1"
                    to={"/projects"}
                >
                    Details →
                </Link>
                
            </footer>
        </article>
    );
}