import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { getFeaturedProjects } from "../utils/projects";
import { FeaturedProjectCard } from "../components/FeaturedProjectCard";
import Hero from "../components/Hero";
import CurrentFocus from "../components/CurrentFocus";

export default function Home() {
    const featured = getFeaturedProjects(projects, 2);

    return (
        <div className="mx-auto max-w-5xl px-6 pb-32 space-y-20">
            <Hero />

            {/* Current Focus: Bento Grid */}
            <section id="current-focus" className="space-y-8">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-main">Current Focus</h2>
                    <p className="text-xs text-muted">Building, testing, and shipping.</p>
                </div>
                <CurrentFocus />
            </section>

            {/* Featured Highlights */}
            <section className="space-y-8">
                <div className="flex justify-between items-end border-b border-layout pb-4">
                    <h2 className="text-xl font-semibold text-main">Featured Highlights</h2>
                    <Link to="/projects" className="text-sm text-accent hover:underline">Explore all →</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featured.map((p) => <FeaturedProjectCard key={p.id} project={p} />)}
                </div>
            </section>
        </div>
    );
}