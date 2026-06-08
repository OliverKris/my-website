import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { theme, toggle } = useTheme();
    const close = () => setOpen(false);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 768px)");
        const handler = () => { if (mq.matches) setOpen(false); };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return (
        // The Header wrapper now stays completely fixed at h-16
        <header className="sticky top-0 z-50 h-16 w-full border-b border-layout bg-canvas/80 backdrop-blur-md transition-theme">
            <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-6">

                {/* Logo / Personal Branding */}
                <Link
                    to="/"
                    onClick={close}
                    className="font-semibold tracking-tight text-main transition-theme hover:text-muted"
                >
                    Oliver Krisetya
                </Link>

                {/* Desktop Layout Navigation Tree */}
                <nav aria-label="Primary" className="max-md:hidden md:flex items-center gap-1">
                    {(["projects", "resume", "contact"] as const).map((page) => (
                        <NavLink
                            key={page}
                            to={`/${page}`}
                            className={({ isActive }) =>
                                `rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-theme ${
                                isActive
                                    ? "bg-zinc-100 text-main dark:bg-zinc-800/60"
                                    : "text-muted hover:bg-zinc-100/60 hover:text-main dark:hover:bg-zinc-800/40"
                                }`
                            }
                        >
                            {page}
                        </NavLink>
                    ))}

                    {/* Desktop Mode Toggle Button */}
                    <button
                        type="button"
                        onClick={toggle}
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        className="ml-2 flex h-9 w-9 items-center justify-center rounded-md text-muted transition-theme hover:bg-zinc-100 hover:text-main dark:hover:bg-zinc-800/60 cursor-pointer"
                    >
                        <span aria-hidden="true" className="text-sm select-none">
                            {theme === "dark" ? "☾" : "☀"}
                        </span>
                    </button>
                </nav>

                {/* Mobile Framework Hamburger Button */}
                <button
                    type="button"
                    aria-label="Open menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen((v) => !v)}
                    className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md transition-theme hover:bg-zinc-100/80 md:hidden dark:hover:bg-zinc-800/60 cursor-pointer"
                >
                    <span className={`h-0.5 w-5 rounded-full bg-zinc-700 transition-transform duration-200 dark:bg-zinc-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
                    <span className={`h-0.5 w-5 rounded-full bg-zinc-700 transition-opacity duration-200 dark:bg-zinc-300 ${open ? "opacity-0" : ""}`} />
                    <span className={`h-0.5 w-5 rounded-full bg-zinc-700 transition-transform duration-200 dark:bg-zinc-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
                </button>
            </div>

            {/* Mobile Navigation */}
            <div
                id="mobile-menu"
                aria-hidden={!open}
                className={`absolute top-16 left-0 w-full overflow-hidden border-b border-layout bg-canvas/95 backdrop-blur-lg transition-all duration-300 ease-in-out md:hidden ${
                    open ? "max-h-60 opacity-100 shadow-lg" : "max-h-0 opacity-0 pointer-events-none"
                }`}
            >
                <nav aria-label="Mobile Primary" className="flex flex-col px-6 py-4 space-y-0.5">
                    {(["projects", "resume", "contact"] as const).map((page) => (
                        <NavLink
                            key={page}
                            to={`/${page}`}
                            onClick={close}
                            className={({ isActive }) =>
                                `rounded-md px-3 py-2 text-sm font-medium capitalize transition-theme ${
                                isActive
                                    ? "text-main bg-zinc-100/50 dark:bg-zinc-800/30"
                                    : "text-muted hover:text-main hover:bg-zinc-100/30 dark:hover:bg-zinc-800/20"
                                }`
                            }
                        >
                            {page}
                        </NavLink>
                    ))}

                    {/* Secondary Mobile Theme Controller Block */}
                    <div className="mt-4 flex items-center justify-between border-t border-layout pt-4 px-3 transition-theme">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted transition-theme">
                            Switch Appearance
                        </span>
                        <button
                            type="button"
                            onClick={toggle}
                            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-layout bg-card text-main shadow-xs transition-all duration-200 active:scale-95 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                        >
                            <span aria-hidden="true" className="text-sm select-none">
                                {theme === "dark" ? "☾" : "☀"}
                            </span>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}