import { useMemo, useState } from "react";

/*
  The AI's frontier search on the real Chapter 2 map (LevelData/Level2/Level2.tres:
  17 cities, 24 roads), using the rules in Core/AIController.gd:

  - a city the AI owns is on the frontier if any neighbour belongs to someone else;
  - breadth-first search from the frontier gives every other AI city its distance
    from the fighting;
  - a rear city sends 30% of its troops to the neighbour one step closer to the
    front (ties go to the neighbour with fewer troops);
  - a frontier city attacks the neighbour with the best troops-to-defence ratio
    if that ratio is at least 0.8 (sending 60%), otherwise it holds. Defence
    multiplies by 1.0 / 1.3 / 1.6 / 2.0 by level; neutral cities count at 1.0.

  The in-game AI also intercepts armies already marching at a frontier city;
  this still map has no armies on the roads, so that rule never fires here.
*/

type Owner = 0 | 1 | 2; // neutral, player (blue), AI (red)

const CITIES: { id: number; q: number; r: number }[] = [
    { id: 14, q: 0, r: 0 }, { id: 15, q: -2, r: 0 }, { id: 16, q: 2, r: -2 }, { id: 17, q: 0, r: -2 },
    { id: 20, q: 0, r: 2 }, { id: 21, q: 2, r: 0 }, { id: 22, q: -2, r: 2 }, { id: 23, q: -2, r: 4 },
    { id: 24, q: 2, r: 2 }, { id: 27, q: -2, r: -2 }, { id: 28, q: 2, r: -4 }, { id: 29, q: 2, r: 4 },
    { id: 30, q: -2, r: 6 }, { id: 31, q: 4, r: 0 }, { id: 32, q: -4, r: 4 }, { id: 33, q: 4, r: 2 }, { id: 34, q: -4, r: 6 },
];
const ROADS: [number, number][] = [
    [23, 20], [20, 22], [22, 23], [24, 21], [21, 20], [20, 24], [20, 14], [14, 15], [15, 17], [17, 16], [16, 14], [17, 14],
    [15, 22], [21, 16], [23, 32], [32, 22], [31, 24], [31, 21], [33, 31], [33, 29], [30, 34], [34, 32], [17, 27], [17, 28],
];

/** A mid-game position: the AI holds the north and two southern outposts, the player the centre-south. */
const PRESET_OWNER: Record<number, Owner> = {
    14: 2, 15: 2, 16: 2, 17: 2, 27: 2, 28: 2, 29: 2, 30: 2,
    20: 1, 21: 1, 22: 1, 23: 1, 24: 1,
    31: 0, 32: 0, 33: 0, 34: 0,
};
const ARMY: Record<number, number> = {
    14: 40, 15: 20, 16: 18, 17: 30, 27: 22, 28: 24, 29: 12, 30: 20,
    20: 32, 21: 12, 22: 30, 23: 8, 24: 15,
    31: 20, 32: 20, 33: 20, 34: 20,
};

const ADJ: Record<number, number[]> = {};
for (const [a, b] of ROADS) {
    (ADJ[a] ??= []).push(b);
    (ADJ[b] ??= []).push(a);
}

/** Flat-top axial layout, as GraphMap.hex_to_world. */
const S = 34;
const pos = (q: number, r: number) => ({ x: S * 1.5 * q, y: S * Math.sqrt(3) * (r + q / 2) });

type Plan =
    | { kind: "relay"; to: number; dist: number }
    | { kind: "attack"; to: number; ratio: number }
    | { kind: "hold"; ratio: number | null }
    | { kind: "idle" };

function think(owner: Record<number, Owner>) {
    const ai = CITIES.filter((c) => owner[c.id] === 2).map((c) => c.id);
    const dist: Record<number, number> = {};
    const queue: number[] = [];
    for (const id of ai) {
        if (ADJ[id].some((n) => owner[n] !== 2)) {
            dist[id] = 0;
            queue.push(id);
        }
    }
    for (let head = 0; head < queue.length; head++) {
        const cur = queue[head];
        for (const n of ADJ[cur]) {
            if (owner[n] === 2 && dist[n] === undefined) {
                dist[n] = dist[cur] + 1;
                queue.push(n);
            }
        }
    }
    const plans: Record<number, Plan> = {};
    for (const id of ai) {
        if (ARMY[id] < 8) { plans[id] = { kind: "idle" }; continue; }
        const d = dist[id];
        if (d === undefined) { plans[id] = { kind: "idle" }; continue; } // cut off from any front
        if (d > 0) {
            let best: number | null = null, bestD = d, bestArmy = Infinity;
            for (const n of ADJ[id]) {
                if (owner[n] !== 2) continue;
                const nd = dist[n] ?? 9999;
                if (nd < bestD || (nd === bestD && ARMY[n] < bestArmy)) { best = n; bestD = nd; bestArmy = ARMY[n]; }
            }
            plans[id] = best !== null ? { kind: "relay", to: best, dist: d } : { kind: "idle" };
            continue;
        }
        let target: number | null = null, bestRatio = 0;
        for (const n of ADJ[id]) {
            if (owner[n] === 2) continue;
            const ratio = ARMY[id] / Math.max(ARMY[n] * 1.0, 1); // every city here is at defence level 0
            if (ratio > bestRatio) { bestRatio = ratio; target = n; }
        }
        plans[id] = target !== null && bestRatio >= 0.8 ? { kind: "attack", to: target, ratio: bestRatio } : { kind: "hold", ratio: target !== null ? bestRatio : null };
    }
    return { dist, plans };
}

