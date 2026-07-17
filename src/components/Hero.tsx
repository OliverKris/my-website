import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="relative z-0 flex min-h-[calc(100vh-4rem)] flex-col justify-center px-6 pt-10 max-w-5xl mx-auto">
            
            {/* 1. Status Eyebrow */}
            <div className="mb-6 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-secondary transition-theme">
                    Available for opportunities
                </span>
            </div>

            {/* 2. Headline */}
            <h1 className="mb-4 text-5xl text-main transition-theme tracking-tight font-bold sm:text-6xl">
                Hi, I'm <span className="bg-linear-to-r from-accent via-accent to-secondary bg-clip-text text-transparent">Oliver</span>
                <span className="text-muted transition-theme ml-0.5">.</span>
            </h1>

            {/* 3. Subtitle & Body */}
            <p className="mb-4 text-base font-medium text-muted transition-theme sm:text-lg">
                Software Engineer —{" "}
                <span className="text-main transition-theme font-semibold">MS Computer Science @ GWU</span>
            </p>
            
            <p className="mb-10 max-w-xl text-sm leading-relaxed text-muted transition-theme sm:text-base">
                I am a software engineer specializing in systems programming, applied machine learning, 
                and toolchain development. I focus on writing highly optimized code, designing robust data 
                models, and turning complex computational problems into elegant software solutions.
            </p>

            {/* 4. CTA Buttons */}
            <div className="mb-12 flex flex-wrap items-center gap-3">
                <Link 
                    to="/projects"
                    className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-all hover:opacity-90 active:scale-[0.97]"
                >
                    View Projects
                </Link>

                <a
                    href={`${import.meta.env.BASE_URL}resume-jul-2026.pdf`}
                    target="_blank"
                    className="rounded-lg border border-layout bg-card px-5 py-2.5 text-sm font-medium text-main transition-all hover:border-accent/50 active:scale-[0.97]"
                >
                    Download Resume
                </a>

                <Link
                    to="/contact"
                    className="rounded-lg border border-layout bg-card px-5 py-2.5 text-sm font-medium text-main transition-all hover:border-accent/50 active:scale-[0.97]"
                >
                    Contact Me
                </Link>
            </div>

            {/* 5. Stack Strip */}
            <div className="flex flex-wrap items-center gap-3 border-t border-layout pt-6 transition-theme">
                <span className="text-xs font-medium uppercase tracking-widest text-secondary transition-theme">
                    Technical Stack
                </span>
                {["Python", "C", "React", "Linux", "ML"].map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full border border-secondary/20 bg-secondary-soft px-3 py-1 text-xs font-medium text-secondary transition-theme"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="mt-20 flex justify-center">
                {/* Down Arrow */}
                <button 
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer text-muted transition-colors hover:text-accent"
                    onClick={() => {
                        document.getElementById('current-focus')?.scrollIntoView({
                            behavior: "smooth"
                        });
                    }}
                >    
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
                    </svg>
                </button>
            </div>
        </section>
    );
}