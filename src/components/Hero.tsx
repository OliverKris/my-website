import { Link } from "react-router-dom";

export default function Hero(){
    return (
        // min-h-[calc(100vh-4rem)]: fills the viewport below the 4rem (64px) navbar
        // flex flex-col justify-center: vertically centers content in that space
        <section className="flex min-h-[calc(100vh-4rem)] flex-col justify-center px-6 pt-10 max-w-5xl mx-auto">
            
            {/* Eyebrow - green dot + status line */}
            <div className="mb-6 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span className="text-xs font-medium uppercase tracking-widest text-green-400">
                    Available for opportunities
                </span>
            </div>

            {/* Headline */}
            <h1 className="mb-3 text-5xl font-semibold tracking-tightest text-zinc-100">
                Hi, I'm Oliver
                <span className="text-zinc-600">.</span>
            </h1>

            {/* Subtitle */}
            <p className="mb-3 text-lg font-medium text-zinc-400">
                Software Engineer —{" "}
                <span className="text-zinc-200">Masters of CS @ GWU</span>
            </p>
            
            {/* Description */}
            <p className="mb-10 max-w-xl text-sm leading-relaxed text-zinc-500">
                I am a software engineer specializing in systems programming, applied machine learning, 
                and toolchain development. I focus on writing highly optimized code, designing robust data 
                models, and turning complex computational problems into elegant software solutions.
            </p>

            {/* CTA buttons */}
            <div className="mb-12 flex flex-wrap items-center gap-3">
                {/* Primary - solid, high contrast */}
                <Link 
                    to="/projects"
                    className="rounded-lg bg-zinc-200 px-5 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
                >
                    View Projects
                </Link>

                {/* Ghost - outlined */}
                <a
                    href={`${import.meta.env.BASE_URL}resume.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
                >
                    Download Resume
                </a>

                {/* Ghost */}
                <Link 
                    to="/contact"
                    className="rounded-lg border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
                >
                    Contact
                </Link>
            </div>

            {/* Stack strip - thin divider + pill badges */}
            <div className="flex flex-wrap items-center gap-3 border-t border-zinc-800 pt-6">
                <span className="text-xs font-medium uppercase tracking-widest text-zinc-600">
                    Stack
                </span>
                {["Python", "C", "React", "Linux", "ML"].map((tag) => (
                    <span
                        key={tag}
                        className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-500"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Scroll Notif */}
            <div className="w-full flex justify-center mt-12">  
                <div className="flex flex-col items-center gap-1 text-xs font-medium uppercase tracking-widest text-zinc-500">
                    <span>Scroll for more</span>
                    <span className="animate-bounce text-sm font-bold">⌄</span>
                </div>
            </div>
        </section>
    )
}