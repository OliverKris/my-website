import { useEffect, useRef, useState, type ReactNode } from "react";

/*
  "Made from scratch": the game's five media, each shown with the real asset.
  Sprites are copied from Sprites/ in the game repo and drawn with nearest-neighbour scaling;
  animation strips play at the frame rates in World/Unit/Unit.gd; sounds are the game's own
  WAVs encoded to MP3.
*/

const SP = "/media/sengoku/sprites/";
const AU = "/media/sengoku/audio/";

/** One frame-strip animation, scaled up with crisp pixels. */
function Strip({ src, fw, fh, frames, fps, scale, label, play = true }: {
    src: string; fw: number; fh: number; frames: readonly number[]; fps: number; scale: number; label: string; play?: boolean;
}) {
    const [tick, setTick] = useState(0);
    const i = tick % frames.length;
    const [stripW, setStripW] = useState(0);
    useEffect(() => {
        const img = new Image();
        img.onload = () => setStripW(img.naturalWidth);
        img.src = src;
    }, [src]);
    useEffect(() => {
        if (!play || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const t = window.setInterval(() => setTick((n) => n + 1), 1000 / fps);
        return () => window.clearInterval(t);
    }, [fps, play]);
    return (
        <span role="img" aria-label={label} className="inline-block shrink-0"
            style={{
                width: fw * scale, height: fh * scale, imageRendering: "pixelated",
                backgroundImage: `url(${src})`, backgroundRepeat: "no-repeat",
                backgroundSize: stripW ? `${stripW * scale}px ${fh * scale}px` : undefined,
                backgroundPosition: `${-frames[i] * fw * scale}px 0`,
            }} />
    );
}

function Sprite({ name, w, h, scale, label }: { name: string; w: number; h: number; scale: number; label: string }) {
    return <img src={`${SP}${name}.png`} alt={label} title={label} width={w * scale} height={h * scale} loading="lazy" className="block" style={{ imageRendering: "pixelated" }} />;
}

function Card({ title, who, tool, className = "", children }: { title: string; who: string; tool?: string; className?: string; children: ReactNode }) {
    return (
        <article className={`min-w-0 rounded-2xl bg-card p-6 md:p-8 flex flex-col gap-5 ${className}`}>
            <header className="flex flex-col gap-1">
                <h3 className="m-0 text-[clamp(22px,2vw,28px)] font-semibold tracking-[-0.02em]">{title}</h3>
                <p className="m-0 text-[14px] text-muted">{who}{tool && <> · {tool}</>}</p>
            </header>
            {children}
        </article>
    );
}

const range = (a: number, n: number) => Array.from({ length: n }, (_, k) => a + k);
const SOLDIER = {
    walk: { frames: range(0, 4), fps: 8, label: "Walk", note: "4 frames · 8 fps" },
    attack: { frames: range(4, 7), fps: 10, label: "Attack", note: "7 frames · 10 fps" },
    death: { frames: range(11, 4), fps: 10, label: "Death", note: "4 frames · 10 fps" },
} as const;
type Action = keyof typeof SOLDIER;

const SFX = [
    { file: "SelectCity", label: "Select a city" },
    { file: "Depart", label: "Troops depart" },
    { file: "Attack", label: "Attack order" },
    { file: "Upgrade", label: "Upgrade" },
    { file: "CityCapturePlayer", label: "City captured" },
    { file: "SpeedUp", label: "Speed up" },
    { file: "Victory", label: "Victory" },
    { file: "Defeat", label: "Defeat" },
];

function SoundBoard() {
    const theme = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);
    const [last, setLast] = useState<string | null>(null);
    useEffect(() => () => { theme.current?.pause(); }, []);
    const toggleTheme = () => {
        if (!theme.current) {
            theme.current = new Audio(`${AU}theme.mp3`);
            theme.current.loop = true;
            theme.current.volume = 0.7;
        }
        if (playing) { theme.current.pause(); setPlaying(false); }
        else { theme.current.play().then(() => setPlaying(true)).catch(() => setPlaying(false)); }
    };
    const play = (file: string) => {
        const a = new Audio(`${AU}${file}.mp3`);
        a.volume = 0.8;
        a.play().catch(() => { /* blocked until the visitor interacts; they just did */ });
        setLast(file);
        window.setTimeout(() => setLast((l) => (l === file ? null : l)), 500);
    };
    return (
        <div className="flex flex-col gap-4">
            <button type="button" onClick={toggleTheme} aria-pressed={playing}
                className="flex items-center gap-4 rounded-xl bg-canvas p-4 text-left cursor-pointer hover:bg-raised transition-colors">
                <span className={`grid place-items-center w-11 h-11 rounded-full shrink-0 ${playing ? "bg-accent text-accent-ink" : "bg-main text-canvas"}`} aria-hidden="true">
                    {playing
                        ? <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="1" width="3.5" height="12" fill="currentColor" /><rect x="8.5" y="1" width="3.5" height="12" fill="currentColor" /></svg>
                        : <svg width="14" height="16" viewBox="0 0 14 16"><path d="M2 1v14l11-7z" fill="currentColor" /></svg>}
                </span>
                <span className="flex flex-col">
                    <span className="text-[16px] font-semibold">The theme</span>
                    <span className="text-[13px] text-muted">One loop for the menu and the battlefield · {playing ? "playing" : "8.7 s, loops"}</span>
                </span>
                {playing && (
                    <span className="ml-auto flex items-end gap-[3px] h-5" aria-hidden="true">
                        {[0, 1, 2, 3].map((k) => <span key={k} className="w-[3px] bg-accent rounded-full eq" style={{ animationDelay: `${k * 0.15}s` }} />)}
                    </span>
                )}
            </button>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SFX.map((s) => (
                    <button key={s.file} type="button" onClick={() => play(s.file)}
                        className={`h-12 px-3 rounded-xl text-[13.5px] leading-tight cursor-pointer transition-colors ${last === s.file ? "bg-accent text-accent-ink" : "bg-canvas text-main hover:bg-raised"}`}>
                        {s.label}
                    </button>
                ))}
            </div>
            <style>{`@keyframes eq { 0%,100% { height: 25%; } 50% { height: 100%; } } .eq { animation: eq 0.8s ease-in-out infinite; height: 40%; }
                @media (prefers-reduced-motion: reduce) { .eq { animation: none; } }`}</style>
        </div>
    );
}

