import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar.tsx";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function RootLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />

            <main id="main" className="flex-1 w-full max-w-(--maxw) mx-auto px-4 py-10">
                <Outlet />
            </main>

            <footer className="border-t border-(--border) px-4 py-5 text-(--muted) text-center">
                <section className="py-4">
                    <div className="flex justify-center gap-10 text-[32px] text-(--accent)">
                        <a href="https://linkedin.com/in/okrisetya" aria-label="LinkedIn" className="text-(--accent)! no-underline! hover:brightness-90">
                            <FaLinkedin />
                        </a>
                        <a href="https://github.com/OliverKris" aria-label="GitHub" className="text-(--accent)! no-underline! hover:brightness-90">
                            <FaGithub />
                        </a>
                    </div>
                </section>
                <p className="mt-3 text-[0.9rem]">© {new Date().getFullYear()} Oliver Krisetya</p>
            </footer>
        </div>
    );
}
