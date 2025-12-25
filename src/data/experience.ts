export type PreviousRole = {
    role: string;
    start: string; // e.g. "Jan 2024"
    end: string;   // e.g. "May 2025"
};

export type Experience = {
    id: string;
    role: string;
    org: string;
    location?: string;
    start: string;      // "Aug 2025"
    end: string;        // "Present" allowed
    tag?: string;       // "Current"
    bullets: string[];
    previousRoles?: PreviousRole[];
};

export const experience: Experience[] = [
    {
        id: "gwu-ta",
        role: "Graduate Teaching Assistant",
        org: "The George Washington University",
        location: "Washington, DC",
        start: "Aug 2025",
        end: "Present",
        tag: "Current",
        previousRoles: [
        { role: "Undergraduate Teaching Assistant", start: "Jan 2024", end: "May 2025" },
        ],
        bullets: [
        "Designed and graded systems programming assignments in C; provided structured debugging support and feedback.",
        "Maintained reproducible autograder workflows (Makefiles, test scripts) across student environments.",
        ],
    },
];
