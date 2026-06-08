export interface Education {
    id: string;
    school: string;
    degree: string;
    year: string;
    description?: string;
}

export interface Experience {
    id: string;
    company: string;
    role: string;
    duration: string;
    highlights: string[];
}

export const educationData: Education[] = [
    {
        id: "edu-1",
        school: "The George Washington University",
        degree: "B.S. in Computer Science",
        year: "2021 - 2025",
        description: "Specialized in distributed systems and AI."
    },
    {
        id: "edu-2",
        school: "The George Washington University",
        degree: "M.S. in Computer Science",
        year: "2025 - 2026",
        description: "Specialized in distributed systems and AI."
    }
];