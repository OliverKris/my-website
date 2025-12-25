export type Project = {
    id: string;
    title: string;
    problem: string;
    built: string;
    tech: string[];
    repoUrl: string;
    liveUrl?: string;
    featured?: boolean;
    order?: number;
};

export const projects: Project[] = [
    {
        id: "bulletin-board",
        title: "TCP Bulletin Board Server",
        problem: "Needed a concurrent server to support multi-client posting and shared state.",
        built: "Implemented a TCP server with a defined command protocol and `select()`-based concurrency; added a REPL client.",
        tech: ["C", "TCP", "Sockets", "Linux"],
        repoUrl: "https://github.com/<you>/<repo>",
        featured: true,
        order: 1,
    },
    {
        id: "price-prediction",
        title: "Computer Price Prediction (PyTorch)",
        problem: "Wanted to predict computer prices from specs using modern ML baselines.",
        built: "Trained neural network regressors with engineered features and compared against linear baselines.",
        tech: ["Python", "PyTorch", "Pandas"],
        repoUrl: "https://github.com/<you>/<repo>",
        featured: true,
        order: 2,
    },
    {
        id: "portfolio",
        title: "Personal Portfolio Website",
        problem: "Needed a clean, maintainable site to present projects and resume.",
        built: "Built a Vite + React + TypeScript site with reusable components and a theme toggle.",
        tech: ["React", "TypeScript", "Vite"],
        repoUrl: "https://github.com/<you>/<repo>",
    },
];