import { useState } from 'react'
import styles from './FormalitySpectrum.module.css'

const SPECTRUM_DATA = [
    {
        value: 0,
        label: 'Super Casual',
        // 0 formal hits out of 8 tokens.
        // Formula: (0 / 8) * 1000 = 0
        example: 'idk structuralism is kinda mid ngl imo',
        fr: '0.0',
        roberta: '3%',
    },
    {
        value: 25,
        label: 'Casual',
        // 1 formal hit ("regarding") out of 14 tokens. 
        // Formula: (1 / 14) * 1000 = 71.4
        example: "Honestly, I don't think structuralism makes sense regarding how people actually talk.",
        fr: '76.9',
        roberta: '28%',
    },
    {
        value: 50,
        label: 'Standard',
        // 3 formal hits ("robust", "demonstrate", "provide") out of 15 tokens.
        // Formula: (3 / 15) * 1000 = 200.0
        example: 'We need a robust framework to demonstrate these concepts and provide clear results for everyone.',
        fr: '266.7',
        roberta: '61%',
    },
    {
        value: 75,
        label: 'Formal',
        // 6 formal hits ("In order to", "elucide", "utilize", "comprehensive", "methodology", "subsequently") out of 19 tokens.
        // Formula: (6 / 19) * 1000 = 315.8
        example: 'In order to elucidate these findings, we utilize a comprehensive methodology, subsequently analyzing the core data.',
        fr: '312.5',
        roberta: '88%',
    },
    {
        value: 100,
        label: 'Highly Formal',
        // 10 formal hits ("Notwithstanding", "delve into", "intricate", "paradigm", "ascertain", "efficacy", "thereof", "stipulate", "inherent", "discrepancies") out of 21 tokens.
        // Formula: (10 / 21) * 1000 = 476.2
        example: 'Notwithstanding the intent to delve into this intricate paradigm to ascertain the efficacy thereof, rules stipulate inherent discrepancies remain.',
        fr: '473.7',
        roberta: '99%',
    },
]

export default function FormalitySpectrum() {
    const [value, setValue] = useState(50)

    const current = SPECTRUM_DATA.reduce((prev, curr) =>
        Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
    )

    return (
        <div className={styles.wrap}>
            <p className={styles.subtitle}>
                Drag the slider to see how language shifts — and how each metric responds differently.
            </p>

            <div className={styles.sliderSection}>
                <div className={styles.spectrumLabels}>
                    <span>Reddit / Texting</span>
                    <span>Legal / Academic</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={e => setValue(Number(e.target.value))}
                    className={styles.slider}
                />
                <p className={styles.tierLabel}>
                    Register: <strong>{current.label}</strong>
                </p>
            </div>

            <div className={styles.exampleBox}>
                <p className={styles.exampleText}>"{current.example}"</p>
            </div>

            <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                    <h3>Formality Rate (FR)</h3>
                    <p className={styles.metricDesc}>
                        Counts formal lexical hits per 1,000 tokens. No ML — just the lexicon.
                    </p>
                    <div className={styles.metricScore}>{current.fr}</div>
                </div>
                <div className={styles.metricCard}>
                    <h3>RoBERTa P(formal)</h3>
                    <p className={styles.metricDesc}>
                        Neural classifier probability. Reads structure, not just word choice.
                    </p>
                    <div className={styles.metricScore}>{current.roberta}</div>
                </div>
            </div>
        </div>
    )
}
