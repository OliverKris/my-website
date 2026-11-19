import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { frame } from "./Rise";

const LINKS = [
    { to: "/projects", label: "Work" },
    { to: "/resume", label: "Résumé" },
    { to: "/contact", label: "Contact" },
];

export const RESUME_PDF = "/resume-jul-2026.pdf";

/** Wordmark at the left margin, links on the page's 42% axis, one action at the right. */
export default function Nav() {
    const { theme, toggle } = useTheme();
    const { pathname } = useLocation();
    // The menu belongs to the page it was opened on, so navigating closes it.
    const [openOn, setOpenOn] = useState<string | null>(null);
    const open = openOn === pathname;

    return (
        <header className="relative z-40">
            <div className={`${frame} flex items-center h-20 md:h-24`}>
                <Link to="/" className="text-[17px] font-semibold tracking-[-0.01em] text-main no-underline hover:text-accent transition-colors">
                    Oliver Krisetya
                </Link>

                <nav aria-label="Primary" className="hidden md:flex items-center gap-8 absolute left-[42%]">
                    {LINKS.map((l) => (
                        <NavLink
                            key={l.to}
                            to={l.to}
                            className={({ isActive }) =>
                                `text-[15px] no-underline transition-colors ${isActive ? "text-main font-medium" : "text-muted hover:text-main"}`
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
                        className="hidden sm:inline-flex items-center h-11 px-5 rounded-full bg-accent text-accent-ink text-[15px] font-medium no-underline transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
                    >
                        Résumé PDF
                    </a>
                    <button
                        type="button"
                        className="md:hidden h-11 px-3 text-[15px] font-medium text-main cursor-pointer"
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        onClick={() => setOpenOn(open ? null : pathname)}
                    >
                        {open ? "Close" : "Menu"}
                    </button>
                </div>
            </div>

            {open && (
                <nav id="mobile-nav" aria-label="Mobile" className={`${frame} md:hidden pb-6 flex flex-col gap-1 fade-up`}>
                    {LINKS.map((l) => (
                        <NavLink key={l.to} to={l.to} className="py-3 text-[28px] font-semibold tracking-[-0.02em] text-main no-underline">
                            {l.label}
                        </NavLink>
                    ))}
                    <a href={RESUME_PDF} target="_blank" rel="noopener noreferrer" className="py-3 text-[28px] font-semibold tracking-[-0.02em] text-accent no-underline">
                        Résumé PDF
                    </a>
                </nav>
            )}
        </header>
    );
}
