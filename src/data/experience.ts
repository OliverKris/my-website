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
        { role: "Undergraduate Teaching Assistant", start: "Aug 2024", end: "May 2025" },
        { role: "Learning Assistant", start: "Aug 2022", end: "May 2023" },
        ],
        bullets: [
        "Designed and delivered programming assignments for a graduate  Computer Systems Fundamentals  course,  authoring C projects and assessments aligned with core systems concepts.",
        "Built and maintained  autograders, test harnesses, and GitHub Classroom workflows  , ensuring consistent,  reproducible grading across course offerings.",
        "Leading curriculum development for an undergraduate  Databases & Team Projects  course, including lab design and  coordination of two undergraduate TAs."
        ],
    },
    {
        id: "esports-club",
        role: "President",
        org: "GW Esports Club",
        location: "Washington, DC",
        start: "Jan 2025",
        end: "Present",
        tag: "Current",
        previousRoles: [
        { role: "Executive of Competition", start: "Jan 2023", end: "Jan 2025" },
        { role: "Competitive Organizer", start: "Aug 2021", end: "Dec 2023" }
        ],
        bullets: [
        "Lead a  200-member organization across 12 competitive  and casual teams  , overseeing budgeting, scheduling,  recruitment, and strategic planning.",
        "Manage and coordinate  five executive officers and  additional board members  , establishing operational  structure  and accountability across departments.",
        "Represent the organization to the university and external partners (including  ECAC  ), contributing to membership  growth, increased engagement, and competitive success across league play."
        ],
    }
];
