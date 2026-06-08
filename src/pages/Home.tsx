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

            {/* 1. CURRENT FOCUS: Transformed into micro-gradient dashboard cards */}
            <Reveal as="section" threshold={0.1} delayMs={120} className="space-y-8">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Current Focus
                    </h2>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                        Areas where I am actively building, testing, and shipping code.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 text-sm leading-relaxed md:grid-cols-3">
                    {CURRENT_FOCUSES.map((focus) => (
                        <div 
                            key={focus.title} 
                            className="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-linear-to-b from-zinc-50 to-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-md dark:border-zinc-900 dark:from-zinc-950 dark:to-zinc-900/40 dark:hover:border-zinc-800"
                        >
                            {/* Accent badge indicating specialized category */}
                            <span className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
                                {focus.badge}
                            </span>
                            <h3 className="mt-3 font-semibold text-zinc-800 dark:text-zinc-200">
                                {focus.title}
                            </h3>
                            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                {focus.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Reveal>

            {/* 2. FEATURED PROJECTS: Transformed with interactive layouts and bold actions */}
            <Reveal as="section" threshold={0.2} delayMs={240} className="space-y-8">
                <div className="flex items-end justify-between border-b border-zinc-200 pb-4 dark:border-zinc-900">
                    <div className="space-y-1">
                        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Featured Highlights
                        </h2>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500">
                            Flagship architectural builds and research frameworks.
                        </p>
                    </div>
                    
                    <Link 
                        to="/projects" 
                        className="group hidden items-center gap-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:text-zinc-900 sm:inline-flex! dark:text-zinc-500 dark:hover:text-zinc-300"
                    >
                        Explore Blueprint
                        <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                    </Link>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {featured.map((p) => (
                        <FeaturedProjectCard key={p.id} project={p} />
                    ))}
                </div>

                {/* Mobile-Only CTA Anchor */}
                <div className="mt-4 sm:hidden">
                    <Link 
                        to="/projects" 
                        className="group flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white py-3.5 text-sm font-semibold text-zinc-600 shadow-sm transition-all duration-200 hover:bg-zinc-50 hover:text-zinc-900 active:scale-[0.98] active:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 dark:active:bg-zinc-900/50"
                    >
                        <span>View all projects</span>
                        {/* Arrow translates smoothly when the button is engaged */}
                        <span className="transition-transform duration-200 group-hover:translate-x-1 group-active:translate-x-1">
                            →
                        </span>
                    </Link>
                </div>
            </Reveal>
            
        </div>
    );
}