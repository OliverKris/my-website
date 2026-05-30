import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import { getFeaturedProjects } from "../utils/projects";
import FeaturedProjectCard from "../components/FeaturedProjectCard";
import Reveal from "../components/Reveal";

export default function Home() {
    const featured = getFeaturedProjects(projects, 2);

    return (
        <section className="grid gap-8">
            <Reveal as="header" className="grid gap-3 p-5 border border-(--border) rounded-(--radius) bg-(--surface)">
                <h1 className="m-0 text-3xl font-bold">Hi, I'm Oliver</h1>
                <p className="m-0 font-bold text-(--muted)">Graduate Student, Computer Science — GWU</p>

                <p className="m-0 max-w-[70ch]">
                    I build systems and ML projects with an emphasis on correctness,
                    performance, and reproducibility.
                </p>

                <div className="flex flex-wrap gap-3 mt-1">
                    <Link
                        className="inline-flex items-center px-4 py-3 rounded-(--radius) bg-(--accent) text-white! font-extrabold no-underline! border border-(--accent) hover:bg-(--accent-hover) hover:border-(--accent-hover) hover:no-underline!"
                        to="/projects"
                    >
                        View Projects
                    </Link>

                    <a
                        className="inline-flex items-center px-4 py-3 rounded-(--radius) bg-(--page) text-(--text)! font-extrabold no-underline! border border-(--border) hover:bg-(--page-2) hover:border-(--border-hover) hover:no-underline!"
                        href={`${import.meta.env.BASE_URL}resume.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download Resume
                    </a>

                    <Link
                        className="inline-flex items-center px-1 py-3 text-(--accent) font-extrabold no-underline hover:underline"
                        to="/contact"
                    >
                        Contact
                    </Link>
                </div>
            </Reveal>

            <Reveal as="section" className="grid gap-3" threshold={0.1} delayMs={120}>
                <h2 className="m-0 text-xl font-bold">Current Focus</h2>

                <ul className="list-disc pl-5 grid gap-2">
                    <li>Graduate coursework and research in computer science, with emphasis on systems and applied machine learning.</li>
                    <li>Graduate Teaching Assistant for database systems and team-based software engineering courses.</li>
                    <li>Designing and maintaining production-quality tooling and applications using C, Linux, Python, and React.</li>
                </ul>
            </Reveal>

            <Reveal as="section" className="grid gap-3" threshold={0.2} delayMs={240}>
                <h2 className="m-0 text-xl font-bold">Featured Projects</h2>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {featured.map((p) => (
                        <FeaturedProjectCard key={p.id} project={p} />
                    ))}
                </div>

                <div className="flex justify-end mt-2">
                    <Link className="text-(--accent) font-extrabold no-underline hover:underline" to="/projects">
                        View all projects →
                    </Link>
                </div>
            </Reveal>
        </section>
    );
}
