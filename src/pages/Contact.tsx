import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { frame, Rise } from "../components/site/Rise";
import { RESUME_PDF } from "../components/site/Nav";

const FORM_ENDPOINT = "https://formspree.io/f/xvzpnjwv";

const TOPICS = [
    { key: "role", label: "A role on your team", prompt: "Tell me about the team and the role…", subject: "Role opportunity" },
    { key: "project", label: "One of my projects", prompt: "Which project, and what would you like to know?", subject: "About a project" },
    { key: "other", label: "Something else", prompt: "What’s on your mind?", subject: "Hello" },
] as const;

type Status = "idle" | "sending" | "sent" | "error";

const ZONE = "America/New_York"; // Washington, DC

function readLocalTime() {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { timeZone: ZONE, hour: "numeric", minute: "2-digit", second: "2-digit" });
    const hour = Number(now.toLocaleString("en-US", { timeZone: ZONE, hour: "numeric", hour12: false }));
    return { time, awake: hour >= 8 && hour < 23 };
}

/** The time where I am, ticking every second, so you know when to expect a reply. */
function useLocalTime() {
    const [state, setState] = useState(readLocalTime);
    useEffect(() => {
        const t = window.setInterval(() => setState(readLocalTime()), 1000);
        return () => window.clearInterval(t);
    }, []);
    return state;
}

const field = "w-full rounded-xl bg-card px-4 py-3.5 text-[17px] text-main border-2 border-transparent outline-none transition-colors focus:border-accent placeholder:text-muted/70";

