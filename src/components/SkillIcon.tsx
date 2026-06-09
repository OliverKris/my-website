import {
    SiC,
    SiPython,
    SiReact,
    SiTypescript,
    SiJavascript,
    SiLinux,
    SiDocker,
    SiGit,
    SiPytorch,
    SiGnubash,
    SiCss3,
    SiHtml5,
    SiSass,
    SiVite,
    SiTailwindcss,
    SiFlask,
    SiDjango,
    SiAssemblyscript,
    SiNumpy,
    SiPandas,
    SiPostgresql,
    SiMysql,
    SiSqlite,
    SiGnu,
    SiSpeedtest,
    SiBuildkite,
} from "react-icons/si";

import { FaJava, FaAws } from "react-icons/fa";
import type { IconKey } from "../data/skills";

const ICONS: Record<IconKey, React.ComponentType<{ size?: number; className?: string }>> = {
    assemblyscript: SiAssemblyscript,
    aws:            FaAws,
    bash:           SiGnubash,
    c:              SiC,
    css:            SiCss3,
    django:         SiDjango,
    docker:         SiDocker,
    flask:          SiFlask,
    git:            SiGit,
    html:           SiHtml5,
    java:           FaJava,
    javascript:     SiJavascript,
    linux:          SiLinux,
    mysql:          SiMysql,
    numpy:          SiNumpy,
    pandas:         SiPandas,
    postgresql:     SiPostgresql,
    python:         SiPython,
    pytorch:        SiPytorch,
    react:          SiReact,
    sass:           SiSass,
    sqlite:         SiSqlite,
    sql:            SiMysql,
    tailwind:       SiTailwindcss,
    typescript:     SiTypescript,
    vite:           SiVite,
    gdb:            SiGnu,
    make:           SiSpeedtest,
    valgrind:       SiBuildkite,
};

export function SkillIcon({
    name,
    size = 16,
    className,
}: {
    name: IconKey;
    size?: number;
    className?: string;
}) {
    const Icon = ICONS[name];
    if (!Icon) return null;
    return <Icon size={size} className={className} aria-hidden="true" />;
}