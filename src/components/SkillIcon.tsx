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
} from "react-icons/si";

import { FaJava, FaAws } from "react-icons/fa";
import { DiMysql } from "react-icons/di";

import type { IconKey } from "../data/skills";

const ICONS: Record<
    IconKey,
    React.ComponentType<{ size?: number; className?: string }>
    > = {
    c: SiC,
    java: FaJava,
    python: SiPython,
    react: SiReact,
    typescript: SiTypescript,
    javascript: SiJavascript,
    sql: DiMysql,
    assemblyscript: SiAssemblyscript,

    linux: SiLinux,
    docker: SiDocker,
    git: SiGit,
    pytorch: SiPytorch,

    bash: SiGnubash,
    aws: FaAws,

    css: SiCss3,
    html: SiHtml5,
    sass: SiSass,
    vite: SiVite,
    tailwind: SiTailwindcss,

    flask: SiFlask,
    django: SiDjango,
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
  return <Icon size={size} className={className} aria-hidden="true" />;
}