export default function Contact() {
    const [topic, setTopic] = useState<(typeof TOPICS)[number]["key"]>("role");
    const [status, setStatus] = useState<Status>("idle");
    const { time, awake } = useLocalTime();
    const current = TOPICS.find((t) => t.key === topic)!;

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        setStatus("sending");
        try {
            const res = await fetch(FORM_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
            if (!res.ok) throw new Error(String(res.status));
            form.reset();
            setStatus("sent");
        } catch {
            setStatus("error");
        }
    }

    return (
        <div className="pb-[clamp(96px,12vw,200px)]">
            <header className={`${frame} pt-16 md:pt-24 grid gap-10 lg:grid-cols-12 items-end`}>
                <div className="lg:col-span-8">
                    <h1 className="m-0 font-semibold text-[length:var(--text-display)] leading-[0.92] tracking-[-0.05em]">
                        <span className="mask-line"><span>Let’s talk</span></span>
                    </h1>
                    <p className="mt-8 mb-0 text-[length:var(--text-lead)] leading-[1.35] tracking-[-0.01em] max-w-[36ch] fade-up" style={{ ["--fade-delay" as string]: "250ms" }}>
                        Hiring for a software engineering role, curious about a project, or just want to say hello: write here and
                        it comes straight to my inbox.
                    </p>
                </div>
                <div className="lg:col-span-4 flex flex-col gap-1 fade-up" style={{ ["--fade-delay" as string]: "350ms" }}>
                    <span className="text-[clamp(28px,2.8vw,40px)] font-semibold tracking-[-0.03em] tabular-nums" aria-live="off">{time}</span>
                    <span className="text-[15px] text-muted">
                        in Washington, DC. {awake ? "I usually reply within a day." : "I’m probably asleep, so expect a reply in the morning."}
                    </span>
                </div>
            </header>

            <section className={`${frame} pt-[clamp(64px,8vw,120px)] grid gap-12 lg:grid-cols-12 items-start`} aria-labelledby="message">
                <Rise className="lg:col-span-7">
                    <h2 id="message" className="sr-only">Send a message</h2>
                    {status === "sent" ? (
                        <div className="rounded-2xl bg-accent text-accent-ink p-8 md:p-10 flex flex-col gap-4 fade-up" role="status">
                            <p className="m-0 text-[clamp(28px,3vw,44px)] font-semibold tracking-[-0.03em] leading-[1.05]">Thanks, it’s on its way.</p>
                            <p className="m-0 text-[17px]">I’ll reply to the email you gave. In the meantime, the work is a click away.</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                                <Link to="/projects" className="inline-flex items-center h-11 px-5 rounded-full bg-accent-ink text-accent text-[15px] font-semibold no-underline">See the work</Link>
                                <button type="button" onClick={() => setStatus("idle")} className="h-11 px-4 rounded-full text-accent-ink underline underline-offset-4 text-[15px] cursor-pointer">Send another</button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={submit} action={FORM_ENDPOINT} method="POST" className="flex flex-col gap-6" data-ui>
                            <fieldset className="m-0 p-0 border-0 flex flex-col gap-3">
                                <legend className="p-0 mb-3 text-[17px] font-semibold">What’s it about?</legend>
                                <div className="flex flex-wrap gap-2">
                                    {TOPICS.map((t) => (
                                        <label key={t.key} className={`h-11 px-4 inline-flex items-center rounded-full text-[15px] cursor-pointer transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                                            topic === t.key ? "bg-main text-canvas" : "bg-card text-main hover:bg-raised"}`}>
                                            <input type="radio" name="topic" value={t.label} checked={topic === t.key} onChange={() => setTopic(t.key)} className="sr-only" />
                                            {t.label}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                            <input type="hidden" name="_subject" value={`Portfolio: ${current.subject}`} />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="flex flex-col gap-2 text-[15px] font-medium">
                                    First name
                                    <input className={field} type="text" name="firstName" autoComplete="given-name" required />
                                </label>
                                <label className="flex flex-col gap-2 text-[15px] font-medium">
                                    Last name
                                    <input className={field} type="text" name="lastName" autoComplete="family-name" required />
                                </label>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="flex flex-col gap-2 text-[15px] font-medium">
                                    Email
                                    <input className={field} type="email" name="email" autoComplete="email" required />
                                </label>
                                <label className="flex flex-col gap-2 text-[15px] font-medium">
                                    <span>Phone <span className="font-normal text-muted">(optional)</span></span>
                                    <input className={field} type="tel" name="phone" autoComplete="tel" />
                                </label>
                            </div>
                            <label className="flex flex-col gap-2 text-[15px] font-medium">
                                Message
                                <textarea className={`${field} resize-y`} name="message" rows={6} required placeholder={current.prompt} />
                            </label>

                            <div className="flex flex-wrap items-center gap-4">
                                <button type="submit" disabled={status === "sending"}
                                    className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-accent text-accent-ink text-[16px] font-medium cursor-pointer transition-transform hover:scale-[1.03] active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait">
                                    {status === "sending" ? "Sending…" : <>Send message <span aria-hidden="true">→</span></>}
                                </button>
                                {status === "error" && (
                                    <p role="alert" className="m-0 text-[15px]">
                                        That didn’t go through. Try again, or reach me on{" "}
                                        <a className="text-accent underline underline-offset-4" href="https://linkedin.com/in/okrisetya" target="_blank" rel="noopener noreferrer">LinkedIn</a>.
                                    </p>
                                )}
                            </div>
                        </form>
                    )}
                </Rise>

                <Rise delay={120} className="lg:col-span-5 flex flex-col gap-3">
                    <h2 className="m-0 mb-2 text-[17px] font-semibold">Or find me here</h2>
                    {[
                        { href: "https://linkedin.com/in/okrisetya", label: "LinkedIn", note: "linkedin.com/in/okrisetya", ext: true },
                        { href: "https://github.com/OliverKris", label: "GitHub", note: "github.com/OliverKris", ext: true },
                        { href: RESUME_PDF, label: "Résumé", note: "One-page PDF, July 2026", ext: true },
                    ].map((l, i) => (
                        <Rise key={l.label} delay={160 + i * 80}>
                        <a href={l.href} target={l.ext ? "_blank" : undefined} rel="noopener noreferrer"
                            className="group flex items-center justify-between gap-4 rounded-2xl bg-card px-6 py-5 text-main no-underline hover:bg-raised transition-colors">
                            <span className="flex flex-col gap-0.5">
                                <span className="text-[clamp(22px,2vw,28px)] font-semibold tracking-[-0.02em]">{l.label}</span>
                                <span className="text-[15px] text-muted">{l.note}</span>
                            </span>
                            <span aria-hidden="true" className="text-[22px] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                        </a>
                        </Rise>
                    ))}
                </Rise>
            </section>
        </div>
    );
}
