import { Section } from "../../ui/Section";
import type { Education } from "../../../data/education"; // Assume this type exists

interface EducationBlockProps {
    education: Education[];
}

export function EducationBlock({ education }: EducationBlockProps) {
    return (
        <Section title="Education">
            <div className="space-y-8">
                {education.map((edu) => (
                    <div key={edu.id} className="relative border-l border-layout pl-6">
                        {/* Decorative dot */}
                        <div className="absolute -left-1.25 top-2 h-2.5 w-2.5 rounded-full bg-accent" />
                        
                        <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-semibold text-main">{edu.school}</h3>
                            <p className="text-sm text-muted">{edu.degree}</p>
                            <span className="text-xs font-mono text-accent">{edu.year}</span>
                        </div>
                        
                        {edu.description && (
                            <p className="mt-3 text-sm leading-relaxed text-muted">
                                {edu.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </Section>
    );
}