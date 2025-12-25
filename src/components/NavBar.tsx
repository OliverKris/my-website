import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useTheme } from "../hooks/useTheme";

export default function NavBar() {
    const { theme, toggle } = useTheme();

    return (
        <nav className={styles.nav}>
            <div className={styles.brand}>Oliver Krisetya</div>

            <div className={styles.right}>
                <ul className={styles.links}>
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/projects">Projects</NavLink></li>
                    <li><NavLink to="/resume">Resume</NavLink></li>
                    <li><NavLink to="/contact">Contact</NavLink></li>
                </ul>

                <button
                    type="button"
                    className={styles.themeButton}
                    onClick={toggle}
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    >
                    <span className={styles.themeIcon} aria-hidden="true">
                        {theme === "dark" ? "☾" : "☀"}
                    </span>
                </button>
            </div>
        </nav>
    );
}
