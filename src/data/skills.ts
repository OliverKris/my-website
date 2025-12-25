export type IconKey =
    | "c"
    | "java"
    | "python"
    | "react"
    | "typescript"
    | "javascript"
    | "linux"
    | "docker"
    | "git"
    | "pytorch"
    | "bash"
    | "css"
    | "html"
    | "sass"
    | "vite"
    | "tailwind"
    | "flask"
    | "django"
    | "aws"
    | "sql"
    | "assemblyscript";

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
    { label: "Java", icon: "java" },
    { label: "JavaScript", icon: "javascript" },
    { label: "Linux", icon: "linux" },
    { label: "PyTorch", icon: "pytorch" },
    { label: "Python", icon: "python" },
    { label: "React", icon: "react" },
    { label: "Sass", icon: "sass" },
    { label: "Tailwind", icon: "tailwind" },
    { label: "TypeScript", icon: "typescript" },
    { label: "Vite", icon: "vite" },
    { label: "AWS", icon: "aws" },
    { label: "SQL", icon: "sql" },
    { label: "Assembly", icon: "assemblyscript" },
];