function Arrow({ from, to, kind }: { from: number; to: number; kind: "relay" | "attack" }) {
    const a = CITIES.find((c) => c.id === from)!, b = CITIES.find((c) => c.id === to)!;
    const p = pos(a.q, a.r), q = pos(b.q, b.r);
    const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy);
    const ux = dx / len, uy = dy / len, r0 = 19, r1 = 25;
    const x1 = p.x + ux * r0, y1 = p.y + uy * r0, x2 = q.x - ux * r1, y2 = q.y - uy * r1;
    return (
        <g className={kind === "relay" ? "text-accent" : "text-main"}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={kind === "relay" ? 3 : 3.5} strokeLinecap="round"
                strokeDasharray={kind === "relay" ? "2 7" : undefined} className={kind === "relay" ? "march" : undefined} />
            <path d={`M${x2 + ux * 7},${y2 + uy * 7} L${x2 - uy * 6 - ux * 3},${y2 + ux * 6 - uy * 3} L${x2 + uy * 6 - ux * 3},${y2 - ux * 6 - uy * 3} Z`} fill="currentColor" />
        </g>
    );
}

export function FrontierMap() {
    const [owner, setOwner] = useState<Record<number, Owner>>(PRESET_OWNER);
    const [hover, setHover] = useState<number | null>(null);
    const { dist, plans } = useMemo(() => think(owner), [owner]);

    const pts = CITIES.map((c) => pos(c.q, c.r));
    const minX = Math.min(...pts.map((p) => p.x)) - 60, maxX = Math.max(...pts.map((p) => p.x)) + 60;
    const minY = Math.min(...pts.map((p) => p.y)) - 50, maxY = Math.max(...pts.map((p) => p.y)) + 50;

    // faint hex tiles behind the map, like the board
    const tiles: { x: number; y: number }[] = [];
    for (let q = -6; q <= 6; q++) for (let r = -8; r <= 10; r++) {
        const p = pos(q, r);
        if (p.x > minX - S && p.x < maxX + S && p.y > minY - S && p.y < maxY + S) tiles.push(p);
    }
    const hexPath = (cx: number, cy: number) =>
        Array.from({ length: 6 }, (_, i) => {
            const a = (Math.PI / 3) * i;
            return `${(cx + (S - 1.5) * Math.cos(a)).toFixed(1)},${(cy + (S - 1.5) * Math.sin(a)).toFixed(1)}`;
        }).join(" ");

    const cycle = (id: number) => setOwner((o) => ({ ...o, [id]: (((o[id] + 1) % 3) as Owner) }));
    const aiIds = CITIES.filter((c) => owner[c.id] === 2).map((c) => c.id).sort((a, b) => (dist[a] ?? 99) - (dist[b] ?? 99) || a - b);
    const describe = (id: number): string => {
        const p = plans[id];
        if (!p) return "";
        if (p.kind === "relay") return `${dist[id]} step${dist[id] === 1 ? "" : "s"} from the front → sends 30% to City ${p.to}`;
        if (p.kind === "attack") return `Frontier → attacks City ${p.to} with 60% (odds ${p.ratio.toFixed(2)})`;
        if (p.kind === "hold") return p.ratio === null ? "Frontier → holds" : `Frontier → holds (best odds ${p.ratio.toFixed(2)}, needs 0.80)`;
        return dist[id] === undefined ? "Cut off from the front → waits" : "Too few troops → waits";
    };
    const counts = { front: aiIds.filter((id) => dist[id] === 0).length, rear: aiIds.filter((id) => (dist[id] ?? 0) > 0).length };

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start" data-ui>
            <style>{`@keyframes march { to { stroke-dashoffset: -18; } } .march { animation: march 0.9s linear infinite; }
                @media (prefers-reduced-motion: reduce) { .march { animation: none; } }`}</style>
            <figure className="lg:col-span-7 m-0 rounded-2xl bg-card p-4 md:p-6">
                <svg viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`} className="block w-full h-auto text-main" role="img"
                    aria-label={`Chapter 2 map. The AI holds ${aiIds.length} cities: ${counts.front} on the frontier and ${counts.rear} behind it.`}>
                    <g className="fill-main" fillOpacity={0.035}>{tiles.map((t, i) => <polygon key={i} points={hexPath(t.x, t.y)} />)}</g>
                    <g stroke="currentColor" strokeOpacity={0.22} strokeWidth={5} strokeLinecap="round">
                        {ROADS.map(([a, b]) => {
                            const A = CITIES.find((c) => c.id === a)!, B = CITIES.find((c) => c.id === b)!;
                            const p = pos(A.q, A.r), q = pos(B.q, B.r);
                            return <line key={`${a}-${b}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} />;
                        })}
                    </g>
                    {Object.entries(plans).map(([id, p]) => (p.kind === "relay" || p.kind === "attack")
                        ? <Arrow key={`${id}-${p.kind}`} from={Number(id)} to={p.to} kind={p.kind} /> : null)}
                    {CITIES.map((c) => {
                        const p = pos(c.q, c.r), o = owner[c.id], d = dist[c.id];
                        const label = o === 2 ? "AI" : o === 1 ? "you" : "neutral";
                        return (
                            <g key={c.id} transform={`translate(${p.x},${p.y})`} className="cursor-pointer outline-none" tabIndex={0} role="button"
                                aria-label={`City ${c.id}, ${label}, ${ARMY[c.id]} troops${o === 2 && d !== undefined ? `, distance ${d} from the front` : ""}. Activate to change owner.`}
                                onClick={() => cycle(c.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); cycle(c.id); } }}
                                onMouseEnter={() => setHover(c.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(c.id)} onBlur={() => setHover(null)}>
                                <circle r={hover === c.id ? 21 : 19} className={o === 2 ? "fill-accent" : o === 1 ? "fill-main" : "fill-canvas"}
                                    stroke="currentColor" strokeOpacity={o === 0 ? 0.45 : 0} strokeWidth={2} style={{ transition: "r 120ms" }} />
                                <text y={5} textAnchor="middle" fontSize={14} fontWeight={600} className={o === 2 ? "fill-accent-ink" : o === 1 ? "fill-canvas" : "fill-main"}>{ARMY[c.id]}</text>
                                {o === 2 && d !== undefined && (
                                    <g transform="translate(16,-17)">
                                        <circle r={10} className="fill-canvas" stroke="currentColor" strokeOpacity={0.5} />
                                        <text y={4} textAnchor="middle" fontSize={11.5} fontWeight={700} className="fill-main">{d}</text>
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </svg>
                <figcaption className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-muted">
                    <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-accent" />AI city</span>
                    <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-main" />Your city</span>
                    <span className="inline-flex items-center gap-2"><span className="w-3 h-3 rounded-full ring-1 ring-main/50" />Neutral</span>
                    <span className="inline-flex items-center gap-2"><span className="inline-flex w-4 h-4 rounded-full ring-1 ring-main/50 text-[10px] font-bold items-center justify-center">1</span>Steps from the front</span>
                    <span className="inline-flex items-center gap-2"><span className="w-5 border-t-[3px] border-dotted border-accent" />Relay 30%</span>
                    <span className="inline-flex items-center gap-2"><span className="w-5 border-t-[3px] border-main" />Attack 60%</span>
                </figcaption>
            </figure>

            <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="flex items-center justify-between gap-3">
                    <p className="m-0 text-[15px] text-muted">Click a city to change who owns it. The AI re-plans instantly.</p>
                    <button type="button" onClick={() => setOwner(PRESET_OWNER)} className="shrink-0 h-10 px-4 rounded-full bg-card text-main text-[14px] cursor-pointer hover:bg-raised transition-colors">Reset</button>
                </div>
                <ol className="m-0 p-0 list-none flex flex-col rounded-2xl bg-card divide-y divide-main/10" aria-live="polite">
                    {aiIds.length === 0 && <li className="px-5 py-4 text-[15px] text-muted">The AI holds no cities.</li>}
                    {aiIds.map((id) => (
                        <li key={id} className={`px-5 py-3 flex gap-4 items-baseline text-[15px] transition-colors ${hover === id ? "bg-raised" : ""}`}
                            onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)}>
                            <span className="w-16 shrink-0 font-semibold tabular-nums">City {id}</span>
                            <span className="leading-[1.45]">{describe(id)}</span>
                        </li>
                    ))}
                </ol>
                <p className="m-0 text-[13px] text-muted leading-[1.5]">
                    Real map, real rules, one frozen moment: troop counts are a sample mid-game position. In the game the AI also
                    intercepts armies already marching at its frontier, and it re-plans every 14 cycles.
                </p>
            </div>
        </div>
    );
}