export function MediaSection({ filmHref }: { filmHref: string }) {
    const [action, setAction] = useState<Action>("walk");
    const a = SOLDIER[action];
    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12" data-ui>
            <Card title="Graphics" who="Oliver" tool="Aseprite" className="lg:col-span-7">
                <p className="m-0 text-[16px] leading-[1.6]">
                    All 69 sprites are hand-drawn pixel art: cities, hex tiles, buttons, icons and the interface frames. The clan
                    crests are original designs inspired by real Japanese <i>mon</i>.
                </p>
                <div className="rounded-xl bg-canvas p-5 flex flex-wrap items-end gap-x-6 gap-y-5">
                    <Sprite name="mitsudomoe" w={32} h={32} scale={3} label="Blue clan crest (mitsudomoe)" />
                    <Sprite name="mitsuboshi" w={32} h={32} scale={3} label="Red clan crest (mitsuboshi)" />
                    <Sprite name="maru" w={32} h={32} scale={3} label="Neutral crest (maru)" />
                    <Sprite name="mitsudomoebanner" w={48} h={56} scale={2} label="Clan banner" />
                    <Sprite name="city" w={32} h={32} scale={3} label="City" />
                    <span className="flex items-end gap-4">
                        <Sprite name="goldicon" w={16} h={16} scale={3} label="Gold icon" />
                        <Sprite name="troopicon" w={16} h={16} scale={3} label="Troops icon" />
                        <Sprite name="defenseicon" w={16} h={16} scale={3} label="Defense icon" />
                        <Sprite name="unitproductionicon" w={16} h={16} scale={3} label="Production icon" />
                        <Sprite name="cursor" w={16} h={16} scale={3} label="Cursor" />
                    </span>
                    <span className="flex items-end gap-3">
                        <Strip src={`${SP}playbtn.png`} fw={48} fh={16} frames={[0]} fps={1} scale={3} label="Play button" play={false} />
                        <Strip src={`${SP}upgradebtn.png`} fw={16} fh={18} frames={[0]} fps={1} scale={3} label="Upgrade button" play={false} />
                    </span>
                </div>
                <p className="m-0 text-[13px] text-muted">The menu and handbook backdrops are public-domain Edo-period woodblock prints, including Hokusai’s <i>The Great Wave off Kanagawa</i>.</p>
            </Card>

            <Card title="Animation" who="Oliver" tool="Aseprite" className="lg:col-span-5">
                <div className="rounded-xl bg-canvas p-5 flex flex-wrap items-center gap-6">
                    <Strip src={`${SP}unit.png`} fw={16} fh={16} frames={a.frames} fps={a.fps} scale={7} label={`Soldier ${a.label.toLowerCase()} animation`} />
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Soldier animation">
                            {(Object.keys(SOLDIER) as Action[]).map((k) => (
                                <button key={k} type="button" aria-pressed={action === k} onClick={() => setAction(k)}
                                    className={`h-9 px-3 rounded-full text-[13.5px] cursor-pointer transition-colors ${action === k ? "bg-main text-canvas" : "bg-card text-main hover:bg-raised"}`}>
                                    {SOLDIER[k].label}
                                </button>
                            ))}
                        </div>
                        <span className="text-[13px] text-muted tabular-nums">{a.note}, from one 15-frame strip</span>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <Strip src={`${SP}clock.png`} fw={32} fh={32} frames={range(0, 8)} fps={4} scale={2} label="Game clock animation" />
                    <Strip src={`${SP}balance.png`} fw={32} fh={32} frames={[0, 1, 2, 3, 4, 3, 2, 1]} fps={3} scale={2} label="Balance of power icon tipping" />
                    <p className="m-0 text-[14px] leading-[1.5] text-muted">The game clock and the balance of power, which tips as cities change hands.</p>
                </div>
                <p className="m-0 text-[15px] leading-[1.6]">
                    Also: button presses, scene transitions, city animations, the drag-to-send line and the interface itself.
                </p>
            </Card>

            <Card title="Audio" who="Oliver" tool="Ableton Live 12" className="lg:col-span-7">
                <p className="m-0 text-[16px] leading-[1.6]">
                    Every sound is synthesised from scratch: the theme that plays on the menu and the battlefield, and 18 sound
                    effects for clicks, marches, battles, captures, transitions and the clock. Tap to hear them.
                </p>
                <SoundBoard />
            </Card>

            <Card title="Text" who="Warren wrote the story and tutorial; Oliver designed the text" className="lg:col-span-5">
                <img src="/media/sengoku/handbook.webp" alt="The Commander's Handbook: Japan is in chaos, your father has died, and your brother is propped up as a rival claimant. Fight him and the neutral governors to reclaim your father's territory, then face a neighbouring daimyo." width={1200} height={527} loading="lazy" className="block w-full h-auto rounded-xl" />
                <p className="m-0 text-[15px] leading-[1.6]">
                    The Commander’s Handbook frames the campaign: an heir fighting a pretender brother, then a rival daimyo. The
                    tutorial teaches time, upgrades and troop movement as a mission checklist. The interface is set in Cozette, an
                    open-source pixel font.
                </p>
            </Card>

            <Card title="Video" who="Warren" className="lg:col-span-12 lg:py-6">
                <div className="grid gap-5 md:grid-cols-12 items-center">
                    <p className="m-0 md:col-span-8 text-[16px] leading-[1.6] max-w-[60ch]">
                        Warren recorded the gameplay film at the top of this page: choosing a chapter, sending armies down the roads and
                        taking cities from the AI.
                    </p>
                    <a href={filmHref} className="md:col-span-4 group relative block rounded-xl overflow-hidden no-underline">
                        <img src="/media/sengoku/demo-poster.webp" alt="" width={1920} height={1076} loading="lazy" className="block w-full h-auto" />
                        <span className="absolute inset-0 grid place-items-center bg-black/30 group-hover:bg-black/20 transition-colors">
                            <span className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-canvas text-main text-[15px] font-medium">Watch the film ↑</span>
                        </span>
                    </a>
                </div>
            </Card>
        </div>
    );
}
