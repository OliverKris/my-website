export function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="grid md:grid-cols-[150px_1fr] gap-x-12 gap-y-16">
            <h2 className="text-lg font-bold uppercase tracking-widest text-muted mt-1">{title}</h2>
            <div className="space-y-10">{children}</div>
        </div>
    );
}