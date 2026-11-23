# oliverkrisetya.vercel.app

My portfolio: who I am, what I've built, and two projects told in full.

- **Home**: a statement, the flagship projects with their real interfaces, a live
  version of Easy-Sched's solver you can play with, and how to reach me.
- **Work** (`/projects`): case studies first, then every other project as a row
  that opens to its details.
- **Easy-Sched case study** (`/projects/easy-sched`): demo film, benchmarks, an
  interactive architecture diagram, the live solver, screens and the stack.
- **Formality bias in LLMs** (`/projects/formality`): the research write-up with
  its own interactive scorer.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check and build to dist/
npm run lint
```

Deployed on Vercel; `vercel.json` rewrites every path to `index.html` for the
client-side router.

## How it's put together

React 19, TypeScript, Vite, Tailwind CSS v4 and framer-motion.

- `src/index.css`: design tokens (one ground, one ink, one emerald accent, in light
  and dark), type steps and the motion keyframes.
- `src/data/`: projects, experience and education as typed data. A project with a
  `caseStudy` gets a large row on the Work page.
- `src/lib/hungarian.ts`: maximum-weight bipartite matching. With
  `src/data/easySchedSample.ts` (a term exported from Easy-Sched's benchmark
  harness) it reproduces the backend's answer exactly, in the browser.
- `public/media/`: screenshots and the demo film, recorded from the live app.
