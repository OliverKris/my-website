import { Outlet } from "react-router-dom";
import NavBar from "../components/features/layout/NavBar.tsx";
import Footer from "../components/features/layout/Footer.tsx";

export default function RootLayout() {
    return (
        <div className="min-h-screen bg-canvas text-main flex flex-col">
            <a 
                className="sr-only left-4 top-4 z-100 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-lg focus:not-sr-only focus:fixed 
                        dark:bg-zinc-100 dark:text-zinc-900"
                href="#main"
            >
                Skip to content
            </a>

            <NavBar/>
            <main id="main" className="flex-1 bg-canvas transition-theme relative z-0">
                <Outlet />
            </main>
            <Footer/>
        </div>
    );
}
