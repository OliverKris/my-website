import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { frame } from "./Rise";

const LINKS = [
    { to: "/projects", label: "Work" },
    { to: "/resume", label: "Résumé" },
    { to: "/contact", label: "Contact" },
];

export const RESUME_PDF = "/resume-jul-2026.pdf";

/**
 * Wordmark, the three links, and the actions. The links are always rendered:
 * on wide screens they sit on the page's 42% axis, on narrower ones next to
 * the wordmark, and on phones they wrap to a second row. Nothing hides them.
 */
export default function Nav() {
    const { theme, toggle } = useTheme();

    // Pinned to the top; once the page scrolls it gets shorter and takes a tone step.
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 transition-[background-color] duration-300 ${scrolled ? "bg-card" : "bg-canvas"}`}>
            <div className={`${frame} relative flex flex-wrap items-center gap-x-6 py-3 sm:py-0 transition-[height] duration-300 ${scrolled ? "sm:h-16" : "sm:h-20 md:h-24"}`}>
                <Link to="/" className="text-[17px] font-semibold tracking-[-0.01em] text-main no-underline hover:text-accent transition-colors">
                    Oliver Krisetya
                </Link>

                <nav
                    aria-label="Primary"
                    className="order-3 w-full sm:order-none sm:w-auto flex items-center gap-6 lg:gap-8 pt-1 sm:pt-0 sm:ml-4 md:ml-8 lg:ml-0 lg:absolute lg:left-[42%]"
                >
                    {LINKS.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                                `py-2 text-[15px] no-underline transition-colors ${isActive ? "text-main font-semibold" : "text-main/70 hover:text-main"}`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    <button
                        type="button"
                        onClick={toggle}
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
                        className="h-11 w-11 inline-flex items-center justify-center rounded-full text-muted hover:text-main hover:bg-card transition-colors cursor-pointer"
                    >
                        {theme === "dark" ? (
                            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="8" cy="8" r="3" /><path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" strokeLinecap="round" /></svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7Z" strokeLinejoin="round" /></svg>
                        )}
                    </button>
                    <a
                        href={RESUME_PDF}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center whitespace-nowrap h-11 px-4 md:px-5 rounded-full bg-accent text-accent-ink text-[15px] font-medium no-underline transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
                    >
                        Résumé PDF
                    </a>
                </div>
            </div>
        </header>
    );
}
