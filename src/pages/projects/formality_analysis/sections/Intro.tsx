import { useEffect, useRef, useState } from "react"
import { FadeIn } from '../hooks/FadeIn'

export default function Intro(){
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
                padding: '6rem 2rem 2rem 2rem',
                fontFamily: 'var(--f-font-sans)',
            }}
        >
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
                {/*  */}
                <FadeIn visible={visible} delay={0}>
                    <p style={{
                        color: 'var(--f-gold)',
                        fontSize: '0.75rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem',
                    }}>
                        Introduction
                    </p>
                    <p style={{
                        fontFamily: 'var(--f-font-serif)',
                        fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                        color: 'var(--f-cream)',
                        lineHeight: 1.5,
                        marginBottom: '1.5rem',
                        fontWeight: 400,
                    }}>
                        AI in our daily lives.
                    </p>
                    <p style={{
                        color: 'var(--f-cream-dim)',
                        fontSize: '1.05rem',
                        lineHeight: 1.8,
                        maxWidth: '600px',
                        marginBottom: '2rem',
                    }}>
                        {' '}
                        <em style={{ fontSize: '1.25em', fontStyle: 'normal' }}>L</em>
                        arge language models have rapidly become embedded in everyday communication. 
                        Tools like GPT, Claude, and Gemini are now used across education, software 
                        engineering, customer support, and creative work - often acting as intermediaries 
                        between people and written language itself.
                    </p>
                    <p style={{
                        color: 'var(--f-cream-dim)',
                        fontSize: '1.05rem',
                        lineHeight: 1.8,
                        maxWidth: '600px',
                        marginBottom: '2rem',
                    }}>
                        While using these systems, we began noticing a consistent pattern: AI responses often 
                        sounded unusually formal. Even in casual contexts, models tended to prefer words like 
                        "delve,” “commence,” or “elucidate” over more natural conversational alternatives. The 
                        effect was subtle, but persistent enough that many people could immediately recognize 
                        when a message had been AI-generated.
                    </p>
                </FadeIn>
                <FadeIn visible={visible} delay={0.1}>
                    <p style={{
                        color: 'var(--f-cream-dim)',
                        fontSize: '1.05rem',
                        lineHeight: 1.8,
                        maxWidth: '600px',
                        marginBottom: '0.5rem',
                    }}>
                        That observation led us to a larger question:
                    </p>
                    <p style={{
                        fontStyle: 'italic',
                        fontSize: '1.25rem',
                        maxWidth: '600px',
                        marginBottom: '2rem',

                    }}>Can formality bias in language models actually be measured?</p>
                </FadeIn>
                <FadeIn visible={visible} delay={0.2}>
                    <p style={{
                        color: 'var(--f-cream-dim)',
                        fontSize: '1.05rem',
                        lineHeight: 1.8,
                        maxWidth: '600px',
                        marginBottom: '2rem',
                    }}>
                        To investigate this, we conducted a corpus-level analysis across multiple major LLM families 
                        using lexical metrics, a RoBERTa-based formality classifier, and LoRA fine-tuning experiments. 
                        Our goal was not only to measure whether this bias exists, but also to explore how consistently 
                        it appears across models and whether it can be reduced through lightweight adaptation.
                    </p>
                    <p style={{
                        color: 'var(--f-cream-dim)',
                        fontSize: '1.05rem',
                        lineHeight: 1.8,
                        maxWidth: '600px',
                        marginBottom: '0rem',
                    }}>
                        The result was a multi-stage evaluation framework combining linguistic analysis, neural classification, 
                        statistical testing, and mitigation experiments across both human and AI-generated conversational corpora.
                    </p>
                </FadeIn>
            </div>
        </section>
    )
}