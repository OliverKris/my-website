import { useEffect, useRef, useState } from 'react'
import { FadeIn } from '../hooks/FadeIn'
import styles from './Results.module.css'
import '../formality.css'

const CORPORA = [
    { label: 'BlendedSkillTalk', fr: 0.24,  type: 'human',  delay: 0   },
    { label: 'Reddit',           fr: 0.52,  type: 'human',  delay: 0.1 },
    { label: 'ELI5',             fr: 2.33,  type: 'human',  delay: 0.2 },
    { label: 'LLM (LMSYS)',      fr: 7.62,  type: 'llm',    delay: 0.3 },
]

const MAX_FR = 10

const MODEL_FAMILIES = [
    { name: 'PaLM',    bert: 0.86, color: '#c9a84c' },
    { name: 'GPT',     bert: 0.84, color: '#e8c97a' },
    { name: 'Vicuna',  bert: 0.83, color: '#7ec98a' },
    { name: 'LLaMA',   bert: 0.82, color: '#5bb8f5' },
    { name: 'Claude',  bert: 0.79, color: '#b8a0dc' },
    { name: 'Alpaca',  bert: 0.80, color: '#f0a070' },
]

const HUMAN_BASELINE = 0.51

export default function Results() {
    const ref = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)
    const [barsActive, setBarsActive] = useState(false)

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true)
                    setTimeout(() => setBarsActive(true), 400)
                }
            },
            { threshold: 0.1 }
        )
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [])

    return (
        <section ref={ref} className={styles.section}>
            <div className={styles.container}>

                <FadeIn visible={visible} delay={0}>
                    <p className="f-eyebrow">Results</p>
                    <h2 className="f-heading">LLMs are measurably more formal than humans.</h2>
                    <p className="f-body">
                        We analyzed over one million conversations from the LMSYS-Chat-1M dataset
                        and compared them against three human conversational corpora. The pattern
                        was unambiguous: LLM outputs sit far above the human formality baseline on
                        both metrics, regardless of conversation type.
                    </p>
                </FadeIn>

                {/* Bar chart — FR by corpus */}
                <FadeIn visible={visible} delay={0.1}>
                    <p className="f-eyebrow" style={{ marginTop: '2.5rem' }}>
                        Mean Formality Rate by corpus (hits per 1k tokens)
                    </p>
                    <div className={styles.barChart}>
                        {CORPORA.map(({ label, fr, type, delay }) => (
                            <div key={label} className={styles.barRow}>
                                <span className={styles.barLabel}>{label}</span>
                                <div className={styles.barTrack}>
                                    <div
                                        className={`${styles.barFill} ${styles[`barFill--${type}`]} ${barsActive ? styles.animate : ''}`}
                                        style={{
                                            '--bar-width': `${(fr / MAX_FR) * 100}%`,
                                            '--bar-delay': `${delay}s`,
                                        } as React.CSSProperties}
                                    />
                                </div>
                                <span className={styles.barValue}>{fr}</span>
                            </div>
                        ))}
                    </div>

                    <div className={styles.callout}>
                        <p>
                            Even in casual conversations, LMSYS LLMs score <strong>FR 2.45</strong> —
                            still above the most formal human baseline (ELI5 at 2.33). In general
                            and task-focused conversations, the gap widens dramatically.
                        </p>
                    </div>
                </FadeIn>

                <hr className="f-divider" />

                {/* Model families */}
                <FadeIn visible={visible} delay={0.2}>
                    <p className="f-eyebrow">Bias by model family</p>
                    <h2 className="f-heading">The bias is universal — not model-specific.</h2>
                    <p className="f-body">
                        We ran our RoBERTa classifier across every model family in the dataset.
                        Nearly all families exceed the human formality baseline. The variation
                        between families points to pretraining data and alignment choices —
                        not architecture — as the primary driver.
                    </p>

                    {/* Human baseline reference line */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                        <div style={{ width: 24, height: 2, background: 'var(--f-green-accent)', borderTop: '2px dashed var(--f-green-accent)' }} />
                        <span style={{ fontSize: '0.72rem', color: 'var(--f-green-accent)', opacity: 0.8 }}>
                            Human baseline P(formal) = {HUMAN_BASELINE}
                        </span>
                    </div>

                    <div className={styles.modelGrid}>
                        {MODEL_FAMILIES.map(({ name, bert, color }) => (
                            <div
                                key={name}
                                className={styles.modelCard}
                                style={{ '--model-color': color } as React.CSSProperties}
                            >
                                <p className={styles.modelName}>{name}</p>
                                <p className={styles.modelScore}>{bert}</p>
                                <p className={styles.modelSublabel}>
                                    P(formal) · {((bert - HUMAN_BASELINE) * 100).toFixed(0)}% above human
                                </p>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                <hr className="f-divider" />

                {/* Conversation type breakdown */}
                <FadeIn visible={visible} delay={0.3}>
                    <p className="f-eyebrow">Topic dependence</p>
                    <h2 className="f-heading">Conversation type strongly modulates the bias.</h2>
                    <p className="f-body">
                        Formality isn't constant — it scales with task type. We classified LMSYS
                        conversations into casual, general, and task-oriented categories and found
                        significant variation within LLMs themselves.
                    </p>

                    <div className={styles.modelGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        {[
                            { type: 'Casual',  fr: '2.45', bert: '0.61', color: 'var(--f-green-accent)' },
                            { type: 'General', fr: '5.25', bert: '0.76', color: 'var(--f-gold)'         },
                            { type: 'Task',    fr: '4.68', bert: '0.89', color: 'var(--f-red)'          },
                        ].map(({ type, fr, bert, color }) => (
                            <div
                                key={type}
                                className={styles.modelCard}
                                style={{ '--model-color': color } as React.CSSProperties}
                            >
                                <p className={styles.modelName}>{type}</p>
                                <p className={styles.modelScore}>{fr}</p>
                                <p className={styles.modelSublabel}>FR · RoBERTa {bert}</p>
                            </div>
                        ))}
                    </div>

                    <div className={styles.callout}>
                        <p>
                            Task responses have the <strong>highest RoBERTa score</strong> (0.89) —
                            structural formality dominates when LLMs are giving instructions.
                            General responses have the <strong>highest FR</strong> (5.25) —
                            more formal vocabulary even if the structure is looser.
                            Casual LMSYS responses are lower than both, but still above every human baseline.
                        </p>
                    </div>
                </FadeIn>

            </div>
        </section>
    )
}
