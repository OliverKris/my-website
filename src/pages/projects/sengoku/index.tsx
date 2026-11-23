import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { frame, Rise } from "../../../components/site/Rise";
import { LoopVideo, Shot } from "../../../components/site/Media";
import { CaseStudyBar } from "../../../components/site/CaseStudyBar";
import { FrontierMap } from "./FrontierMap";
import { LevelEditorDemo } from "./LevelEditorDemo";
import { MediaSection } from "./MediaSection";

const REPO = "https://github.com/OliverKris/sengoku-jidai";
const GAME = "/play/sengoku-jidai/index.html";

function SectionHead({ id, title, children }: { id: string; title: string; children?: React.ReactNode }) {
    return (
        <Rise as="header" className="flex flex-col gap-5 max-w-[62ch]">
            <h2 id={id} className="m-0 text-[clamp(36px,4.4vw,68px)] font-semibold leading-[1] tracking-[-0.04em]">{title}</h2>
            {children && <div className="text-[length:var(--text-body)] leading-[1.6] flex flex-col gap-4">{children}</div>}
        </Rise>
    );
}

/* ---------- the game, loaded only when asked for ---------- */

function PlayGame() {
    const [started, setStarted] = useState(false);
    const frameRef = useRef<HTMLIFrameElement>(null);

    return (
        <div className="flex flex-col gap-4">
            <Shot ratio={16 / 9} fit={0.9}>
                <div className="relative aspect-video bg-black">
                    {started ? (
                        <iframe
                            ref={frameRef}
                            src={GAME}
                            title="Sengoku Jidai, playable"
                            className="absolute inset-0 w-full h-full border-0"
                            allow="autoplay; fullscreen; gamepad"
                            allowFullScreen
                            // Sandboxed (no same-origin) so the browser can run the game in its own process
                            // instead of on the page's main thread, where it made scrolling stutter.
                            sandbox="allow-scripts allow-pointer-lock"
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => setStarted(true)}
                            className="group absolute inset-0 w-full h-full cursor-pointer border-0 p-0 bg-transparent"
                            aria-label="Start Sengoku Jidai in the page"
                        >
                            <img src="/media/sengoku/menu.webp" alt="" width={1600} height={896} className="absolute inset-0 w-full h-full object-cover" />
                            <span className="absolute inset-0 bg-black/45 transition-colors group-hover:bg-black/35" />
                            <span className="relative flex flex-col items-center justify-center h-full gap-4 text-white">
                                <span className="inline-flex items-center gap-3 h-16 px-8 rounded-full bg-accent text-accent-ink text-[20px] font-semibold transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
                                    <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true"><path d="M2 1.5v17L16.5 10z" fill="currentColor" /></svg>
                                    Play
                                </span>
                                <span className="text-[15px] opacity-90">About 17 MB to download. Best with a mouse on a computer.</span>
                            </span>
                        </button>
                    )}
                </div>
            </Shot>
            <div className="flex flex-wrap items-center justify-between gap-3 max-w-[calc((90svh-6rem)*16/9)] mx-auto w-full">
                <p className="m-0 text-[15px] text-muted">
                    Drag from one of your cities to another to send troops. Click a city to upgrade it. The clock speeds up, slows or pauses the game.
                </p>
                <div className="flex gap-2">
                    {started && (
                        <button type="button" onClick={() => frameRef.current?.requestFullscreen?.()}
                            className="h-11 px-4 rounded-full bg-card text-main text-[15px] cursor-pointer hover:bg-raised transition-colors">
                            Full screen
                        </button>
                    )}
                    <a href={GAME} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center h-11 px-4 rounded-full bg-card text-main text-[15px] no-underline hover:bg-raised transition-colors">
                        Open in a new tab ↗
                    </a>
                </div>
            </div>
        </div>
    );
}

/* ---------- siege simulator: the game's own battle rules ---------- */

const DEFENSE = [0.05, 0.1, 0.15, 0.2]; // damage reduction by defense level, from Battle.gd

interface Step { attackers: number; garrison: number }

