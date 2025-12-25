import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar.tsx";
import styles from "./RootLayout.module.css";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function RootLayout() {
    return (
        <div className={styles.container}>
            <a className={styles.skipLink} href="#main">
                Skip to content
            </a>

            <NavBar />

            <main id="main" className={styles.main}>
                <Outlet />
            </main>

            <footer className={styles.footer}>
                <section className={styles.socialSection}>
                    <div className={styles.socialIcons}>
                        <a href="https://linkedin.com/in/okrisetya" aria-label="LinkedIn">
                            <FaLinkedin />
                        </a>
                        <a href="https://github.com/OliverKris" aria-label="GitHub">
                            <FaGithub />
                        </a>
                    </div>
                </section>
                <p className={styles.footerText}>© {new Date().getFullYear()} Oliver Krisetya</p>
            </footer>
        </div>
    );
}
