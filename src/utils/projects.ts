import type { Project } from "../data/projects";

export function getFeaturedProjects(all: Project[], limit = 2): Project[] {
    return all
        .filter((p) => p.featured)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
        .slice(0, limit);
}