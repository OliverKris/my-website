import { useEffect, useRef, useState } from 'react'
import { FadeIn } from '../hooks/FadeIn'
import FormalitySpectrum from '../components/FormalitySpectrum'
import styles from './Concept.module.css'
import '../formality.css'

const SUBSTITUTIONS = [
    { formal: 'delve',       informal: 'dig into' },
    { formal: 'utilize',     informal: 'use'      },
    { formal: 'commence',    informal: 'start'    },
    { formal: 'elucidate',   informal: 'explain'  },
    { formal: 'furthermore', informal: 'also'     },
    { formal: 'endeavor',    informal: 'try'      },
    { formal: 'obtain',      informal: 'get'      },
    { formal: 'demonstrate', informal: 'show'     },
]

export default function Concept() {
    const ref = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true) },
            { threshold: 0.1 }
        )
        if (ref.current) obs.observe(ref.current)
        return () => obs.disconnect()
    }, [])

    return (
        <section ref={ref} className={styles.section}>
            <div className={styles.container}>

                <FadeIn visible={visible} delay={0}>
                    <p className="f-eyebrow">The Mechanism</p>
                    <h2 className="f-heading">Every word an AI chooses is a small decision.</h2>
                    <p className="f-body">
                        "Utilize" instead of "use." "Commence" instead of "start."
                        Individually, these choices seem minor. But across millions of conversations,
                        they add up to a measurable pattern — a systematic preference for formal
                        language we call <em>register bias</em>.
                    </p>
                </FadeIn>

                <FadeIn visible={visible} delay={0.1}>
                    <p className="f-eyebrow" style={{ marginTop: '2.5rem' }}>LLMs prefer → humans say</p>
                    <div className={styles.tableWrap}>
                        <div className={styles.tableHead}>
                            <div className={styles.tableHeadCell}>Formal (LLM)</div>
                            <div className={styles.tableHeadCell}>Casual (Human)</div>
                        </div>
                        {SUBSTITUTIONS.map((pair) => (
                            <div key={pair.formal} className={styles.tableRow}>
                                <div className={styles.tableCell}>{pair.formal}</div>
                                <div className={styles.tableCell}>{pair.informal}</div>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                <hr className="f-divider" />

                <FadeIn visible={visible} delay={0.2}>
                    <p className="f-eyebrow">Measuring It</p>
                    <h2 className="f-heading">Two ways of hearing formality.</h2>
                    <p className="f-body">
                        Measuring something as subjective as "formality" requires more than one lens.
                        We built two complementary metrics that capture different dimensions of register —
                        one lexical, one neural.
                    </p>
                </FadeIn>

                <FadeIn visible={visible} delay={0.3}>
                    <div className={`${styles.metricBlock} ${styles['metricBlock--gold']}`}>
                        <p className={styles.metricLabel}>Metric 1 — Formality Rate (FR)</p>
                        <p className="f-body" style={{ marginBottom: '1rem' }}>
                            If we can enumerate the formal words, we can count how often they appear.
                            Our Formality Rate metric does exactly that — no machine learning required.
                            We built a two-tiered lexicon: Tier 1 catches classic LLM-isms like "delve"
                            and "utilize", Tier 2 covers broader formal vocabulary.
                        </p>
                        <div className={styles.formula}>
                            FR = <span className={styles.formulaHit}>formal lexical hits</span>
                            {' '}÷{' '}
                            <span className={styles.formulaDim}>total tokens</span>
                            {' '}× 1000
                        </div>
                    </div>
                </FadeIn>

                <FadeIn visible={visible} delay={0.4}>
                    <div className={`${styles.metricBlock} ${styles['metricBlock--green']}`}>
                        <p className={styles.metricLabel}>Metric 2 — RoBERTa Register Classifier</p>
                        <p className="f-body" style={{ marginBottom: 0 }}>
                            FR counts words. But formality also lives in sentence structure — how a
                            sentence is <em>built</em>, not just which words appear in it. We fine-tuned
                            a RoBERTa model (pretrained on the GYAFC dataset, fine-tuned on Pavlick
                            formality scores) to output a continuous probability: <strong style={{ color: 'var(--f-cream)' }}>P(formal)</strong>.
                            Together, the two metrics capture orthogonal dimensions of register.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn visible={visible} delay={0.5}>
                    <FormalitySpectrum />
                </FadeIn>

            </div>
        </section>
    )
}
