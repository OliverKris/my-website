import { useState } from "react";

/*
  A miniature of addons/HexLevelEditor: the same rules as HexEditorOverlay.gd, in the page.
  - City mode: click an empty hex to append a CitySpawnData; click a city to remove it
    (the plugin uses right-click) along with every road that touches it.
  - Road mode: click one city, then another, to toggle a RoadData between them. Its length
    is the hex distance, as in _handle_road_click.
  The panel on the right is the LevelData resource those clicks write, in .tres form.
  Status messages are the plugin's own strings.
*/

interface City { id: number; q: number; r: number; owner: number; army: number }
interface Road { a: number; b: number; length: number }

const R = 3; // board radius in hexes
const S = 30;
const pos = (q: number, r: number) => ({ x: S * 1.5 * q, y: S * Math.sqrt(3) * (r + q / 2) });
const hexDist = (a: { q: number; r: number }, b: { q: number; r: number }) =>
    (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
const BOARD: { q: number; r: number }[] = [];
for (let q = -R; q <= R; q++) for (let r = Math.max(-R, -q - R); r <= Math.min(R, -q + R); r++) BOARD.push({ q, r });

const OWNERS = ["Neutral", "Blue (you)", "Red (AI)"];
const START_CITIES: City[] = [
    { id: 1, q: 0, r: 2, owner: 1, army: 20 }, { id: 2, q: -2, r: 1, owner: 0, army: 10 },
    { id: 3, q: 2, r: -1, owner: 0, army: 10 }, { id: 4, q: 0, r: -2, owner: 2, army: 20 },
];
const road = (a: number, b: number): Road => ({ a, b, length: hexDist(START_CITIES[a - 1], START_CITIES[b - 1]) });
const START = { cities: START_CITIES, roads: [road(1, 2), road(2, 4)] };

function hexPoints(cx: number, cy: number, s: number) {
    return Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 3) * i;
        return `${(cx + s * Math.cos(a)).toFixed(1)},${(cy + s * Math.sin(a)).toFixed(1)}`;
    }).join(" ");
}

