const variants = {
    systems: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    ai: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    web: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    neutral: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
};

interface BadgeProps {
    category?: keyof typeof variants; // Make it optional
    children: React.ReactNode;
    className?: string;
}

export function Badge({ category = "neutral", children, className = "" }: BadgeProps) {
    const base = `px-2 py-0.5 rounded-full border text-[10px] font-medium ${variants[category]}`;
    return <span className={`${className} ${base}`}>{children}</span>;
}