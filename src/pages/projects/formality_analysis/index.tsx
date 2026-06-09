import { useEffect } from 'react'
import Hero       from './sections/Hero'
import Intro      from './sections/Intro'
import Concept    from './sections/Concept'
import Results    from './sections/Results'
import Scorer     from './components/Scorer'
import Mitigation from './sections/Mitigation'
import Closing    from './sections/Closing'
import TableOfContents, { type TocSection } from './components/TableOfContents'
import './formality.css'

const SECTIONS: TocSection[] = [
    { id: 'hero',       label: 'Introduction'                              },
    { id: 'intro',      label: 'Background'                                },
    { id: 'concept',    label: 'Methodology', sublabel: 'FR + RoBERTa'    },
    { id: 'results',    label: 'Results',     sublabel: 'Corpus analysis'  },
    { id: 'scorer',     label: 'Try It',      sublabel: 'Live scorer'      },
    { id: 'mitigation', label: 'Mitigation',  sublabel: 'LoRA fine-tuning' },
    { id: 'closing',    label: 'Takeaways'                                 },
]

export default function Formality() {
    useEffect(() => {
        const prev = document.body.style.background
        document.body.style.background = '#0f2318'
        return () => { document.body.style.background = prev }
    }, [])

    return (
        <div>
            <TableOfContents sections={SECTIONS} />
            <section id="hero">       <Hero />       </section>
            <section id="intro">      <Intro />      </section>
            <section id="concept">    <Concept />    </section>
            <section id="results">    <Results />    </section>
            <section id="scorer">     <Scorer />     </section>
            <section id="mitigation"> <Mitigation /> </section>
            <section id="closing">    <Closing />    </section>
        </div>
    )
}
