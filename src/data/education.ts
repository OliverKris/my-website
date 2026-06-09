export interface Education {
    id: string;
    school: string;
    degree: string;
    year: string;
    description?: string;
    coursework?: string[];
    highlights?: string[];
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
        description: "Music Minor · Technical GPA: 3.76",
        coursework: [
            "Algorithms and Data Structures", 
            "Computer Architecture",
            "Operating Systems",
            "Software Engineering",
            "Systems Programming", 
        ],
        highlights: [
            "Stephen Joel Trachtenberg Full-Ride Scholarship (2021)",
            "Dean's List",
            "Design Build Fly · Rocket Team · GWU Esports",
            "Undergraduate Teaching Assistant — Software Development, Algorithms and Data Structures, Operating Systems, Computer Architecture"
        ],
    },
    {
        id: "edu-2",
        school: "The George Washington University",
        degree: "M.S. in Computer Science",
        year: "2025 - 2026",
        description: "Accelerated dual-degree program, continuing from B.S. · GPA: 3.93",
        coursework: [
            "Advanced Machine Learning",
            "Advanced Operating Systems",
            "Artificial Intelligence",
            "Computer System Architecture",
            "Computer Networks",
            "Design of Interactive Multimedia",
            "Natural Language Understanding",
            "Machine Learning",
        ],
        highlights: [
            "Graduated Summa Cum Laude",
            "Dean's List",
            "SEAS Honor Scholarship Award",
            "Graduate Teaching Assistant — Computer Systems Fundamentals, Databases and Team Projects",
            "Minilab Research Project — Binary size reduction for embedded systems",
        ]
    }
];