/** Replays World/Battle/Battle.gd: each cycle both sides lose √(the other side), floored, at least 1. */
function simulate(attackers: number, garrison: number, defense: number) {
    const steps: Step[] = [{ attackers, garrison }];
    let a = attackers;
    let g = garrison;
    for (let i = 0; i < 1000; i++) {
        if (g <= 0) return { steps, outcome: "captured" as const, survivors: a };
        const toAttackers = Math.max(1, Math.floor(Math.sqrt(g)));
        let toGarrison = Math.max(1, Math.floor(Math.sqrt(a)));
        toGarrison = Math.max(1, Math.floor(toGarrison * (1 - DEFENSE[defense])));
        a -= toAttackers;
        g -= toGarrison;
        steps.push({ attackers: Math.max(0, a), garrison: Math.max(0, g) });
        if (a <= 0 && g <= 0) return { steps, outcome: "wiped" as const, survivors: 0 };
        if (a <= 0) return { steps, outcome: "repelled" as const, survivors: g };
        if (g <= 0) return { steps, outcome: "captured" as const, survivors: a };
    }
    return { steps, outcome: "repelled" as const, survivors: g };
}

function SiegeSim() {
    const [attackers, setAttackers] = useState(120);
    const [garrison, setGarrison] = useState(80);
    const [defense, setDefense] = useState(1);
    const result = simulate(attackers, garrison, defense);
    const cycles = result.steps.length - 1;

    // Play the battle cycle by cycle whenever the inputs change.
    const [shown, setShown] = useState(cycles);
    const [inputs, setInputs] = useState(`${attackers}-${garrison}-${defense}`);
    const key = `${attackers}-${garrison}-${defense}`;
    if (key !== inputs) {
        setInputs(key);
        setShown(0);
    }
    useEffect(() => {
        if (shown >= cycles) return;
        const t = window.setTimeout(() => setShown((s) => s + 1), Math.max(40, Math.min(160, 2400 / cycles)));
        return () => window.clearTimeout(t);
    }, [shown, cycles]);

    const now = result.steps[Math.min(shown, cycles)];
    const start = Math.max(attackers, garrison);
    const done = shown >= cycles;
    const verdict =
        result.outcome === "captured" ? `Captured after ${cycles} ${cycles === 1 ? "cycle" : "cycles"}, with ${result.survivors} attackers left to hold it.`
            : result.outcome === "repelled" ? `Repelled after ${cycles} cycles. The city keeps ${result.survivors} defenders.`
                : `Both sides are wiped out after ${cycles} cycles; the city stands empty.`;

    const slider = (label: string, value: number, set: (n: number) => void, min: number, max: number, step = 1, fmt?: (n: number) => string) => (
        <label className="flex flex-col gap-2 text-[15px]">
            <span className="flex justify-between"><span>{label}</span><span className="tabular-nums font-semibold">{fmt ? fmt(value) : value}</span></span>
            <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))}
                className="w-full h-6 cursor-pointer accent-[var(--color-accent-base)]" />
        </label>
    );

    return (
        <div className="grid gap-8 lg:grid-cols-12 items-start" data-ui>
            <div className="lg:col-span-4 rounded-2xl bg-card p-6 md:p-8 flex flex-col gap-6">
                {slider("Attacking army", attackers, setAttackers, 1, 400)}
                {slider("City garrison", garrison, setGarrison, 1, 400)}
                {slider("City defense level", defense, setDefense, 0, 3, 1, (n) => `${n} · −${DEFENSE[n] * 100}% damage`)}
            </div>
            <div className="lg:col-span-8 rounded-2xl bg-card p-6 md:p-8 flex flex-col gap-6" aria-live="polite">
                {[
                    { label: "Attackers", value: now.attackers, max: attackers, tone: "bg-main/45" },
                    { label: "Garrison", value: now.garrison, max: garrison, tone: "bg-accent" },
                ].map((row) => (
                    <div key={row.label} className="flex flex-col gap-2">
                        <span className="flex justify-between text-[15px]">
                            <span className="font-semibold">{row.label}</span>
                            <span className="tabular-nums">{row.value} <span className="text-muted">of {row.max}</span></span>
                        </span>
                        <span className="block h-4 rounded-full bg-canvas overflow-hidden">
                            <span className={`block h-full rounded-full ${row.tone} transition-[width] duration-150 ease-out`} style={{ width: `${(row.value / start) * 100}%` }} />
                        </span>
                    </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <p className="m-0 text-[clamp(20px,1.8vw,26px)] font-semibold tracking-[-0.01em] leading-[1.25] max-w-[34ch]">
                        {done ? verdict : `Cycle ${shown} of ${cycles}…`}
                    </p>
                    <button type="button" onClick={() => setShown(0)} className="h-11 px-4 rounded-full bg-canvas text-main text-[15px] cursor-pointer hover:bg-raised transition-colors">
                        Replay
                    </button>
                </div>
                <p className="m-0 text-[14px] text-muted leading-[1.5]">
                    Each cycle, the attackers lose ⌊√garrison⌋ troops and the garrison loses ⌊√attackers⌋, less the defense bonus, at least 1 each.
                    Battle rules only: in the game the city also keeps producing troops while under siege.
                </p>
            </div>
        </div>
    );
}

/* ---------- page ---------- */

const RULES = [
    { t: "Cities", d: "Neutral, yours or the enemy’s. Every cycle each owned city produces troops and gold." },
    { t: "Roads", d: "Cities connect by roads. Drag from a city to send part of its army to reinforce a friend or attack a rival." },
    { t: "Battles", d: "Armies fight when they meet on a road or reach an enemy city, and resolve over several cycles." },
    { t: "Upgrades", d: "Spend gold to raise a city’s troop production, gold income or defense, three levels each." },
    { t: "The cycle clock", d: "One shared tick drives production, battles and the AI. Speed it up, slow it down or pause it." },
    { t: "An AI rival", d: "It maps its own frontier, funnels troops toward it, intercepts attacks and strikes when the odds favour it." },
];

const SYSTEMS = [
    { t: "Real-time cycle clock", f: "Autoloads/CycleClock.gd", d: "One pausable, speed-adjustable tick drives the economy, combat and movement. Everything listens for cycle_ticked, so pause and 2× are a single setting." },
    { t: "Hex graph map", f: "LevelData/GraphMap.gd", d: "Loads a LevelData resource into a navigable graph on an axial hex grid. Movement, AI pathing and siege routing all query this one graph instead of keeping their own copy of the map." },
    { t: "City economy", f: "World/City/CityData.gd", d: "Every cycle each city earns gold and troops. Three upgrade tracks (production, gold, defence) with three tiers each, priced 50 × 1.75^level: 50, 87, 153 gold." },
    { t: "Units & combat", f: "World/Unit/Unit.gd · World/Battle/Battle.gd", d: "Armies march in real time, slower on longer roads. They fight when they meet an enemy army on the way, or at the walls, where defence multiplies the garrison by up to 2×." },
    { t: "Signal-driven autoloads", f: "Autoloads/", d: "CycleClock, FactionState and LevelSelection, plus scene-transition and audio managers, broadcast Godot signals instead of holding references to each other, which keeps economy, combat and AI decoupled." },
    { t: "Web export", f: "export_presets.cfg", d: "A single-threaded WebAssembly build with the compatibility renderer, so the whole game runs from a static host in a sandboxed frame on this page." },
];

const LEVEL_CLASSES = `class_name LevelData extends Resource
@export var level_name: String = "Unnamed Level"
@export var cities: Array[CitySpawnData] = []
@export var roads: Array[RoadData] = []

class_name CitySpawnData extends Resource
@export var id: int = 0
@export var city_name: String = ""
@export var hex_coord: Vector2 = Vector2.ZERO
@export var owner: int = 0          # 0 neutral, 1 player, 2 AI
@export var army: int = 10
@export var defense_level: int = 0  # 0–3

class_name RoadData extends Resource
@export var a_id: int
@export var b_id: int
@export var length: float = 1.0     # scales march time`;

const AI_SNIPPET = `# Frontier cities (adjacent to anyone else) get distance 0;
# each step back from the front adds 1.
for city in ai_cities:
    var is_frontier := false
    for n in graph_map.get_adjacent_cities(city):
        if n.data.owner != AI_OWNER:
            is_frontier = true
            break
    if is_frontier:
        frontier_dist[city] = 0
        bfs_queue.append(city)
while head < bfs_queue.size():
    var current = bfs_queue[head]; head += 1
    for n in graph_map.get_adjacent_cities(current):
        if n.data.owner == AI_OWNER and not frontier_dist.has(n):
            frontier_dist[n] = frontier_dist[current] + 1
            bfs_queue.append(n)

# Rear city: push 30% one hop toward the front.
# Frontier city: intercept, else attack at odds >= 0.8, else hold.`;

export default function SengokuCaseStudy() {
    return (
        <article>
            <CaseStudyBar
                title="Sengoku Jidai"
                next={{ to: "/projects/easy-sched", label: "Easy-Sched" }}
                sections={[
                    { id: "play", label: "Play" }, { id: "plays", label: "How it plays" }, { id: "siege", label: "Sieges" },
                    { id: "levels", label: "Levels" }, { id: "ai", label: "The AI" }, { id: "built", label: "Systems" },
                    { id: "media", label: "Made from scratch" }, { id: "team", label: "Team" },
                ]}
            />
            <header className={`${frame} pt-16 md:pt-24 grid gap-10 lg:grid-cols-12 items-end`}>
                <div className="lg:col-span-8">
                    <h1 className="m-0 font-semibold text-[length:var(--text-display)] leading-[0.92] tracking-[-0.05em]">
                        <span className="mask-line"><span>Sengoku Jidai</span></span>
                    </h1>
                    <p className="mt-8 mb-0 text-[length:var(--text-lead)] leading-[1.35] tracking-[-0.01em] max-w-[40ch] fade-up" style={{ ["--fade-delay" as string]: "300ms" }}>
                        A real-time strategy game of territorial conquest, built in Godot. Send armies down the roads between cities,
                        upgrade your strongholds, and out-think an AI rival for the map. Code, pixel art, animation, music and
                        story all made by the two of us.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3 fade-up" style={{ ["--fade-delay" as string]: "400ms" }}>
                        <a href="#play" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-accent text-accent-ink text-[16px] font-medium no-underline transition-transform hover:scale-[1.03] active:scale-[0.98]">
                            Play in your browser
                        </a>
                        <a href={REPO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center h-12 px-5 rounded-full bg-card text-main text-[16px] no-underline hover:bg-raised transition-colors">
                            Read the code
                        </a>
                    </div>
                </div>
                <dl className="lg:col-span-4 m-0 grid grid-cols-2 gap-x-6 gap-y-5 text-[15px] fade-up" style={{ ["--fade-delay" as string]: "500ms" }}>
                    <div><dt className="text-muted">Engine</dt><dd className="m-0">Godot 4.6, GDScript</dd></div>
                    <div><dt className="text-muted">Course</dt><dd className="m-0">CSCI 6562, GWU, spring 2026</dd></div>
                    <div><dt className="text-muted">Team</dt><dd className="m-0">Oliver Krisetya, Warren Nguyen</dd></div>
                    <div><dt className="text-muted">Largest map</dt><dd className="m-0">17 cities, 24 roads</dd></div>
                </dl>
            </header>

            <div id="film" className="scroll-mt-32">
                <Rise className={`${frame} mt-14`} delay={200}>
                    <Shot ratio={1920 / 1076}>
                        <LoopVideo src="/media/sengoku/demo.mp4" poster="/media/sengoku/demo-poster.webp"
                            label="Sengoku Jidai gameplay: choosing a chapter, then sending armies between cities on a hex map and capturing enemy cities" />
                    </Shot>
                </Rise>
            </div>

            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="play">
                <SectionHead id="play" title="Play it here">
                    <p className="m-0">
                        The full game, compiled to WebAssembly and running in this page: the tutorial and both chapters, with music.
                        Press Play to load it.
                    </p>
                </SectionHead>
                <Rise delay={120} className="mt-12"><PlayGame /></Rise>
            </section>

            <section className="mt-[clamp(96px,12vw,200px)] bg-card py-[clamp(72px,9vw,140px)]" aria-labelledby="plays">
                <div className={`${frame} grid gap-12 lg:grid-cols-12 items-start`}>
                    <div className="lg:col-span-5 flex flex-col gap-10">
                        <SectionHead id="plays" title="How it plays">
                            <p className="m-0">The map is a graph of cities joined by roads on a hex grid. You win by taking every enemy city before the AI takes yours.</p>
                        </SectionHead>
                        <Rise delay={90}>
                            <Shot ratio={1600 / 896} fit={0.6}>
                                <img src="/media/sengoku/battle.webp" alt="Mid-game: blue and red cities on a hex map with troop counts, armies marching along roads, and the city panel open" width={1600} height={896} loading="lazy" className="block w-full h-auto" />
                            </Shot>
                        </Rise>
                    </div>
                    <Rise delay={120} className="lg:col-span-7">
                        <dl className="m-0 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                            {RULES.map((r) => (
                                <div key={r.t} className="flex flex-col gap-2">
                                    <dt className="text-[clamp(20px,1.7vw,24px)] font-semibold tracking-[-0.02em]">{r.t}</dt>
                                    <dd className="m-0 text-[17px] leading-[1.55]">{r.d}</dd>
                                </div>
                            ))}
                        </dl>
                    </Rise>
                </div>
            </section>

            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="siege">
                <SectionHead id="siege" title="Will the city fall?">
                    <p className="m-0">
                        Battles use square-root attrition: each cycle, a side loses troops in proportion to the square root of the other
                        side’s size, and walls soften the blow. Set up a siege and watch it play out with the game’s own rules.
                    </p>
                </SectionHead>
                <Rise delay={120} className="mt-12"><SiegeSim /></Rise>
            </section>

            <section className="mt-[clamp(96px,12vw,200px)] bg-card py-[clamp(72px,9vw,140px)]" aria-labelledby="levels">
                <div className={`${frame} flex flex-col gap-12`}>
                    <div className="grid gap-10 lg:grid-cols-12 items-start">
                        <div className="lg:col-span-5">
                            <SectionHead id="levels" title="Levels are data">
                                <p className="m-0">
                                    A level isn’t a scene someone painted by hand. It’s a <code className="font-mono text-[0.9em]">LevelData</code> resource:
                                    a list of cities and a list of roads, built from three small classes. The same file feeds the game, the
                                    AI and the level editor.
                                </p>
                                <p className="m-0">
                                    To make those files, we wrote <strong>HexLevelEditor</strong>, an editor plugin (about 600 lines) that runs inside
                                    Godot’s own 2D view. Click a hex to place a city, click two cities to toggle a road (its length comes from the
                                    hex distance), hold T to paint terrain. It writes straight into the level’s resource: no export step, no
                                    hand-edited JSON.
                                </p>
                            </SectionHead>
                        </div>
                        <Rise delay={90} className="lg:col-span-7 min-w-0">
                            <pre className="m-0 p-6 md:p-8 rounded-2xl bg-canvas overflow-x-auto text-[13.5px] leading-[1.6] min-w-0"><code className="font-mono">{LEVEL_CLASSES}</code></pre>
                        </Rise>
                    </div>
                    <Rise delay={120} className="flex flex-col gap-4">
                        <h3 className="m-0 text-[clamp(22px,2vw,30px)] font-semibold tracking-[-0.02em]">Try the editor</h3>
                        <p className="m-0 text-[16px] leading-[1.6] max-w-[70ch] text-muted">
                            A miniature of the plugin, with its rules and status messages, writing the same resource format.
                        </p>
                        <LevelEditorDemo />
                    </Rise>
                </div>
            </section>

            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="ai">
                <div className="grid gap-10 lg:grid-cols-12 items-start">
                    <div className="lg:col-span-5">
                        <SectionHead id="ai" title="The AI’s map of the front">
                            <p className="m-0">
                                Every 14 cycles the AI re-derives its frontier. A breadth-first search over the road graph, starting from
                                every AI city that touches someone else’s, gives each of its cities a distance from the fighting.
                            </p>
                            <p className="m-0">
                                That one map drives everything. Rear cities funnel reinforcements one hop forward. Frontier cities
                                intercept armies marching at them, attack when the odds after defence reach 0.8, or hold. Upgrades go
                                to the cheapest affordable track, with defence only where a city is threatened.
                            </p>
                        </SectionHead>
                    </div>
                    <Rise delay={90} className="lg:col-span-7 min-w-0">
                        <pre className="m-0 p-6 md:p-8 rounded-2xl bg-card overflow-x-auto text-[13.5px] leading-[1.6] min-w-0"><code className="font-mono">{AI_SNIPPET}</code></pre>
                    </Rise>
                </div>
                <Rise delay={120} className="mt-12"><FrontierMap /></Rise>
            </section>

            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="built">
                <SectionHead id="built" title="Core systems">
                    <p className="m-0">
                        About 4,700 lines of GDScript, plus the editor plugin. Six systems, one shared clock, and no system holding a
                        direct reference to another.
                    </p>
                </SectionHead>
                <Rise delay={90} className="mt-12">
                    <dl className="m-0 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                        {SYSTEMS.map((s) => (
                            <div key={s.t} className="flex flex-col gap-2">
                                <dt className="flex flex-col gap-1">
                                    <span className="text-[clamp(20px,1.7vw,24px)] font-semibold tracking-[-0.02em]">{s.t}</span>
                                    <code className="font-mono text-[13px] text-muted">{s.f}</code>
                                </dt>
                                <dd className="m-0 text-[16px] leading-[1.6]">{s.d}</dd>
                            </div>
                        ))}
                    </dl>
                </Rise>
            </section>

            <section className={`${frame} pt-[clamp(96px,12vw,200px)]`} aria-labelledby="media">
                <SectionHead id="media" title="Made from scratch">
                    <p className="m-0">
                        A multimedia game in five media, all made in-house: graphics, animation, audio, text and video. Hover the
                        sprites, switch the soldier’s animation, and play the sounds.
                    </p>
                </SectionHead>
                <Rise delay={120} className="mt-12"><MediaSection filmHref="#film" /></Rise>
            </section>

            <section className={`${frame} pt-[clamp(96px,12vw,200px)] pb-[clamp(96px,12vw,200px)] grid gap-12 lg:grid-cols-12`} aria-labelledby="team">
                <div className="lg:col-span-6">
                    <SectionHead id="team" title="Made by two">
                        <p className="m-0">
                            Built by Oliver Krisetya and Warren Nguyen for CSCI 6562 at George Washington University in spring 2026.
                            The gameplay film was a joint effort.
                        </p>
                        <dl className="m-0 grid gap-6 sm:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <dt className="text-[18px] font-semibold">Oliver Krisetya</dt>
                                <dd className="m-0 text-[16px] leading-[1.6]">Pixel art and animation, music and sound effects, the interface text. Co-designed city selection, troop movement and combat.</dd>
                            </div>
                            <div className="flex flex-col gap-2">
                                <dt className="text-[18px] font-semibold">Warren Nguyen</dt>
                                <dd className="m-0 text-[16px] leading-[1.6]">Core gameplay concept, the tutorial text and the tutorial videos.</dd>
                            </div>
                        </dl>
                    </SectionHead>
                </div>
                <Rise delay={120} className="lg:col-span-6 self-end">
                    <Link to="/projects/easy-sched" className="group block rounded-2xl bg-card p-8 md:p-10 no-underline text-main hover:bg-raised transition-colors">
                        <span className="flex items-baseline justify-between gap-4 text-[clamp(26px,3vw,44px)] font-semibold tracking-[-0.03em] leading-[1.05]">
                            Next: Easy-Sched
                            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                        </span>
                        <span className="block mt-3 text-[16px] text-muted">An optimal TA-assignment platform with a live solver.</span>
                    </Link>
                </Rise>
            </section>
        </article>
    );
}
