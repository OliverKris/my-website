import { projects } from "../data/projects";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "../components/features/projects/ProjectCard";
import Reveal from "../components/Reveal";

export default function Projects() {
    const [filter, setFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    const filteredProjects = useMemo(() => {
        return projects.filter((p) => {
            const matchesFilter = filter === "all" || p.category === filter;
            const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                                  p.pitch.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [filter, search]);

    const cardVariants = {
        initial: {
            opacity: 0,
            y: 12,
            scale: 0.98
        },
        animate: {
            opacity: 1,
            y: 0,
            scale: 1
        },
        exit: {
            opacity: 0,
            y: -12,
            scale: 0.98
        }
    };
    
    return (
        <section className="mx-auto max-w-5xl px-6 pt-10 pb-32 space-y-12">
            
            {/* Header Block */}
            <Reveal 
                as="header" 
                className="flex flex-col gap-1 border-b border-layout pb-6 transition-theme"
            >
                <h1 className="text-2xl font-bold tracking-tight text-main transition-theme md:text-3xl">
                    Projects
                </h1>
                <p className="text-muted transition-theme max-w-md">
                    Selected work across systems programming, machine learning, and tooling.
                </p>
            </Reveal>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
                <input 
                    type="text" 
                    placeholder="Search projects..."
                    className="flex-1 px-4 py-2 rounded-lg border border-layout bg-card text-sm text-main focus:outline-none focus:ring-1 focus:ring-main"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="flex gap-2">
                    {["all", "systems", "ai", "web"].map((cat) => 
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4.5 py-2 text-[13px] font-medium rounded-full ${cat === "ai" ? "uppercase" : "capitalize"} transition-theme
                                ${filter === cat ? "bg-main text-canvas" : "bg-card border border-layout text-muted hover:border-main"}`}
                        >
                            {cat}
                        </button>
                    )}
                </div>
            </div>

            {/* Layout Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 gap-6 md:grid-cols-2 items-stretch"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((p, index) => (
                            <motion.div
                                key={p.id}
                                layout
                                variants={cardVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ 
                                    duration: 0.25,
                                    delay: index * 0.05,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                            >
                                <ProjectCard project={p} key={p.id}/>
                            </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}