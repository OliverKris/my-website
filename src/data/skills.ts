/*
  The one list of skills and tools. A project's `tech` may only use these names (TypeScript
  enforces it), so the Résumé page's counts are exact matches, never guesses.

  Each project's tools were read from its source: imports, package.json, requirements,
  Makefiles and build settings. Skills with no project here come from coursework, teaching
  and work, and say so on the page.
*/

export const SKILL_AREAS = [
    { key: "lang", label: "Languages" },
    { key: "systems", label: "Systems" },
    { key: "ml", label: "ML & data" },
    { key: "web", label: "Apps & backend" },
    { key: "game", label: "Game & media" },
    { key: "tools", label: "Tools & delivery" },
] as const;

export type SkillArea = (typeof SKILL_AREAS)[number]["key"];

const SKILLS = {
    // Languages
    Python: "lang", TypeScript: "lang", JavaScript: "lang", C: "lang", Java: "lang", GDScript: "lang",
    SQL: "lang", Bash: "lang", Assembly: "lang", HTML: "lang", CSS: "lang",
    // Systems
    Linux: "systems", Make: "systems", GDB: "systems", Valgrind: "systems", WebAssembly: "systems",
    // ML & data
    PyTorch: "ml", "Hugging Face Transformers": "ml", PEFT: "ml", TRL: "ml", "scikit-learn": "ml",
    NumPy: "ml", SciPy: "ml", Pandas: "ml", Matplotlib: "ml", Seaborn: "ml", Jupyter: "ml", Kaggle: "ml",
    // Web & backend
    React: "web", "React Router": "web", "TanStack Query": "web", "Tailwind CSS": "web", "Framer Motion": "web",
    Vite: "web", FastAPI: "web", Pydantic: "web", SQLAlchemy: "web", Django: "web", Flask: "web",
    SQLite: "web", PostgreSQL: "web", MySQL: "web", Sass: "web", Argon2: "web", Swing: "web",
    // Game & media
    Godot: "game", Aseprite: "game", "Ableton Live": "game",
    // Tools & delivery
    Git: "tools", Docker: "tools", "GitHub Actions": "tools", pytest: "tools", unittest: "tools",
    Vercel: "tools", Render: "tools", AWS: "tools", "Google Colab": "tools",
} as const satisfies Record<string, SkillArea>;

export type SkillName = keyof typeof SKILLS;

export type Skill = { label: SkillName; area: SkillArea };

export const skills: Skill[] = (Object.entries(SKILLS) as [SkillName, SkillArea][]).map(([label, area]) => ({ label, area }));
