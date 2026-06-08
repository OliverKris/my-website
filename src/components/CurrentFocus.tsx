const CURRENT_FOCUSES = [
    { title: "Systems & Infrastructure", description: "Designing production-quality tooling.", badge: "Low-Level", theme: "secondary" },
    { title: "Applied Machine Learning", description: "Researching model evaluation frameworks.", badge: "AI / NLP", theme: "accent" },
    { title: "Open Source & Scaling", description: "Building reliable web interfaces.", badge: "Full-Stack", theme: "tertiary" }
] as const;

// Static lookup object: Tailwind sees these strings clearly during compilation
const themeMap = {
    accent: {
        bar: "bg-accent",
        badge: "text-accent bg-accent-soft border-accent/20"
    },
    secondary: {
        bar: "bg-secondary",
        badge: "text-secondary bg-secondary-soft border-secondary/20"
    },
    tertiary: {
        bar: "bg-tertiary",
        badge: "text-tertiary bg-tertiary-soft border-tertiary/20"
    }
};

export default function CurrentFocus() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CURRENT_FOCUSES.map((focus) => (
                <div key={focus.title} className="group relative rounded-xl border border-layout bg-card p-6 transition-colors hover:border-main/20">
                    {/* The performance-safe bar */}
                    <div className={`absolute top-0 left-0 h-1.5 w-full rounded-t-xl opacity-0 transition-opacity group-hover:opacity-100 ${themeMap[focus.theme].bar}`} />
                    
                    <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${themeMap[focus.theme].badge}`}>
                        {focus.badge}
                    </span>
                    <h3 className="mt-3 font-semibold text-main">{focus.title}</h3>
                    <p className="mt-2 text-sm text-muted">{focus.description}</p>
                </div>
            ))}
        </div>
    );
}