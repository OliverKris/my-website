import { useNavigate } from "react-router-dom";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import type { Project } from "../../../data/projects";

interface Props {
    project: Project;
}

const categoryClasses = {
    systems: "border-systems",
    ai: "border-ai",
    web: "border-web",
};

export function ProjectCard({ project }: Props) {
    const navigate = useNavigate();
    const { title, pitch, highlights, tech, links, category } = project;
    const getVariant = (label: string): "primary" | "secondary" | "ghost" => {
        const l = label.toLowerCase();
        if (l === "demo" || l === "live") return "primary";
        if (l === "github" || l === "repo") return "ghost";
        return "secondary";
    }

    return (
        <article className="flex flex-col h-full justify-between rounded-xl border border-layout bg-card p-5 shadow-sm transition-theme hover:-translate-y-1 hover:shadow-md">
            
            {/* Main Content Area */}
            <div className={`flex-1 border-l-4 ${categoryClasses[category]} pl-4`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold tracking-tight text-main pe-3">{title}</h2>
                    <Badge category={category} className={`px-4 py-1.5 text-[12px] ${category === "ai" ? "uppercase" : "capitalize"}`}>{category}</Badge>
                </div>
                
                <p className="text-xs font-medium leading-relaxed text-muted">
                    {pitch}
                </p>

                <ul className="mt-6 space-y-2 text-xs text-muted">
                    <p className="font-semibold text-main">Overview:</p>
                    {highlights.map((h, i) => (
                        <li key={i} className="list-disc ml-4">{h}</li>
                    ))}
                </ul>
            </div>

            {/* Footer using Primitives */}
            <footer className="mt-8 flex flex-col gap-4 border-t border-layout pt-4">
                <div className="flex flex-wrap gap-1.5">
                    {tech.map((t) => (
                        <Badge key={t} category={category}>{t}</Badge> // Or create a generic Badge variant
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {links.map((link) => {
                        const isInternal = link.url.startsWith("/");
                        
                        return isInternal ? (
                            <Button 
                                key={link.label} 
                                variant={getVariant(link.label)} 
                                onClick={() => navigate(link.url)}
                            >
                                {link.label}
                            </Button>
                        ) : (
                            <Button 
                                key={link.label} 
                                variant={getVariant(link.label)} 
                                as="a" 
                                href={link.url} 
                                target="_blank"
                            >
                                {link.label}
                            </Button>
                        );
                    })}
                </div>
            </footer>
        </article>
    );
}