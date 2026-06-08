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
        // sticky: stays at top while scrolling
        // border-b: subtle bottom border to separate from content
        // backdrop-blur-sm + bg-white/80: frosted glass effect — modern, clean
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">

            {/* max-w-5xl: caps the content width so it doesn't stretch on ultrawide screens */}
            {/* mx-auto: centers the container horizontally */}
            {/* px-6: horizontal padding for breathing room */}
            {/* h-16: fixed navbar height — consistent, not content-driven */}
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">

                {/* Logo / Name — font-semibold + tracking-tight for a clean wordmark feel */}
                <Link
                to="/"
                onClick={close}
                className="font-semibold tracking-tight text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400"
                >
                Oliver Krisetya
                </Link>

                {/* Desktop nav — hidden on mobile, shown as flex row on md+ */}
                <nav aria-label="Primary" className="max-md:hidden md:flex items-center gap-1">

                {/* NavLink with active styling using the callback form of className */}
                {(["projects", "resume", "contact"] as const).map((page) => (
                    <NavLink
                    key={page}
                    to={`/${page}`}
                    className={({ isActive }) =>
                        // Base: px-3 py-2 rounded-md — pill-shaped tap target
                        // isActive: slightly highlighted background to show current page
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

                {/* Theme toggle — w-9 h-9 creates a square icon button */}
                {/* rounded-md + hover state makes it feel clickable without a visible border */}
                <button
                    type="button"
                    onClick={toggle}
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    className="ml-2 flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                    <span aria-hidden="true">{theme === "dark" ? "☾" : "☀"}</span>
                </button>
                </nav>

                {/* Hamburger — only visible on mobile (md:hidden) */}
                <button
                type="button"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((v) => !v)}
                className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md transition-colors hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-800"
                >
                {/* Each bar is a span styled as a thin horizontal line */}
                {/* The open && "..." pattern rotates them into an X when menu is open */}
                <span className={`h-0.5 w-5 rounded-full bg-zinc-700 transition-transform dark:bg-zinc-300 ${open ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`h-0.5 w-5 rounded-full bg-zinc-700 transition-opacity dark:bg-zinc-300 ${open ? "opacity-0" : ""}`} />
                <span className={`h-0.5 w-5 rounded-full bg-zinc-700 transition-transform dark:bg-zinc-300 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
                </button>
            </div>

            {/* Mobile menu — slides in when open */}
            {/* overflow-hidden + max-h trick: animates open/close without JS height calculation */}
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
                </nav>
            </div>
        </header>
    );
}