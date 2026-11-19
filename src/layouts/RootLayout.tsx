import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import Nav from "../components/site/Nav";
import Footer from "../components/site/Footer";

export default function RootLayout() {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (!hash) window.scrollTo({ top: 0 });
    }, [pathname, hash]);

    return (
        <MotionConfig reducedMotion="user">
            <div id="top" className="min-h-screen bg-canvas text-main flex flex-col">
                <a
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink"
                    href="#main"
                >
                    Skip to content
                </a>
                <Nav />
                <main id="main" className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </MotionConfig>
    );
}
