import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { getFeaturedProjects } from "../utils/projects";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import Reveal from "../components/Reveal";
import Hero from "../components/Hero";

const CURRENT_FOCUSES = [
    {
        title: "Systems & Infrastructure",
        description: "Designing and optimizing production-quality tooling and low-level data systems using C, Linux, and concurrent backend environments.",
        badge: "Low-Level"
    },
    {
        title: "Applied Machine Learning",
        description: "Researching model evaluation frameworks and fine-tuning pipelines, focusing on parameter-efficient adaptation (LoRA) and NLP register profiling.",
        badge: "AI / NLP"
    },
    {
        title: "Open Source & Scaling",
        description: "Building reliable web interfaces using React and Tailwind CSS, focusing on performance, clean interfaces, and developer tool integration.",
        badge: "Full-Stack"
    }
];

export default function Home() {
    const featured = getFeaturedProjects(projects, 2);

    return (
        <div className="mx-auto max-w-5xl px-6 pb-32 space-y-32">
            
            <Reveal as="header">
                <Hero />
            </Reveal>

            {/* 1. CURRENT FOCUS SECTION */}
            <Reveal as="section" threshold={0.1} delayMs={120} className="space-y-8">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight text-main transition-theme">
                        Current Focus
                    </h2>
                    <p className="text-xs text-muted transition-theme">
                        Areas where I am actively building, testing, and shipping code.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 text-sm leading-relaxed md:grid-cols-3">
                    {CURRENT_FOCUSES.map((focus) => (
                        <div 
                            key={focus.title} 
                            /* Synchronized card container transitions */
                            className="relative overflow-hidden rounded-xl border border-layout bg-card p-6 shadow-sm transition-theme hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-800 hover:shadow-md"
                        >
                            <span className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500 transition-theme dark:bg-zinc-800/60 dark:text-zinc-400">
                                {focus.badge}
                            </span>
                            <h3 className="mt-3 font-semibold text-main transition-theme">
                                {focus.title}
                            </h3>
                            <p className="mt-2 text-muted transition-theme">
                                {focus.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Reveal>

            {/* 2. FEATURED HIGHLIGHTS SECTION */}
            <Reveal as="section" threshold={0.2} delayMs={240} className="space-y-8">
                <div className="flex items-end justify-between border-b border-layout pb-4 transition-theme">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold tracking-tight text-main transition-theme">
                            Featured Highlights
                        </h2>
                        <p className="text-xs text-muted transition-theme">
                            Flagship architectural builds and research frameworks.
                        </p>
                    </div>
                    
                    <Link 
                        to="/projects" 
                        className="group hidden items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted transition-theme hover:text-main sm:inline-flex"
                    >
                        Explore Blueprint
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {featured.map((p) => (
                        <FeaturedProjectCard key={p.id} project={p} />
                    ))}
                </div>

                {/* Mobile-Only CTA Anchor Button */}
                <div className="mt-4 sm:hidden">
                    <Link 
                        to="/projects" 
                        className="group flex w-full items-center justify-center gap-1.5 rounded-xl border border-layout bg-card py-3.5 text-sm font-semibold text-muted shadow-sm transition-theme hover:bg-zinc-50 hover:text-main active:scale-[0.98] dark:hover:bg-zinc-900"
                    >
                        <span>View all projects</span>
                        <span className="transition-transform duration-200 group-hover:translate-x-1">
                            →
                        </span>
                    </Link>
                </div>
            </Reveal>
        </div>
    );
}