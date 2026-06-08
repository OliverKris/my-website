import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar.tsx";
import Footer from "../components/Footer.tsx";
import styles from "./RootLayout.module.css";

export default function RootLayout() {
    return (
        <div className={styles.container}>
            <a className={styles.skipLink} href="#main">
                Skip to content
            </a>

            <NavBar/>

            <main id="main" className={styles.main}>
                <Outlet />
            </main>

            <Footer/>
        </div>
    );
}
