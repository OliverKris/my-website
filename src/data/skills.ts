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
    | "assemblyscript"
    | "valgrind"
    | "postgresql"
    | "mysql"
    | "sqlite"
    | "numpy"
    | "pandas"
    | "gdb"
    | "make";

export type Skill = {
    label: string;
    icon: IconKey;
    href?: string;
    category: "web" | "ai" | "systems" | "misc"
};

export const skills: Skill[] = [
    // Systems
    { label: "Assembly", icon: "assemblyscript", category: "systems" },
    { label: "Bash", icon: "bash", category: "systems" },
    { label: "C", icon: "c", category: "systems" },
    { label: "Docker", icon: "docker", category: "systems" },
    { label: "Linux", icon: "linux", category: "systems" },
    { label: "AWS", icon: "aws", category: "systems" },
    { label: "GDB", icon: "gdb", category: "systems" },
    { label: "Valgrind", icon: "valgrind", category: "systems"},
    { label: "Make", icon: "make", category: "systems" },

    // AI
    { label: "Python", icon: "python", category: "ai" },
    { label: "PyTorch", icon: "pytorch", category: "ai" },
    { label: "NumPy", icon: "numpy", category: "ai" },
    { label: "Pandas", icon: "pandas", category: "ai" },

    // Web
    { label: "SQL", icon: "sql", category: "web" },
    { label: "CSS", icon: "css", category: "web" },
    { label: "Django", icon: "django", category: "web" },
    { label: "Flask", icon: "flask", category: "web" },
    { label: "HTML", icon: "html", category: "web" },
    { label: "Java", icon: "java", category: "web" },
    { label: "JavaScript", icon: "javascript", category: "web" },
    { label: "React", icon: "react", category: "web" },
    { label: "Sass", icon: "sass", category: "web" },
    { label: "Tailwind", icon: "tailwind", category: "web" },
    { label: "TypeScript", icon: "typescript", category: "web" },
    { label: "Vite", icon: "vite", category: "web" },
    { label: "PostgreSQL", icon: "postgresql", category: "web" },
    { label: "MySQL", icon: "mysql", category: "web" },
    { label: "SQLite", icon: "sqlite", category: "web" },

    // Misc
    { label: "Git", icon: "git", category: "misc" },
];
