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
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm transition-theme dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">

                {/* Logo / Name */}
                <Link
                    to="/"
                    onClick={close}
                    className="font-semibold tracking-tight text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400"
                >
                    Oliver Krisetya
                </Link>

                {/* Desktop Nav */}
                <nav aria-label="Primary" className="max-md:hidden md:flex items-center gap-1">
                    {(["projects", "resume", "contact"] as const).map((page) => (
                        <NavLink
                            key={page}
                            to={`/${page}`}
                            className={({ isActive }) =>
                                `rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors ${
                                isActive
                                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                }`
                            }
                        >
                            {page}
                        </NavLink>
                    ))}

                    {/* Desktop Theme Toggle */}
                    <button
                        type="button"
                        onClick={toggle}
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        className="ml-2 flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                    >
                        <span aria-hidden="true">{theme === "dark" ? "☾" : "☀"}</span>
                    </button>
                </nav>

                {/* Hamburger Button */}
                <button
                    type="button"
                    aria-label="Open menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen((v) => !v)}
                    className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md transition-colors hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-800"
                >
                    <span className={`h-0.5 w-5 rounded-full bg-zinc-700 transition-transform dark:bg-zinc-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
                    <span className={`h-0.5 w-5 rounded-full bg-zinc-700 transition-opacity dark:bg-zinc-300 ${open ? "opacity-0" : ""}`} />
                    <span className={`h-0.5 w-5 rounded-full bg-zinc-700 transition-transform dark:bg-zinc-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
                </button>
            </div>

            {/* Mobile Menu Dropdown*/}
            <div
                id="mobile-menu"
                aria-hidden={!open}
                className={`overflow-hidden transition-all duration-300 md:hidden ${open ? "max-h-48" : "max-h-0"}`}
            >
                <nav aria-label="Mobile Primary" className="flex flex-col px-6 pb-4">
                    {(["projects", "resume", "contact"] as const).map((page) => (
                        <NavLink
                            key={page}
                            to={`/${page}`}
                            onClick={close}
                            className={({ isActive }) =>
                                `rounded-md px-3 py-2 text-sm font-medium capitalize transition-colors ${
                                isActive
                                    ? "text-zinc-900 dark:text-zinc-100"
                                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                }`
                            }
                        >
                            {page}
                        </NavLink>
                    ))}

                    <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 px-3 dark:border-zinc-900">
                        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            Switch Apperance
                        </span>
                        <button
                            type="button"
                            onClick={toggle}
                            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-all duration-200 active:scale-95 active:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:active:bg-zinc-950"
                        >
                            <span aria-hidden="true" className="text-sm">
                                {theme === "dark" ? "☾" : "☀"}
                            </span>
                        </button>
                    </div>
                </nav>
            </div>
        </header>
    );
}