import { useEffect, useRef, useState } from 'react'
import { FadeIn } from '../hooks/fadeIn'
import '../formality.css'

const SUBSTITUTIONS = [
    { formal: 'delve',        informal: 'dig into' },
    { formal: 'utilize',      informal: 'use'      },
    { formal: 'commence',     informal: 'start'    },
    { formal: 'elucidate',    informal: 'explain'  },
    { formal: 'furthermore',  informal: 'also'     },
    { formal: 'endeavor',     informal: 'try'      },
    { formal: 'obtain',       informal: 'get'      },
    { formal: 'demonstrate',  informal: 'show'     },
]

export default function Concept() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true) },
            { threshold: 0.15 }
        )
        if (sectionRef.current) obs.observe(sectionRef.current)
        return () => obs.disconnect()
    }, [])

    return (
        <section
            ref={sectionRef}
            style={{
                background: 'var(--f-green-dark)',
                padding: '6rem 2rem',
                fontFamily: 'var(--f-font-sans)',
            }}
        >
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
                {/* Intro */}
                <FadeIn visible={visible} delay={0}>
                    <p style={{
                        color: 'var(--f-gold)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem',
                    }}>
                        The Mechanism
                    </p>
                    <p style={{
                        fontFamily: 'var(--f-font-serif)',
                        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                        color: 'var(--f-cream)',
                        lineHeight: 1.5,
                        marginBottom: '1.5rem',
                        fontWeight: 400,
                    }}>
                        Every word an AI chooses is a small decision.
                    </p>
                    <p style={{
                        color: 'var(--f-cream-dim)',
                        fontSize: '1.05rem',
                        lineHeight: 1.8,
                        maxWidth: '600px',
                        marginBottom: '2rem',
                    }}>
                        "Utilize" instead of "use." "Commence" instead of "start."
                        Individually, these choices seem minor. But across millions of
                        conversations, they add up to a measurable pattern —
                        a systematic preference for formal language we call{' '}
                        <em style={{ color: 'var(--f-cream)', fontStyle: 'italic' }}>register bias</em>.
                    </p>
                </FadeIn>

                {/* Word Substitution */}
                <FadeIn visible={visible} delay={0.2}>
                    <p style={{
                        color: 'var(--f-cream-dim)',
                        fontSize: '0.8rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: '1.25rem',
                    }}>
                        LLMs prefer → humans say
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0',
                        border: '1px solid #2d5a3d',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        marginBottom: '3rem',
                    }}>
                        {/* Header row */}
                        <div style={{ padding: '0.75rem 1.25rem', background: 'var(--f-green-mid)', borderBottom: '1px solid #2d5a3d' }}>
                            <span style={{ color: 'var(--f-gold)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Formal (LLM)</span>
                        </div>
                        <div style={{ padding: '0.75rem 1.25rem', background: 'var(--f-green-mid)', borderBottom: '1px solid #2d5a3d', borderLeft: '1px solid #2d5a3d' }}>
                            <span style={{ color: 'var(--f-cream-dim)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Casual (Human)</span>
                        </div>

                        {/* Word rows */}
                        {SUBSTITUTIONS.map((pair, i) => (
                        <>
                            <div key={`f-${i}`} style={{
                                padding: '0.85rem 1.25rem',
                                borderBottom: i < SUBSTITUTIONS.length - 1 ? '1px solid #1a3a2820' : 'none',
                                background: i % 2 === 0 ? 'transparent' : '#1a3a2810',
                                }}>
                                <span style={{ color: 'var(--f-gold)', fontWeight: 500 }}>{pair.formal}</span>
                            </div>
                            <div key={`i-${i}`} style={{
                                padding: '0.85rem 1.25rem',
                                borderBottom: i < SUBSTITUTIONS.length - 1 ? '1px solid #1a3a2820' : 'none',
                                borderLeft: '1px solid #2d5a3d',
                                background: i % 2 === 0 ? 'transparent' : '#1a3a2810',
                                }}>
                                <span style={{ color: 'var(--f-cream-dim)' }}>{pair.informal}</span>
                            </div>
                        </>
                        ))}
                    </div>
                </FadeIn>

                {/* FR Formula */}
                <FadeIn visible={visible} delay={0.35}>
                    <div style={{
                        borderLeft: '2px solid var(--f-gold)',
                        paddingLeft: '2rem',
                        marginBottom: '3rem',
                    }}>
                        <p style={{
                            color: 'var(--f-cream-dim)',
                            fontSize: '0.8rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                        }}>
                        Metric 1 — Formality Rate
                        </p>
                        <p style={{
                            color: 'var(--f-cream)',
                            fontSize: '1.05rem',
                            lineHeight: 1.8,
                            marginBottom: '1.5rem',
                            maxWidth: '540px',
                        }}>
                        If we can enumerate the formal words, we can count how often
                        they appear. Our <em>Formality Rate</em> metric does exactly that —
                        no machine learning required.
                        </p>
                        {/* Formula display */}
                        <div style={{
                            background: 'var(--f-green-mid)',
                            border: '1px solid #2d5a3d',
                            borderRadius: '10px',
                            padding: '1.5rem 2rem',
                            display: 'inline-block',
                            fontFamily: 'Georgia, serif',
                            fontSize: '1.2rem',
                            color: 'var(--f-cream)',
                        }}>
                        FR = <span style={{ color: 'var(--f-gold)' }}>formal lexical hits</span>
                        {' '}÷{' '}
                        <span style={{ color: 'var(--f-cream-dim)' }}>total tokens</span>
                        {' '}× 1000
                        </div>
                    </div>
                </FadeIn>

                {/* RoBERTa */}
                <FadeIn visible={visible} delay={0.5}>
                    <div style={{
                        borderLeft: '2px solid #2d5a3d',
                        paddingLeft: '2rem',
                    }}>
                        <p style={{
                            color: 'var(--f-cream-dim)',
                            fontSize: '0.8rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                        }}>
                            Metric 2 — RoBERTa Classifier
                        </p>
                        <p style={{
                            color: 'var(--f-cream)',
                            fontSize: '1.05rem',
                            lineHeight: 1.8,
                            maxWidth: '540px',
                            marginBottom: '1rem',
                        }}>
                            FR counts words. But formality also lives in sentence structure —
                            how a sentence is <em>built</em>, not just which words appear in it.
                        </p>
                        <p style={{
                            color: 'var(--f-cream-dim)',
                            fontSize: '1rem',
                            lineHeight: 1.8,
                            maxWidth: '540px',
                        }}>
                            We fine-tuned a RoBERTa classifier on the Pavlick formality dataset
                            to score each response as a continuous probability: P(formal).
                            Together, the two metrics capture orthogonal dimensions of register.
                        </p>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}