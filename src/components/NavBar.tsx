import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

const DESKTOP_MQ = "(min-width: 600px)";

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
        const mq = window.matchMedia(DESKTOP_MQ);
        const handler = () => { if (mq.matches) setOpen(false); };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const linkBase = "no-underline! transition-colors duration-(--theme-dur) ease-(--theme-ease)";
    const navLink = `${linkBase} text-(--muted) hover:text-(--text)!`;
    const navLinkActive = `${linkBase} text-(--text)!`;

    return (
        <header className="sticky top-0 z-50 bg-(--page) border-b border-(--border) transition-[background-color,border-color] duration-(--theme-dur) ease-(--theme-ease)">
            <div className="max-w-(--maxw) mx-auto px-4 py-[0.85rem] flex items-center justify-between gap-4">

                {/* Brand */}
                <Link
                    to="/"
                    onClick={close}
                    className="relative py-[0.2em] font-extrabold tracking-[-0.01em] text-(--text)! no-underline! whitespace-nowrap overflow-hidden group"
                >
                    Oliver Krisetya
                    <span
                        aria-hidden="true"
                        className="absolute left-0 bottom-0 w-full h-0.5 bg-(--accent) translate-x-0 group-hover:translate-x-0 group-focus-visible:translate-x-0 transition-transform duration-300 ease-out"
                    />
                </Link>

                {/* Desktop nav — only rendered above 600px via max-width media query on hamburger */}
                <nav className="max-[599px]:hidden! flex items-center gap-5" aria-label="Primary">
                    <NavLink className={({ isActive }) => isActive ? navLinkActive : navLink} to="/projects">Projects</NavLink>
                    <NavLink className={({ isActive }) => isActive ? navLinkActive : navLink} to="/resume">Resume</NavLink>
                    <NavLink className={({ isActive }) => isActive ? navLinkActive : navLink} to="/contact">Contact</NavLink>

                    <button
                        type="button"
                        onClick={toggle}
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        className="grid place-items-center w-10 h-10 rounded-full bg-(--surface) border border-(--border) text-(--text) cursor-pointer transition-[background-color,border-color,box-shadow] duration-(--theme-dur) ease-(--theme-ease) hover:bg-(--surface-hover) hover:border-(--border-hover) hover:[box-shadow:var(--shadow-sm)] active:[box-shadow:var(--shadow-active)] focus-visible:outline-none focus-visible:[box-shadow:var(--ring)]"
                    >
                        <span aria-hidden="true" className="text-[0.95rem]">
                            {theme === "dark" ? "☾" : "☀"}
                        </span>
                    </button>
                </nav>

                {/* Hamburger — only visible below 600px */}
                <button
                    className="min-[600px]:hidden! flex items-center justify-center border border-(--border) bg-(--surface) rounded-full p-[0.6rem_0.7rem] text-(--text) cursor-pointer transition-[background-color,border-color] duration-(--theme-dur) ease-(--theme-ease) hover:bg-(--surface-hover) active:scale-[0.98] focus-visible:outline-none focus-visible:[box-shadow:var(--ring)]"
                    type="button"
                    aria-label="Open menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen((v) => !v)}
                >
                    <span className="w-5 h-4 grid gap-[0.22rem]" aria-hidden="true">
                        <span className="h-0.5 w-full bg-(--text) rounded-full" />
                        <span className="h-0.5 w-full bg-(--text) rounded-full" />
                        <span className="h-0.5 w-full bg-(--text) rounded-full" />
                    </span>
                </button>
            </div>

            {/* Mobile dropdown */}
            <div
                id="mobile-menu"
                aria-hidden={!open}
                className={[
                    "overflow-hidden translate-y-0",
                    "[transition:max-height_260ms_ease,opacity_200ms_ease,transform_200ms_ease]",
                    open ? "max-h-80 opacity-100" : "max-h-0 opacity-0 -translate-y-1.5",
                ].join(" ")}
            >
                <nav className="max-w-(--maxw) mx-auto px-4 pb-4 pt-2 flex flex-col gap-2" aria-label="Mobile Primary">
                    {(["projects", "resume", "contact"] as const).map((path) => (
                        <NavLink
                            key={path}
                            onClick={close}
                            to={`/${path}`}
                            className={({ isActive }) => [
                                "translate-y-0 bg-(--surface) border rounded-[14px] px-4 py-[0.85rem] no-underline! text-(--text)!",
                                "[transition:background-color_var(--theme-dur)_var(--theme-ease),border-color_var(--theme-dur)_var(--theme-ease),transform_160ms_ease]",
                                isActive
                                    ? "border-(--border-hover) [box-shadow:var(--shadow-sm)]"
                                    : "border-(--border) hover:bg-(--surface-hover) hover:-translate-y-px",
                            ].join(" ")}
                        >
                            {path.charAt(0).toUpperCase() + path.slice(1)}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </header>
    );
}
