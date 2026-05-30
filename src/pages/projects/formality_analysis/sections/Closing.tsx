import { useEffect, useRef, useState } from 'react'
import { FadeIn } from '../hooks/FadeIn'
import styles from './Closing.module.css'
import '../formality.css'

const IMPACT_TILES = [
    {
        icon: '/icon/chalkboard-user-solid-full.svg',
        title: 'Education',
        desc: 'Overly formal AI tutors can alienate learners, especially those unfamiliar with academic register.',
    },
    {
        icon: '/icon/brain-solid-full.svg',
        title: 'Mental Health',
        desc: 'Conversational agents in therapy contexts need accessible, warm language — not clinical prose.',
    },
    {
        icon: '/icon/bag-shopping-solid-full.svg',
        title: 'Consumer Assistants',
        desc: 'Customer-facing tools sound distant and untrustworthy when they respond like a legal document.',
    },
    {
        icon: '/icon/accessible-icon-brands-solid-full.svg',
        title: 'Accessibility',
        desc: 'Formal language raises comprehension barriers for users with lower literacy or non-native speakers.',
    },
]

export default function Closing() {
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
                    <p className="f-eyebrow">Why It Matters</p>
                    <h2 className="f-heading">Formality shapes who AI works for.</h2>
                    <p className="f-body">
                        Register isn't just a stylistic quirk - it affects comprehension, trust, and
                        who feels included. When AI assistants consistently default to formal,
                        document-style prose, they create friction in the contexts where natural
                        language matters most.
                    </p>
                </FadeIn>

                <FadeIn visible={visible} delay={0.1}>
                    <div className={styles.tileGrid}>
                        {IMPACT_TILES.map(({ icon, title, desc }) => (
                            <div key={title} className={styles.tile}>
                                <div className={styles.tileHeader}>
                                    <img src={icon} className={styles.tileIcon} alt=""></img>
                                    <p className={styles.tileTitle}>{title}</p>
                                </div>
                                <p className={styles.tileDesc}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                <hr className="f-divider" />

                <FadeIn visible={visible} delay={0.2}>
                    <p className="f-eyebrow">Future Work</p>
                    <p className="f-body">
                        This project opens several directions. Scaling LoRA mitigation to larger models
                        (Mistral-7B, LLaMA-3-8B) and running human evaluations measuring naturalness
                        and preference before and after mitigation would strengthen the debiasing case.
                        Isolating the contributions of pretraining vs. RLHF - and extending the
                        framework to multilingual register analysis - remain open problems.
                    </p>
                </FadeIn>

                <hr className="f-divider" />

                <FadeIn visible={visible} delay={0.3}>
                    <p className="f-eyebrow">Authors</p>
                    <div className={styles.authors}>
                        {[
                            {
                                name: 'Oliver Krisetya',
                                role: 'Lexicon construction · FR pipeline · Bias source analysis · Statistical testing',
                            },
                            {
                                name: 'Warren Nguyen',
                                role: 'Data collection & preprocessing · RoBERTa classifier · LoRA mitigation · Evaluation',
                            },
                        ].map(({ name, role }) => (
                            <div key={name} className={styles.author}>
                                <p className={styles.authorName}>{name}</p>
                                <p className={styles.authorRole}>{role}</p>
                            </div>
                        ))}
                    </div>
                </FadeIn>

                <FadeIn visible={visible} delay={0.4}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--f-cream-dim)', opacity: 0.6, margin: '0 0 1.5rem' }}>
                        CSCI 6515 — Natural Language Understanding · April 2026 · The George Washington University
                    </p>
                    <div className={styles.links}>
                        <a
                            href="https://github.com/OliverKris/formal-language-bias-llms"
                            target="_blank"
                            rel="noreferrer"
                            className={`${styles.linkBtn} ${styles['linkBtn--primary']}`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                            </svg>
                            View on GitHub
                        </a>
                        <a
                            href="https://github.com/OliverKris"
                            target="_blank"
                            rel="noreferrer"
                            className={`${styles.linkBtn} ${styles['linkBtn--ghost']}`}
                        >
                            Oliver's Github
                        </a>
                    </div>
                </FadeIn>

            </div>
        </section>
    )
}
