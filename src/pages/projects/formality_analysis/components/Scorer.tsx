import { useEffect, useRef, useState } from 'react'
import { FadeIn } from '../hooks/FadeIn'
import styles from './Scorer.module.css'
import '../formality.css'

// Tier 1: Overused LLM-isms (High-frequency structural/pretentious words)
const TIER1: Record<string, string> = {
    // The "Dead Giveaways"
    'delve': 'dig',
    'utilize': 'use',
    'utilise': 'use',
    'leverage': 'use',
    'commence': 'start',
    'elucidate': 'explain',
    'endeavor': 'try',
    'endeavour': 'try',
    'facilitate': 'help',
    
    // LLM Buzz-Adjectives (The "Vibe" Words)
    'robust': 'strong',
    'comprehensive': 'thorough',
    'intricate': 'complex',
    'optimal': 'best',
    'seamless': 'smooth',
    'pivotal': 'key',
    'paramount': 'crucial',
    'dynamic': 'active',
    'holistic': 'total',
    'multifaceted': 'varied',
    'nuanced': 'subtle',
    
    // Transitional Padding
    'furthermore': 'also',
    'subsequently': 'then',
    'therefore': 'so',
    'consequently': 'so',
    'nevertheless': 'still',
    'henceforth': 'from now on',
    'moreover': 'also',
    'alternatively': 'or',
    
    // Verbs that could be simpler
    'obtain': 'get',
    'demonstrate': 'show',
    'implement': 'apply',
    'navigate': 'handle',
    'indicate': 'show',
    'provide': 'give',
    'ascertain': 'find out',
    'delineate': 'outline',
    'substantiate': 'back up',
    'foster': 'build',
    'revolutionize': 'change',
    'enhance': 'improve',
};

// Tier 2: Academic, Bureaucratic, & Legalese markers (Dry, structural tone)
const TIER2 = new Set([
    // Legalese / Archaic Connectives
    'hence', 'thus', 'thereof', 'wherein', 'whereby', 'herein', 'thereto', 
    'aforementioned', 'notwithstanding', 'hereinafter', 'wherefore',
    
    // High-level Academic / Analytical Verbs
    'stipulate', 'promulgate', 'corroborate', 'juxtapose', 'amplify', 
    'obfuscate', 'reiterate', 'exacerbate', 'mitigate', 'disseminate', 
    'differentiate', 'manifest', 'demystify', 'validate', 'bifurcate',
    
    // High-level Nouns & Adjectives
    'paradigm', 'framework', 'methodology', 'efficacy', 'salient', 
    'tenable', 'inherent', 'pertaining', 'regarding', 'pursuant', 
    'imperative', 'predominant', 'discrepancy', 'precursor'
]);

function computeFR(text: string): { fr: number; hits: string[] } {
    const lower = text.toLowerCase()
    const tokens = lower.split(/\s+/).filter(Boolean)
    if (tokens.length === 0) return { fr: 0, hits: [] }

    const hits: string[] = []
    let processed = lower

    // Tier 1 — phrases first (longer matches take priority)
    const phrases = Object.keys(TIER1).sort((a, b) => b.length - a.length)
    for (const phrase of phrases) {
        const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
        let match
        while ((match = regex.exec(processed)) !== null) {
            hits.push(phrase)
            processed = processed.slice(0, match.index) + ' '.repeat(phrase.length) + processed.slice(match.index + phrase.length)
        }
    }

    // Tier 2 — remaining unigrams
    const remaining = processed.split(/\s+/).filter(Boolean)
    for (const token of remaining) {
        const clean = token.replace(/[^a-z]/g, '')
        if (TIER2.has(clean)) hits.push(clean)
    }

    const fr = (hits.length / tokens.length) * 1000
    return { fr: Math.round(fr * 10) / 10, hits: [...new Set(hits)] }
}

