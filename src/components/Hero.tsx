import { Link } from "react-router-dom";

export default function Hero() {
    return (
        // min-h-[calc(100vh-4rem)]: fills the viewport below the 4rem (64px) navbar
        // flex flex-col justify-center: vertically centers content in that space
        <section className="flex min-h-[calc(100vh-4rem)] flex-col justify-center px-6 pt-10 max-w-5xl mx-auto">
            
            {/* Eyebrow - green dot + status line */}
            <div className="mb-6 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium uppercase tracking-widest text-emerald-600 dark:text-emerald-400 transition-theme">
                    Available for opportunities
                </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl text-main transition-theme tracking-tight font-bold sm:text-5xl">
                Hi, I'm Oliver
                <span className="text-zinc-400 dark:text-zinc-600 transition-theme">.</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-4 text-base font-medium text-muted transition-theme sm:text-lg">
                Software Engineer —{" "}
                <span className="text-zinc-400 dark:text-zinc-500 transition-theme">Masters of CS @ GWU</span>
            </p>
            
            {/* Description */}
            <p className="mb-10 max-w-xl text-sm leading-relaxed text-muted transition-theme sm:text-base">
                I am a software engineer specializing in systems programming, applied machine learning, 
                and toolchain development. I focus on writing highly optimized code, designing robust data 
                models, and turning complex computational problems into elegant software solutions.
            </p>

            {/* CTA buttons */}
            <div className="mb-12 flex flex-wrap items-center gap-3">
                {/* Primary - solid, high contrast action button */}
                <Link 
                    to="/projects"
                    className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white shadow-xs transition-all duration-200 hover:bg-zinc-800 active:scale-[0.97] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                    View Projects
                </Link>

                {/* Ghost - Outlined Resume link */}
                <a
                    href={`${import.meta.env.BASE_URL}resume.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-layout px-5 py-2.5 text-sm font-medium text-main transition-all duration-200 hover:bg-zinc-100/50 active:scale-[0.97] dark:hover:bg-zinc-900/50"
                >
                    Download Resume
                </a>

                {/* Ghost - Outlined Contact link */}
                <Link 
                    to="/contact"
                    className="rounded-lg border border-layout px-5 py-2.5 text-sm font-medium text-main transition-all duration-200 hover:bg-zinc-100/50 active:scale-[0.97] dark:hover:bg-zinc-900/50"
                >
                    Contact
                </Link>
            </div>

            {/* Stack strip - thin semantic divider + updated design pills */}
            <div className="flex flex-wrap items-center gap-3 border-t border-layout pt-6 transition-theme">
                <span className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600 transition-theme">
                    Stack
                </span>
                {["Python", "C", "React", "Linux", "ML"].map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 transition-theme dark:border-zinc-800/80 dark:bg-zinc-900/50 dark:text-zinc-400"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Scroll Notification */}
            <div className="w-full flex justify-center mt-12">  
                <div className="flex flex-col items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-600 transition-theme">
                    <span>Scroll for more</span>
                    <span className="animate-bounce text-sm font-bold">⌄</span>
                </div>
            </div>
        </section>
    );
}