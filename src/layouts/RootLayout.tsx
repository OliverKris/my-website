import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar.tsx";
import Footer from "../components/Footer.tsx";

export default function RootLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-white text-zinc-900 transition-theme dark:bg-zinc-950 dark:text-zinc-100">
            <a 
                className="sr-only left-4 top-4 z-100 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-lg focus:not-sr-only focus:fixed 
                        dark:bg-zinc-100 dark:text-zinc-900"
                href="#main"
            >
                Skip to content
            </a>

            <NavBar/>

            
            <main id="main" className="flex-1 pt-8">
                <Outlet />
            </main>

            <Footer/>
        </div>
    );
}