function getVerdict(fr: number, wc: number, hitCount: number): string {
    if (wc === 0) return 'Start typing to see your formality score.'
    if (fr === 0) return 'No formal words detected.'
    if (fr < 100)  return `FR ${fr} — this reads like natural conversation. Very close to the human baseline (Reddit avg: 0.52).`
    if (fr < 250)  return `FR ${fr} — moderately formal. Around the ELI5 human baseline (avg: 2.33). ${hitCount} formal marker${hitCount !== 1 ? 's' : ''} detected.`
    if (fr < 400)  return `FR ${fr} — this sounds like an LLM. Exceeds the average human baseline significantly. ${hitCount} formal marker${hitCount !== 1 ? 's' : ''} flagged.`
    return `FR ${fr} — highly formal register. Well above the LLM average (7.62). ${hitCount} formal marker${hitCount !== 1 ? 's' : ''} detected.`
}

function scoreClass(fr: number) {
    if (fr < 2)  return styles['scoreValue--low']
    if (fr < 6)  return styles['scoreValue--mid']
    return styles['scoreValue--high']
}

const EXAMPLES = [
    "I'd like to delve into the matter and elucidate the core concepts.",
    "yeah so basically you just gotta try it and see what happens lol",
    "Furthermore, we endeavor to implement a robust solution that facilitates optimal outcomes.",
    "The arguments here seem weak honestly",
]

export default function Scorer() {
    const ref = useRef<HTMLElement>(null)
    const [visible, setVisible] = useState(false)
    const [text, setText] = useState('')
    const { fr, hits } = computeFR(text)
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length

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
                    <p className="f-eyebrow">Try It</p>
                    <h2 className="f-heading">Where does your writing land?</h2>
                    <p className="f-body">
                        Paste any text — an email draft, an AI response, a text message — and see
                        how it scores on our Formality Rate metric in real time. The scorer uses
                        the same two-tiered lexicon from the paper.
                    </p>
                </FadeIn>

                <FadeIn visible={visible} delay={0.15}>
                    <textarea
                        className={styles.inputArea}
                        placeholder="Paste or type any text here…"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        spellCheck={false}
                    />

                    {/* Quick example buttons */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.6rem 0 1.5rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--f-cream-dim)', alignSelf: 'center', opacity: 0.7 }}>
                            Try:
                        </span>
                        {EXAMPLES.map((ex, i) => (
                            <button
                                key={i}
                                onClick={() => setText(ex)}
                                style={{
                                    fontSize: '0.72rem',
                                    padding: '0.25rem 0.65rem',
                                    background: 'var(--f-green-mid)',
                                    border: '1px solid var(--f-green-light)',
                                    borderRadius: '999px',
                                    color: 'var(--f-cream-dim)',
                                    cursor: 'pointer',
                                    fontFamily: 'var(--f-font-sans)',
                                    transition: 'border-color 0.15s ease',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--f-gold)')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--f-green-light)')}
                            >
                                Example {i + 1}
                            </button>
                        ))}
                    </div>

                    <div className={styles.scoreboard}>
                        <div className={`${styles.scoreCard} ${fr > 0 ? styles['scoreCard--active'] : ''}`}>
                            <p className={styles.scoreTitle}>Formality Rate (FR)</p>
                            <p className={`${styles.scoreValue} ${scoreClass(fr)}`}>
                                {wordCount === 0 ? '-' : (fr > 0 ? fr : '0')}
                            </p>
                            <p className={styles.scoreSublabel}>hits per 1k tokens</p>
                        </div>
                        <div className={styles.scoreCard}>
                            <p className={styles.scoreTitle}>Word count</p>
                            <p className={styles.scoreValue} style={{ color: 'var(--f-cream-dim)', fontSize: '1.8rem' }}>
                                {wordCount || '—'}
                            </p>
                            <p className={styles.scoreSublabel}>tokens in input</p>
                        </div>
                    </div>

                    {/* Flagged words */}
                    <p className="f-eyebrow" style={{ marginTop: '1.5rem' }}>Flagged formal markers</p>
                    <div className={styles.hitList}>
                        {hits.length > 0
                            ? hits.map(h => <span key={h} className={styles.hitTag}>{h}</span>)
                            : <span className={styles.hitEmpty}>None detected yet</span>
                        }
                    </div>

                    {/* Verdict */}
                    <div className={`${styles.verdict}`} style={{
                        borderColor: fr > 6 ? 'var(--f-red)' : fr > 2 ? 'var(--f-gold)' : 'var(--f-green-light)',
                    }}>
                        {getVerdict(fr, wordCount, hits.length)}
                    </div>
                </FadeIn>

            </div>
        </section>
    )
}
