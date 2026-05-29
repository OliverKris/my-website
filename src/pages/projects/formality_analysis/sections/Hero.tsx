import { useEffect, useRef, useState } from 'react';
import '../formality.css';

type Segment =
    | { text: string; formal: false }
    | { text: string; formal: true; casual: string };

const SEGMENTS: Segment[] = [
    { text: "I would be delighted to ", formal: false },
    { text: "elucidate",  formal: true,  casual: "explain"  },
    { text: " the matter. To ",          formal: false },
    { text: "commence",   formal: true,  casual: "start"    },
    { text: ", let us ",                 formal: false },
    { text: "delve into", formal: true,  casual: "get into" },
    { text: " the core concepts.",       formal: false },
];

function sleep(ms: number) {
    return new Promise<void>(r => setTimeout(r, ms));
}

export default function Hero() {
    type Phase = 'idle' | 'question' | 'typing' | 'striking' | 'revealed';
    const [phase, setPhase] = useState<Phase>('idle');

    const bubbleRef  = useRef<HTMLDivElement>(null);
    const cursorRef  = useRef<HTMLSpanElement>(null);
    const formalRefs = useRef<{ el: HTMLSpanElement; casual: string }[]>([]);

    useEffect(() => {
        let cancelled = false;

        async function run() {
            await sleep(400);
            if (cancelled) return;
            setPhase('question');

            await sleep(1100);
            if (cancelled) return;
            setPhase('typing');

            const bubble = bubbleRef.current;
            const cursor = cursorRef.current;
            if (!bubble || !cursor) return;

            formalRefs.current = [];

            for (const seg of SEGMENTS) {
                if (seg.formal) {
                    const wrapper = document.createElement('span');
                    wrapper.className = 'formal-word';
                    const strike = document.createElement('span');
                    strike.className = 'strike';
                    const textNode = document.createTextNode('');
                    wrapper.appendChild(textNode);
                    wrapper.appendChild(strike);
                    bubble.insertBefore(wrapper, cursor);

                    for (const ch of seg.text) {
                        if (cancelled) return;
                        textNode.textContent += ch;
                        await sleep(55 + Math.random() * 25);
                    }
                    formalRefs.current.push({ el: wrapper, casual: seg.casual });
                } else {
                    for (const ch of seg.text) {
                        if (cancelled) return;
                        bubble.insertBefore(document.createTextNode(ch), cursor);
                        await sleep(16 + Math.random() * 20);
                    }
                }
            }

            cursor.style.display = 'none';
            await sleep(450);
            if (cancelled) return;
            setPhase('striking');
            await sleep(450);

            for (const { el, casual } of formalRefs.current) {
                if (cancelled) return;
                el.classList.add('struck');
                await sleep(500);
                const casEl = document.createElement('span');
                casEl.className = 'casual-swap';
                casEl.textContent = casual;
                el.after(casEl);
                void casEl.offsetWidth;
                casEl.classList.add('show');
                await sleep(300);
            }

            await sleep(350);
            if (cancelled) return;
            setPhase('revealed');
        }
        run();
        return () => { cancelled = true; };
    }, []);

    return (
        <section style={{
            minHeight: '100vh',
            background: 'var(--f-green-dark)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            fontFamily: 'var(--f-font-sans)',
            position: 'relative',
            overflow: 'hidden',
        }}>

            {/* background texture */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 20% 50%, #1c4f4660 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c9a84c30 0%, transparent 40%)',
                pointerEvents: 'none',
            }} />

            {/* question */}
            <p style={{
                fontFamily: 'var(--f-font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
                color: 'var(--f-cream)',
                opacity:   phase === 'idle' ? 0 : 1,
                transform: phase === 'idle' ? 'translateY(8px)' : 'translateY(0)',
                transition: 'opacity 0.7s ease, transform 0.7s ease',
                marginBottom: '2rem',
                textAlign: 'center',
            }}>
                Why does AI sound so… formal?
            </p>

            {/* AI bubble */}
            <div style={{
                width: '100%',
                maxWidth: '600px',
                opacity:   phase === 'idle' || phase === 'question' ? 0 : 1,
                transition: 'opacity 0.5s ease',
            }}>
                <p style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--f-gold)',
                    marginBottom: '0.5rem',
                    opacity: 0.75,
                }}>
                    AI response
                </p>
                <div
                    ref={bubbleRef}
                    style={{
                        background: 'var(--f-green-mid)',
                        border: '1px solid #c9a84c55',
                        borderRadius: '12px',
                        padding: '1.1rem 1.3rem',
                        fontSize: '0.95rem',
                        lineHeight: 2,
                        color: 'var(--f-cream-dim)',
                        position: 'relative',
                        minHeight: '3.5rem',
                    }}
                >
                    <span ref={cursorRef} className="typing-cursor" />
                </div>
            </div>

            {/* legend — FIX: use var(--f-green-accent) with no fallback */}
            <div style={{
                display: 'flex',
                gap: '1.2rem',
                marginTop: '1rem',
                opacity: phase === 'striking' || phase === 'revealed' ? 1 : 0,
                transition: 'opacity 0.5s ease',
                color: 'var(--f-cream-dim)',
            }}>
                {[
                    { color: 'var(--f-gold)',         label: 'formal word'        },
                    { color: 'var(--f-red)',               label: 'removed'            },
                    { color: 'var(--f-green-accent)', label: 'casual replacement' }, // ← fixed
                ].map(({ color, label }) => (
                    <span key={label} style={{ 
                        display: 'flex', alignItems: 'center', gap: '5px', 
                        fontSize: '0.72rem', 
                        color: color,
                    }}>
                        <span style={{ 
                            width: 8, height: 8, borderRadius: '50%', 
                            background: 'currentColor', 
                            display: 'inline-block',
                            flexShrink: 0,
                        }} />
                        <span style={{ color: 'var(--f-cream-dim' }}>{label}</span>
                    </span>
                ))}
            </div>

            {/* headline */}
            <div style={{
                textAlign: 'center',
                maxWidth: '620px',
                marginTop: '2.5rem',
                opacity:   phase === 'revealed' ? 1 : 0,
                transform: phase === 'revealed' ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
            }}>
                <h1 style={{
                    fontFamily: 'var(--f-font-serif)',
                    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                    fontWeight: 400,
                    color: 'var(--f-cream)',
                    lineHeight: 1.25,
                    margin: '0 0 1rem',
                }}>
                    AI doesn't talk like us.
                    <br />
                    <em style={{ color: 'var(--f-gold)' }}>We measured exactly how much.</em>
                </h1>
                <p style={{ color: 'var(--f-cream-dim)', fontSize: '1rem', lineHeight: 1.7, margin: '0 0 0.5rem' }}>
                    A corpus-level study of formality bias across GPT, LLaMA, Claude, and more —
                    with lexical metrics, a RoBERTa classifier, and LoRA mitigation.
                </p>
                <p style={{ color: 'var(--f-cream-dim)' }}>
                    Made by <span style={{ color: 'var(--f-cream)' }}>Oliver Krisetya</span> and <span style={{ color: 'var(--f-cream)' }}>Warren Nguyen</span>
                </p>
            </div>

            {/* scroll cue */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                opacity: phase === 'revealed' ? 0.5 : 0,
                transition: 'opacity 0.8s ease 0.5s',
            }}>
                <span style={{ color: 'var(--f-cream-dim)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>scroll</span>
                <div style={{ animation: 'scrollBounce 1.8s ease-in-out infinite' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3v10M4 9l4 4 4-4" stroke="var(--f-cream-dim)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </section>
    );
}
