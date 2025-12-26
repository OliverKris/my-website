export type Project = {
    id: string;
    title: string;
    pitch: string;
    highlights: string[];
    tech: string[];
    url: string;
    urlType: string;
    liveUrl?: string;
    featured?: boolean;
    order?: number;
};

export const projects: Project[] = [
    {
        id: "bulletin-board",
        title: "TCP Bulletin Board Server",
        pitch: "A concurrent TCP bulletin board server that maintains shared state across multiple clients, supporting authenticated posting, listing, and retrieval of messages through a custom request/response protocol.",
        highlights: [
            "Implemented a concurrent TCP server using select() for I/O multiplexing and shared state consistency",
            "Designed and documented a structured request/response protocol with robust validation for malformed inputs",
            "Built a CLI client and automated test harness to verify correctness under concurrent usage"
        ],
        tech: ["Python", "TCP", "Sockets"],
        url: "https://github.com/OliverKris/bulletinboard-project",
        urlType: "GitHub",
        featured: true,
        order: 1,
    },
    {
        id: "price-prediction",
        title: "Computer Price Prediction (PyTorch)",
        pitch: "A machine learning project that predicts computer prices from hardware specifications using engineered features and neural network models, evaluated against classical regression baselines.",
        highlights: [
            "Performed feature engineering on hardware specifications, including tier-based scores and display metrics (pixels, PPI)",
            "Trained and tuned neural network models in PyTorch and compared performance against linear regression baselines",
            "Evaluated models using MSE and R² while analyzing training vs. validation loss to diagnose overfitting"
        ],
        tech: ["Python", "PyTorch", "Pandas"],
        url: "https://github.com/OliverKris/computer-price-prediction",
        urlType: "GitHub",
        featured: true,
        order: 2,
    },
    {
        id: "portfolio",
        title: "Personal Portfolio Website",
        pitch: "A responsive, data-driven personal portfolio website designed to showcase projects, skills, and experience with a modular component architecture and theme support.",
        highlights: [
            "Designed a modular React architecture with reusable UI components and a consistent design system",
            "Implemented light/dark theming with persisted user preference and accessible color variables",
            "Structured projects and skills as data-driven content for easy iteration and maintainability"
        ],
        tech: ["React", "TypeScript", "Vite"],
        url: "https://github.com/OliverKris/my-website",
        urlType: "GitHub"
    },
    {
        id: "easysched",
        title: "Easy Sched",
        pitch: "An algorithm-assisted scheduling tool designed for a GWU 2025 CS capstone project.",
        highlights: [
            "Designed a scoring-based assignment algorithm to match TAs and LAs to courses based on availability, preferences, and staffing requirements",
            "Built an admin-facing interface to filter courses, time slots, and required staff for efficient semester planning",
            "Structured scheduling logic to balance coverage constraints while minimizing conflicts and manual intervention",
            "Focused on maintainability and transparency to support iterative tuning by department administrators"
        ],
        tech: ["Django", "TypeScript", "Python"],
        url: "https://gw-cs-sd-24-25.github.io/sd-cow/",
        urlType: "Website",
    },
];