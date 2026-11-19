import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { frame } from "./Rise";

export interface CaseSection { id: string; label: string }

/**
 * Sits under the main nav on a case study: where you are (Work → this case
 * study), the sections of the page with the current one highlighted, the next
 * case study, and a reading-progress line along its bottom edge.
 */
export function CaseStudyBar({ title, sections, next }: {
    title: string;
    sections: CaseSection[];
    next: { to: string; label: string };
}) {
    const [active, setActive] = useState(sections[0]?.id);
    const [progress, setProgress] = useState(0);
    const listRef = useRef<HTMLUListElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    // Jump so the heading lands just below both bars. The main nav shrinks once the page
    // scrolls (to 64px from 640px up), so aim for its scrolled height, not its current one.
    const jump = (id: string) => (e: React.MouseEvent) => {
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        const target = () => {
            const nav = document.querySelector("header")?.getBoundingClientRect().height ?? 64;
            const navScrolled = window.innerWidth >= 640 ? 64 : nav;
            const bar = barRef.current?.getBoundingClientRect().height ?? 56;
            return el.getBoundingClientRect().top + window.scrollY - navScrolled - bar - 24;
        };
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: target(), behavior: reduce ? "auto" : "smooth" });
        // The nav shrinks during the scroll, which moves everything below it; once the
        // scroll settles, nudge to the exact spot.
        let done = false;
        const settle = () => {
            if (done) return;
            done = true;
            const t = target();
            if (Math.abs(t - window.scrollY) > 3) window.scrollTo({ top: t, behavior: "auto" });
        };
        window.addEventListener("scrollend", settle, { once: true });
        window.setTimeout(settle, 1200);
        history.replaceState(null, "", `#${id}`);
    };

    useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
            // The current section is the last one whose heading has passed 35% of the screen.
            const line = window.innerHeight * 0.35;
            let current = sections[0]?.id;
            for (const s of sections) {
                const el = document.getElementById(s.id);
                if (el && el.getBoundingClientRect().top <= line) current = s.id;
            }
            setActive(current);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [sections]);

    // Keep the highlighted section visible in the sideways-scrolling list on small screens.
    useEffect(() => {
        const list = listRef.current;
        const item = list?.querySelector<HTMLElement>(`[data-id="${active}"]`);
        if (list && item && list.scrollWidth > list.clientWidth) {
            const offset = item.getBoundingClientRect().left - list.getBoundingClientRect().left;
            list.scrollTo({ left: list.scrollLeft + offset - list.clientWidth / 2 + item.clientWidth / 2, behavior: "smooth" });
        }
    }, [active]);

    return (
        <div ref={barRef} className="sticky z-40 bg-canvas border-b border-layout" style={{ top: "var(--nav-h, 64px)" }} data-ui>
            <div className={`${frame} flex items-center gap-x-6 h-14`}>
                <nav aria-label="Breadcrumb" className="flex-none">
                    <ol className="list-none m-0 p-0 flex items-center gap-2 text-[15px]">
                        <li><Link to="/projects" className="text-muted no-underline hover:text-main transition-colors">Work</Link></li>
                        <li aria-hidden="true" className="text-muted">/</li>
                        <li aria-current="page" className="font-semibold whitespace-nowrap">{title}</li>
                    </ol>
                </nav>

                <ul ref={listRef} aria-label="Sections" className="list-none m-0 p-0 flex-1 min-w-0 flex items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {sections.map((s) => {
                        const on = active === s.id;
                        return (
                            <li key={s.id} data-id={s.id} className="flex-none">
                                <a
                                    href={`#${s.id}`}
                                    onClick={jump(s.id)}
                                    aria-current={on ? "location" : undefined}
                                    className={`inline-flex items-center h-9 px-3 rounded-full text-[14px] no-underline whitespace-nowrap transition-colors ${
                                        on ? "bg-main text-canvas" : "text-muted hover:text-main hover:bg-card"}`}
                                >
                                    {s.label}
                                </a>
                            </li>
                        );
                    })}
                </ul>

                <Link to={next.to} className="hidden lg:inline-flex flex-none items-center gap-2 text-[15px] text-main no-underline hover:text-accent transition-colors group">
                    <span className="text-muted">Next:</span> {next.label}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
            </div>
            <span
                aria-hidden="true"
                className="absolute left-0 bottom-[-1px] h-0.5 bg-accent origin-left"
                style={{ width: "100%", transform: `scaleX(${progress})` }}
            />
        </div>
    );
}
