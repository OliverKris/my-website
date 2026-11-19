// The two-tiered formality lexicon and Formality Rate (FR) from the paper,
// moved unchanged from the original scorer component.

export const TIER1: Record<string, string> = {
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
export const TIER2 = new Set([
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

export function computeFR(text: string): { fr: number; hits: string[] } {
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


export function getVerdict(fr: number, wc: number, hitCount: number): string {
    if (wc === 0) return 'Start typing to see your formality score.'
    if (fr === 0) return 'No formal words detected.'
    if (fr < 100)  return `FR ${fr} — this reads like natural conversation. Very close to the human baseline (Reddit avg: 0.52).`
    if (fr < 250)  return `FR ${fr} — moderately formal. Around the ELI5 human baseline (avg: 2.33). ${hitCount} formal marker${hitCount !== 1 ? 's' : ''} detected.`
    if (fr < 400)  return `FR ${fr} — this sounds like an LLM. Exceeds the average human baseline significantly. ${hitCount} formal marker${hitCount !== 1 ? 's' : ''} flagged.`
    return `FR ${fr} — highly formal register. Well above the LLM average (7.62). ${hitCount} formal marker${hitCount !== 1 ? 's' : ''} detected.`
}