export function LevelEditorDemo() {
    const [cities, setCities] = useState<City[]>(START.cities);
    const [roads, setRoads] = useState<Road[]>(START.roads);
    const [mode, setMode] = useState<"city" | "road">("road");
    const [owner, setOwner] = useState(2);
    const [first, setFirst] = useState<number | null>(null);
    const [status, setStatus] = useState("Road mode: click a city, then a second city, to toggle a road.");
    const [hover, setHover] = useState<string | null>(null);

    const at = (q: number, r: number) => cities.find((c) => c.q === q && c.r === r);
    const name = (id: number) => `City ${id}`;

    const click = (q: number, r: number) => {
        const here = at(q, r);
        if (mode === "city") {
            if (here) {
                setCities(cities.filter((c) => c.id !== here.id));
                setRoads(roads.filter((rd) => rd.a !== here.id && rd.b !== here.id));
                if (first === here.id) setFirst(null);
                setStatus(`Removed city at (${q},${r})`);
            } else {
                const id = Math.max(0, ...cities.map((c) => c.id)) + 1;
                setCities([...cities, { id, q, r, owner, army: owner === 0 ? 10 : 20 }]);
                setStatus(`Placed '${name(id)}' at (${q},${r})`);
            }
            return;
        }
        if (!here) { setStatus("No city here. Click a city to start a road."); return; }
        if (first === null) { setFirst(here.id); setStatus(`Road from '${name(here.id)}' — click second city to toggle.`); return; }
        if (first === here.id) { setFirst(null); setStatus("Cancelled."); return; }
        const a = first, b = here.id;
        setFirst(null);
        const existing = roads.findIndex((rd) => (rd.a === a && rd.b === b) || (rd.a === b && rd.b === a));
        if (existing >= 0) {
            setRoads(roads.filter((_, i) => i !== existing));
            setStatus(`Removed road: ${name(a)} <-> ${name(b)}`);
        } else {
            const A = cities.find((c) => c.id === a)!, B = here;
            const length = hexDist(A, B);
            setRoads([...roads, { a, b, length }]);
            setStatus(`Added road: ${name(a)} <-> ${name(b)} (len ${length.toFixed(2)})`);
        }
    };

    const tres = [
        `[gd_resource type="Resource" script_class="LevelData"]`,
        ``,
        ...cities.flatMap((c) => [
            `[sub_resource type="Resource" id="City_${c.id}"]`,
            `script = ExtResource("CitySpawnData")`,
            `id = ${c.id}`,
            `city_name = "City ${c.id}"`,
            `hex_coord = Vector2(${c.q}, ${c.r})`,
            ...(c.owner ? [`owner = ${c.owner}`] : []),
            `army = ${c.army}`,
            ``,
        ]),
        ...roads.flatMap((rd, i) => [
            `[sub_resource type="Resource" id="Road_${i + 1}"]`,
            `script = ExtResource("RoadData")`,
            `a_id = ${rd.a}`,
            `b_id = ${rd.b}`,
            `length = ${rd.length.toFixed(1)}`,
            ``,
        ]),
        `[resource]`,
        `script = ExtResource("LevelData")`,
        `level_name = "My Level"`,
        `cities = [${cities.map((c) => `SubResource("City_${c.id}")`).join(", ")}]`,
        `roads = [${roads.map((_, i) => `SubResource("Road_${i + 1}")`).join(", ")}]`,
    ].join("\n");

    const pts = BOARD.map((h) => pos(h.q, h.r));
    const pad = S + 6;
    const box = [Math.min(...pts.map((p) => p.x)) - pad, Math.min(...pts.map((p) => p.y)) - pad,
        Math.max(...pts.map((p) => p.x)) - Math.min(...pts.map((p) => p.x)) + pad * 2,
        Math.max(...pts.map((p) => p.y)) - Math.min(...pts.map((p) => p.y)) + pad * 2];

    const seg = (on: boolean) => `h-10 px-4 rounded-full text-[14px] cursor-pointer transition-colors ${on ? "bg-main text-canvas" : "bg-card text-main hover:bg-raised"}`;

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start" data-ui>
            <div className="lg:col-span-6 rounded-2xl bg-canvas p-5 md:p-6 flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] text-muted mr-1">Mode</span>
                    <button type="button" className={seg(mode === "city")} onClick={() => { setMode("city"); setFirst(null); setStatus("City mode: click an empty hex to place a city, click a city to remove it."); }}>City</button>
                    <button type="button" className={seg(mode === "road")} onClick={() => { setMode("road"); setStatus("Road mode: click a city, then a second city, to toggle a road."); }}>Road</button>
                    {mode === "city" && (
                        <label className="ml-auto flex items-center gap-2 text-[13px] text-muted">Owner
                            <select value={owner} onChange={(e) => setOwner(Number(e.target.value))} className="h-10 px-3 rounded-full bg-card text-main text-[14px] border-0 cursor-pointer">
                                {OWNERS.map((o, i) => <option key={o} value={i}>{o}</option>)}
                            </select>
                        </label>
                    )}
                </div>
                <svg viewBox={box.join(" ")} className="block w-full h-auto text-main select-none" role="group" aria-label="Hex level editor board">
                    {BOARD.map(({ q, r }) => {
                        const p = pos(q, r), k = `${q},${r}`;
                        return (
                            <polygon key={k} points={hexPoints(p.x, p.y, S - 1.5)} className="cursor-pointer outline-none"
                                fill="currentColor" fillOpacity={hover === k ? 0.14 : 0.05} stroke="currentColor" strokeOpacity={0.14}
                                tabIndex={0} role="button" aria-label={`Hex (${q}, ${r})${at(q, r) ? `, ${name(at(q, r)!.id)}` : ""}`}
                                onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)}
                                onClick={() => click(q, r)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); click(q, r); } }} />
                        );
                    })}
                    <g stroke="currentColor" strokeOpacity={0.5} strokeWidth={4} strokeLinecap="round" pointerEvents="none">
                        {roads.map((rd) => {
                            const A = cities.find((c) => c.id === rd.a), B = cities.find((c) => c.id === rd.b);
                            if (!A || !B) return null;
                            const p = pos(A.q, A.r), q = pos(B.q, B.r);
                            return <line key={`${rd.a}-${rd.b}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} />;
                        })}
                    </g>
                    {cities.map((c) => {
                        const p = pos(c.q, c.r);
                        return (
                            <g key={c.id} transform={`translate(${p.x},${p.y})`} pointerEvents="none">
                                {first === c.id && <circle r={20} fill="none" className="stroke-accent" strokeWidth={3} strokeDasharray="4 4" />}
                                <circle r={14} className={c.owner === 2 ? "fill-accent" : c.owner === 1 ? "fill-main" : "fill-canvas"} stroke="currentColor" strokeOpacity={c.owner === 0 ? 0.5 : 0} strokeWidth={2} />
                                <text y={4.5} textAnchor="middle" fontSize={12} fontWeight={700} className={c.owner === 2 ? "fill-accent-ink" : c.owner === 1 ? "fill-canvas" : "fill-main"}>{c.id}</text>
                            </g>
                        );
                    })}
                </svg>
                <p className="m-0 min-h-[1.5em] font-mono text-[13px] text-muted" role="status">{status}</p>
            </div>
            <div className="lg:col-span-6 flex flex-col gap-3 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[13px] text-muted">my_level.tres</span>
                    <span className="text-[13px] text-muted">{cities.length} cities · {roads.length} roads</span>
                </div>
                <pre className="m-0 p-5 rounded-2xl bg-canvas overflow-auto max-h-[440px] text-[12.5px] leading-[1.55] min-w-0"><code className="font-mono">{tres}</code></pre>
                <button type="button" onClick={() => { setCities(START.cities); setRoads(START.roads); setFirst(null); setStatus("Reset."); }}
                    className="self-start h-10 px-4 rounded-full bg-canvas text-main text-[14px] cursor-pointer hover:bg-raised transition-colors">Reset level</button>
            </div>
        </div>
    );
}
