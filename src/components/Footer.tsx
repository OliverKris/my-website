import { FaLinkedin, FaGithub } from "react-icons/fa";

const SOCIAL_LINKS = [
    {
        name: "LinkedIn",
        href: "https://linkedin.com/in/okrisetya",
        Icon: FaLinkedin
    },
    {
        name: "GitHub",
        href: "https://github.com/OliverKris",
        Icon: FaGithub
    }
];

export default function Footer() {
    return (
        <footer className="w-full border-t border-zinc-200 dark:border-zinc-800">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
                
                <div className="flex items-center gap-4">
                    {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                        <a 
                            key={name}
                            href={href} 
                            aria-label={name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            {/* Dynamically render the React Icon component */}
                            <Icon className="h-6 w-6" />
                        </a>
                    ))}
                </div>
                
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    © {new Date().getFullYear()} Oliver Krisetya
                </p>
            </div>
        </footer>
    );
}