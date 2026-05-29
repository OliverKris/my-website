import Hero    from './sections/Hero'
import Intro   from './sections/Intro'
import Concept from './sections/Concept'
import TableOfContents, { type TocSection } from './components/TableOfContents'

const SECTIONS: TocSection[] = [
    { id: 'hero',    label: 'Introduction' },
    { id: 'intro',   label: 'Background'   },
    { id: 'concept', label: 'Methodology',  sublabel: 'FR + RoBERTa' },
    // Add more as you build them:
    // { id: 'data',       label: 'Results',     sublabel: 'Corpus analysis' },
    // { id: 'scorer',     label: 'Try It',      sublabel: 'Live scorer'     },
    // { id: 'mitigation', label: 'Mitigation',  sublabel: 'LoRA fine-tuning'},
]

export default function Formality() {
    return (
        <div>
            <TableOfContents sections={SECTIONS} />

            <section id="hero">
                <Hero />
            </section>

            <section id="intro">
                <Intro />
            </section>

            <section id="concept">
                <Concept />
            </section>
        </div>
    )
}
