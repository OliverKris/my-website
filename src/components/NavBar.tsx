import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useTheme } from "../hooks/useTheme"

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { theme, toggle } = useTheme();

    // Close menu on route change / link click
    const close = () => setOpen(false);

    // Close on Escape
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 820px)");
        const handler = () => {
        if (mq.matches) setOpen(false);
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return (
        <header className={styles.navbar}>
            <div className={styles.inner}>
                <Link className={styles.brand} to="/" onClick={close}>
                    Oliver Krisetya
                </Link>

                {/* Desktop links */}
                <nav className={styles.desktopNav} aria-label="Primary">
                    <NavLink className={({ isActive }) => (isActive ? styles.active : styles.link)} to="/projects">
                        Projects
                    </NavLink>
                    <NavLink className={({ isActive }) => (isActive ? styles.active : styles.link)} to="/resume">
                        Resume
                    </NavLink>
                    <NavLink className={({ isActive }) => (isActive ? styles.active : styles.link)} to="/contact">
                        Contact
                    </NavLink>
                    <button
                        type="button"
                        className={styles.themeToggle}
                        onClick={toggle}
                        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                        >
                        <span className={styles.themeIcon} aria-hidden="true">
                            {theme === "dark" ? "☾" : "☀"}
                        </span>
                    </button>
                </nav>

                <button
                    className={styles.menuBtn}
                    type="button"
                    aria-label="Open menu"
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen((v) => !v)}
                >
                <span className={styles.menuIcon} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </span>
                </button>
            </div>

            <div
                id="mobile-menu"
                className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ""}`}
                aria-hidden={!open}
            >
                <nav className={styles.mobileNav} aria-label="Mobile Primary">
                <NavLink onClick={close} className={({ isActive }) => (isActive ? styles.mobileActive : styles.mobileLink)} to="/projects">
                    Projects
                </NavLink>
                <NavLink onClick={close} className={({ isActive }) => (isActive ? styles.mobileActive : styles.mobileLink)} to="/resume">
                    Resume
                </NavLink>
                <NavLink onClick={close} className={({ isActive }) => (isActive ? styles.mobileActive : styles.mobileLink)} to="/contact">
                    Contact
                </NavLink>
                </nav>
            </div>
        </header>
    );
}
