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
        <footer className="w-full border-t border-layout transition-theme">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
                
                {/* Social Network Icon Matrix */}
                <div className="flex items-center gap-4">
                    {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                        <a 
                            key={name}
                            href={href} 
                            aria-label={name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted transition-theme hover:text-main"
                        >
                            <Icon className="h-5 w-5" />
                        </a>
                    ))}
                </div>
                
                <p className="text-xs text-muted transition-theme">
                    &copy; {new Date().getFullYear()} Oliver Krisetya. All rights reserved.
                </p>
            </div>
        </footer>
    );
}