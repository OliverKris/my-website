import { useEffect, useRef, useState } from 'react'
import { FadeIn } from '../hooks/FadeIn'
import styles from './Mitigation.module.css'
import '../formality.css'

const PAIRS = [
    {
        prompt: "Can you explain what machine learning is?",
        before: "I would be delighted to elucidate the fundamentals of machine learning. This domain encompasses a comprehensive set of algorithms that endeavor to facilitate automated learning from data.",
        after: "Sure! Machine learning is basically a way for computers to learn from data. Instead of writing out every rule yourself, you show the model examples and it figures out the patterns.",
        beforeHits: ['elucidate', 'endeavor', 'facilitate', 'comprehensive'],
        afterHits: [],
    },
    {
        prompt: "What's a good way to debug my code?",
        before: "To commence the debugging process, I would recommend utilizing a systematic approach. Furthermore, implementing logging mechanisms can prove to be an optimal strategy for identifying errors.",
        after: "Start by reading the error message carefully — it usually tells you exactly where things went wrong. Adding print statements is a really useful way to track what your code is doing.",
        beforeHits: ['commence', 'utilize', 'furthermore', 'implementing', 'optimal'],
        afterHits: [],
    },
]

export default function Mitigation() {
    const ref = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)
    const [activeIdx, setActiveIdx] = useState(0)

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true) },
            { threshold: 0.1 }
        )
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [])

    const pair = PAIRS[activeIdx]

    // Highlight formal words in text
    function highlight(text: string, hits: string[]) {
        if (hits.length === 0) return <>{text}</>
        const regex = new RegExp(`\\b(${hits.join('|')})\\b`, 'gi')
        const parts = text.split(regex)
        return (
            <>
                {parts.map((part, i) =>
                    hits.some(h => h.toLowerCase() === part.toLowerCase())
                        ? <mark key={i}>{part}</mark>
                        : part
                )}
            </>
        )
    }

    return (
        <section ref={ref} className={styles.section}>
            <div className={styles.container}>

                <FadeIn visible={visible} delay={0}>
                    <p className="f-eyebrow">Mitigation</p>
                    <h2 className="f-heading">Can we teach a model to relax?</h2>
                    <p className="f-body">
                        Once we confirmed the bias exists, the natural next question was whether it
                        could be reduced. We applied LoRA (Low-Rank Adaptation) fine-tuning to
                        Qwen2.5-3B-Instruct on a curated low-formality dataset and evaluated
                        the results against held-out LMSYS prompts.
                    </p>
                    <p className="f-body">
                        LoRA freezes the original model weights and trains small adapter matrices,
                        making it computationally cheap - no full retraining required.
                    </p>
                </FadeIn>

                <FadeIn visible={visible} delay={0.1}>
                    {/* Prompt selector */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                        {PAIRS.map((p, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIdx(i)}
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '0.3rem 0.75rem',
                                    background: i === activeIdx ? 'var(--f-gold)' : 'transparent',
                                    color: i === activeIdx ? 'var(--f-green-dark)' : 'var(--f-cream-dim)',
                                    border: `1px solid ${i === activeIdx ? 'var(--f-gold)' : 'var(--f-green-light)'}`,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--f-font-sans)',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                Example {i + 1}
                            </button>
                        ))}
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--f-cream-dim)', marginBottom: '1rem', fontStyle: 'italic' }}>
                        Prompt: "{pair.prompt}"
                    </p>

                    <div className={styles.comparison}>
                        <div className={`${styles.bubble} ${styles['bubble--before']}`}>
                            <p className={styles.bubbleLabel}>Base model (Qwen2.5-3B)</p>
                            <p className={styles.bubbleText}>{highlight(pair.before, pair.beforeHits)}</p>
                        </div>
                        <div className={`${styles.bubble} ${styles['bubble--after']}`}>
                            <p className={styles.bubbleLabel}>LoRA fine-tuned</p>
                            <p className={styles.bubbleText}>{highlight(pair.after, pair.afterHits)}</p>
                        </div>
                    </div>
                </FadeIn>

                <FadeIn visible={visible} delay={0.2}>
                    <div className={styles.statRow}>
                        {[
                            { value: '↓ 12%',  label: 'Reduction in mean FR\n6.20 → 5.46' },
                            { value: '↓ 0.07', label: 'RoBERTa P(formal)\n0.868 → 0.794' },
                            { value: '~',     label: 'ROUGE-L unchanged\n0.073 → 0.077' },
                        ].map(({ value, label }) => (
                            <div key={value} className={styles.statBox}>
                                <p className={styles.statValue}>{value}</p>
                                <p className={styles.statLabel} style={{ whiteSpace: 'pre-line' }}>{label}</p>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                <FadeIn visible={visible} delay={0.3}>
                    <div className={styles.honestyBox}>
                        <p>
                            <strong>A note:</strong> The held-out evaluation set was small (50 prompts)
                            and the paired t-test did not reach statistical significance. These results are
                            preliminary — they suggest that register behavior is <em>steerable</em> through
                            lightweight adaptation, but don't constitute definitive debiasing. Scaling to
                            Mistral-7B or LLaMA-3-8B with human evaluation is the logical next step.
                        </p>
                    </div>
                </FadeIn>

            </div>
        </section>
    )
}
