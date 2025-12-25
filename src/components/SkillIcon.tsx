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
} from "react-icons/si";

import { MdNetworkCheck, MdComputer } from "react-icons/md";

import type { IconKey } from "../data/skills";

const ICONS: Record<
    IconKey,
    React.ComponentType<{ size?: number; className?: string }>
    > = {
    c: SiC,
    // java: SiJava,
    python: SiPython,
    react: SiReact,
    typescript: SiTypescript,
    javascript: SiJavascript,

    linux: SiLinux,
    docker: SiDocker,
    git: SiGit,
    pytorch: SiPytorch,

    networking: MdNetworkCheck,
    bash: SiGnubash,
    // unix: FaUnix,

    "operating-systems": MdComputer,
    "systems-programming": MdComputer,

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
