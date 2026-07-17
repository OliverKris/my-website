export type ProjectLink = {
    label: string;
    url: string;
}

export type Project = {
    id: string;
    title: string;
    pitch: string;
    highlights: string[];
    tech: string[];
    links: ProjectLink[];
    featured?: boolean;
    order?: number;
    category: 'systems' | 'ai' | 'web';
};

export const projects: Project[] = [
    {
        id: "shell-project",
        category: "systems",
        title: "Custom Unix Shell (LSH)",
        pitch: "A Unix command-line shell written from scratch in C, implementing the classic read-parse-execute loop with process forking, built-in commands, and a rolling command history.",
        highlights: [
            "Implemented the shell's core read/tokenize/execute loop, including manual dynamic buffer growth to support arbitrarily long input lines",
            "Used fork() and execvp() to launch external programs as child processes, with proper wait/status handling in the parent process",
            "Built out shell built-ins (cd, help, exit, history) with a fixed-size rolling history buffer for recently entered commands",
            "Managed all memory manually in C, including buffer reallocation and cleanup, with no external dependencies beyond the C standard library"
        ],
        tech: ["C", "Unix", "POSIX", "Process Management", "Systems Programming", "Bash", "Memory Management"],
        links: [
            { label: "GitHub", url: "https://github.com/OliverKris/shell-project" }
        ],
    },
    {
        id: "bulletin-board",
        category: "systems",
        title: "TCP Bulletin Board Server",
        pitch: "A concurrent, multi-client network bulletin board service implemented from scratch using TCP sockets, featuring a custom protocol, select()-based I/O multiplexing, and server-side authentication.",
        highlights: [
            "Designed a custom text-based protocol with newline-terminated commands and count-framed multi-line responses for deterministic parsing",
            "Implemented a single-threaded event loop using select() to safely manage concurrent client sessions without requiring explicit locks",
            "Engineered a robust server-side security model enforcing role-based authorization (User/Admin) and authenticated post management",
            "Added defensive input handling, including partial TCP send buffering, malformed input rejection, and anti-memory-exhaustion line length limits"
        ],
        tech: ["Python", "TCP", "Sockets", "Concurrency", "Systems Programming", "Networking", "Event Loops"],
        links: [
            { label: "GitHub", url: "https://github.com/OliverKris/bulletinboard-project" }
        ],
    },
    {
        id: "price-prediction",
        category: "ai",
        title: "Computer Price Prediction",
        pitch: "A machine learning project for CSCI 6364 that explores predicting consumer computer prices using feedforward neural networks. The study emphasizes feature engineering and compares model performance against classical linear regression baselines.",
        highlights: [
            "Engineered domain-specific features including pixel density (PPI), component tier scores, and storage/RAM configurations to capture non-linear price drivers",
            "Designed and compared two neural architectures: a 4-layer ReLU-based model and a 7-layer Leaky-ReLU model utilizing stochastic gradient descent",
            "Conducted rigorous error analysis revealing model performance bottlenecks on high-end hardware due to data distribution imbalances",
            "Collaborated on feature selection and memory-constrained training strategies to optimize performance within Google Colab environments"
        ],
        tech: ["Python", "PyTorch", "scikit-learn", "Pandas", "NumPy", "Matplotlib", "Data Engineering", "Machine Learning"],
        links: [
            { label: "GitHub", url: "https://github.com/OliverKris/computer-price-prediction" }
        ],
    },
    {
        id: "formality-bias-nlu",
        category: "ai",
        title: "Formality Bias in Large Language Models",
        pitch: "A natural language understanding research project investigating whether large language models systematically favor overly formal language compared to human conversational corpora, using both lexicon-based and neural formality metrics.",
        highlights: [
            "Designed a dual-metric framework combining a custom Formality Rate (FR) lexicon pipeline with a fine-tuned RoBERTa register classifier to measure stylistic bias in LLM outputs",
            "Analyzed conversational responses across GPT, LLaMA, Claude, Mistral, Vicuna, and LMSYS-Chat datasets to identify cross-family formality bias patterns",
            "Built preprocessing and corpus analysis pipelines for large-scale conversational datasets including Reddit, ELI5, BlendedSkillTalk, and LMSYS-Chat-1M",
            "Implemented statistical evaluation workflows using Mann-Whitney U, Kruskal-Wallis, and paired t-tests to validate observed register differences",
            "Explored LoRA-based mitigation on Qwen2.5-3B-Instruct to reduce formal-register tendencies while preserving fluency and response coherence"
        ],
        tech: [
            "Python", "PyTorch", "Transformers", "RoBERTa", "LoRA", "Hugging Face", "Pandas", "NLU", "NLP", "Statistical Analysis"
        ],
        links : [
            { label: "Website", url: "/projects/formality" },
            { label: "GitHub", url: "https://github.com/OliverKris/formal-language-bias-llms" },
        ],
        featured: true,
        order: 1,
    },
    {
        id: "easysched-reworked",
        category: "web",
        title: "EasySched — TA/LA Scheduling Engine",
        pitch: "A full-stack scheduling app that automatically assigns university Learning Assistants and TAs to course sections using a from-scratch constraint-satisfaction solver, with admin overrides for the edge cases.",
        highlights: [
            "Modeled section staffing as a Constraint Satisfaction Problem and implemented a backtracking solver from scratch, using MRV variable ordering and best-first branch-and-bound to keep the search fast",
            "Separated hard eligibility constraints (GPA floors, scheduling conflicts) from soft fit-scoring behind a pluggable scoring interface",
            "Built a REST API in FastAPI with SQLAlchemy/SQLite persistence and Pydantic validation",
            "Built a typed React + TypeScript frontend with a drag-and-drop assignment board (@dnd-kit) that stays in sync with backend state",
            "Designed isolated, independently-seeded 'workspaces' per dataset and added admin lock/block overrides"
        ],
        tech: ["Python", "FastAPI", "SQLAlchemy", "Pydantic", "React", "TypeScript", "Tailwind CSS", "pytest", "REST API", "Constraint Programming"],
        links : [
            { label: "Original Capstone", url: "https://gw-cs-sd-24-25.github.io/sd-cow/" },
            { label: "GitHub", url: "https://github.com/OliverKris/easy-sched-reworked" },
        ],
        featured: true,
        order: 2,
    },
    {
        id: "portfolio",
        category: "web",
        title: "Personal Portfolio Website",
        pitch: "A responsive, data-driven personal portfolio website designed to showcase projects, skills, and experience with a modular component architecture and theme support.",
        highlights: [
            "Designed a modular React architecture with reusable UI components and a consistent design system",
            "Implemented light/dark theming with persisted user preference and accessible color variables",
            "Structured projects and skills as data-driven content for easy iteration and maintainability"
        ],
        tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "Responsive Design"],
        links : [
            { label: "GitHub", url: "https://github.com/OliverKris/my-website" }
        ],
    },
    {
        id: "java-architecture-sim",
        category: "systems",
        title: "Java Computer Architecture Simulator",
        pitch: "A Java-based simulator for a custom 16-bit instruction-set computer, featuring an assembler, multi-stage CPU cycle simulation, and a GUI operator's console.",
        highlights: [
            "Developed a full instruction-cycle simulator including registers, memory, and a FIFO-based unified cache",
            "Implemented an assembler that translates symbolic assembly into 16-bit octal machine code with label/address resolution",
            "Built a GUI operator's console with single-step, run, and halt controls to manage machine state and execution",
            "Delivered four progressive project segments, including demonstration programs for complex tasks like closest-number searching and text parsing"
        ],
        tech: ["Java", "Swing", "Computer Architecture", "Systems Programming", "Assembler Design", "GUI Development"],
        links: [
            { label: "GitHub", url: "https://github.com/OliverKris/csci-6461-project" }
        ],
    },
    {
        id: "ttr-ai",
        category: "ai",
        title: "Ticket to Ride AI",
        pitch: "A stochastic, partially observable decision-making agent for the game 'Ticket to Ride,' utilizing Monte Carlo Tree Search (MCTS) to navigate massive branching factors and uncertain game states.",
        highlights: [
            "Implemented a Monte Carlo Tree Search (MCTS) agent to approximate optimal moves in a partially observable stochastic environment",
            "Designed a custom reward function balancing current score, destination ticket completion, and long-term path progression",
            "Modeled game mechanics including card drawing, route claiming, and state transitions to support recursive simulation",
            "Engineered the simulation to handle hidden opponent information by sampling valid game states during rollout"
        ],
        tech: ["Python", "AI", "MCTS", "Game Theory", "Stochastic Modeling", "Algorithmic Design"],
        links: [
            { label: "GitHub", url: "https://github.com/OliverKris/ttr-ai-project" }
        ],
    },
];