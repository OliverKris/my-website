import { Link } from "react-router-dom";
import { frame } from "./Rise";
import { RESUME_PDF } from "./Nav";

/** The name opens the footer at full width; ways to reach me under it. */
export default function Footer() {
    return (
        <footer className="bg-field text-field-ink overflow-hidden">
            <div className={`${frame} pt-16 md:pt-24 pb-10`}>
                <p className="m-0 font-semibold leading-[0.85] tracking-[-0.05em] text-[21vw] whitespace-nowrap -ml-[0.04em]" aria-hidden="true">
                    Krisetya
                </p>
                <div className="mt-16 md:mt-20 grid gap-12 md:grid-cols-12">
                    <ul className="md:col-span-6 list-none m-0 p-0 flex flex-col gap-2">
                        <li><a className="text-[clamp(26px,2.6vw,36px)] font-medium tracking-[-0.02em] text-field-ink no-underline hover:opacity-70 transition-opacity" href="https://linkedin.com/in/okrisetya" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                        <li><a className="text-[clamp(26px,2.6vw,36px)] font-medium tracking-[-0.02em] text-field-ink no-underline hover:opacity-70 transition-opacity" href="https://github.com/OliverKris" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                        <li><Link className="text-[clamp(26px,2.6vw,36px)] font-medium tracking-[-0.02em] text-field-ink no-underline hover:opacity-70 transition-opacity" to="/contact">Send a message</Link></li>
                    </ul>
                    <div className="md:col-span-6 grid grid-cols-2 gap-8 text-[15px]">
                        <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                            <li className="text-field-muted">Pages</li>
                            <li><Link className="text-field-ink no-underline hover:underline" to="/">Home</Link></li>
                            <li><Link className="text-field-ink no-underline hover:underline" to="/projects">Work</Link></li>
                            <li><Link className="text-field-ink no-underline hover:underline" to="/resume">Résumé</Link></li>
                        </ul>
                        <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                            <li className="text-field-muted">Case studies</li>
                            <li><Link className="text-field-ink no-underline hover:underline" to="/projects/easy-sched">Easy-Sched</Link></li>
                            <li><Link className="text-field-ink no-underline hover:underline" to="/projects/formality">Formality bias in LLMs</Link></li>
                            <li><a className="text-field-ink no-underline hover:underline" href={RESUME_PDF} target="_blank" rel="noopener noreferrer">Résumé PDF</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-20 flex flex-wrap justify-between gap-4 text-[13px] text-field-muted">
                    <span>© {new Date().getFullYear()} Oliver Krisetya · New York and Washington, DC</span>
                    <a href="#top" className="text-field-muted no-underline hover:text-field-ink">Back to top</a>
                </div>
            </div>
        </footer>
    );
}
