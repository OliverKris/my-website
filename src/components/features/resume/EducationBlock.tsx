import type { Education } from "../../../data/education";

interface EducationBlockProps {
    education: Education[];
}

export function EducationBlock({ education }: EducationBlockProps) {
    return (
        <div className="space-y-6">
            {education.map((edu) => (
                <div key={edu.id} className="relative border-l-2 border-accent pl-5">
                    <div className="absolute -left-1.25 top-2.25 h-2 w-2 rounded-full bg-accent" />

                    <h3 className="font-medium text-main text-lg">{edu.school}</h3>
                    <p className="text-md text-muted mt-0.5">{edu.degree}</p>
                    <span className="text-xs font-mono font-semibold text-accent mt-1 block">{edu.year}</span>

                    {edu.description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted">{edu.description}</p>
                    )}

                    <div className="mt-2 text-sm text-muted">
                        <p className="mb-3"><span className="font-semibold text-main">Relevant Coursework:</span> <span className="italic">{edu.coursework?.join(", ")}</span></p>
                        {edu.highlights && (
                            <ul className="mt-1 list-disc ml-4">
                                {edu.highlights.map((h, i) => <li key={i}>{h}</li>)}
                            </ul>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}