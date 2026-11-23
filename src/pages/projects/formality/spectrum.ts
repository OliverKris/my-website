// Example sentences along the formality scale, with their scores (from the original page).

export const SPECTRUM_DATA = [
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

