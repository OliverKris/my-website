export type IconKey =
    | "c"
    // | "java"
    | "python"
    | "react"
    | "typescript"
    | "javascript"
    | "linux"
    | "docker"
    | "git"
    | "pytorch"
    | "networking"
    | "bash"
    | "operating-systems"
    | "systems-programming"
    | "css"
    | "html"
    | "sass"
    | "vite"
    | "tailwind"
    | "flask"
    | "django";

export type Skill = {
    label: string;
    icon: IconKey;
    href?: string;
};

export const skills: Skill[] = [
    { label: "Bash", icon: "bash" },
    { label: "C", icon: "c" },
    { label: "CSS", icon: "css" },
    { label: "Django", icon: "django" },
    { label: "Docker", icon: "docker" },
    { label: "Flask", icon: "flask" },
    { label: "Git", icon: "git" },
    { label: "HTML", icon: "html" },
    // { label: "Java", icon: "java" },
    { label: "JavaScript", icon: "javascript" },
    { label: "Linux", icon: "linux" },
    { label: "Networking", icon: "networking" },
    { label: "Operating Systems", icon: "operating-systems" },
    { label: "PyTorch", icon: "pytorch" },
    { label: "Python", icon: "python" },
    { label: "React", icon: "react" },
    { label: "Sass", icon: "sass" },
    { label: "Systems Programming", icon: "systems-programming" },
    { label: "Tailwind", icon: "tailwind" },
    { label: "TypeScript", icon: "typescript" },
    { label: "Vite", icon: "vite" },
];
