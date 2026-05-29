import { useEffect, useRef, useState } from 'react'

export interface TocSection {
    id: string
    label: string
    sublabel?: string
}

interface Props {
    sections: TocSection[]
}

export default function TableOfContents({ sections }: Props) {
    const [activeId, setActiveId]   = useState<string>(sections[0]?.id ?? '')
    const [visible, setVisible]     = useState(false)
    const [expanded, setExpanded]   = useState(false)
    const progressRef = useRef<{ [id: string]: number }>({})

    // Show TOC only after user scrolls past hero (200px)
    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 120)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Track which section is active via IntersectionObserver
    useEffect(() => {
        const observers: IntersectionObserver[] = []

        sections.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (!el) return
            const obs = new IntersectionObserver(
                ([entry]) => {
                    progressRef.current[id] = entry.intersectionRatio
                    // Pick the section with highest visibility
                    const best = Object.entries(progressRef.current).sort((a, b) => b[1] - a[1])[0]
                    if (best) setActiveId(best[0])
                },
                { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
            )
            obs.observe(el)
            observers.push(obs)
        })

        return () => observers.forEach(o => o.disconnect())
    }, [sections])

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    return (
        <nav
            aria-label="Table of contents"
            style={{
                position: 'fixed',
                right: '2rem',
                top: '50%',
                transform: `translateY(-50%) translateX(${visible ? '0' : '120px'})`,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
                opacity: visible ? 1 : 0,
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0',
                fontFamily: 'var(--f-font-sans)',
            }}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            {/* Background pill */}
            <div style={{
                position: 'absolute',
                inset: '-0.75rem -1rem',
                background: 'var(--f-green-mid)',
                border: '1px solid var(--f-green-light)',
                borderRadius: '14px',
                opacity: expanded ? 1 : 0,
                transition: 'opacity 0.25s ease',
                pointerEvents: 'none',
            }} />

            {sections.map((sec) => {
                const isActive = sec.id === activeId
                return (
                    <button
                        key={sec.id}
                        onClick={() => scrollTo(sec.id)}
                        aria-label={`Jump to ${sec.label}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '0.5rem 0',
                            minHeight: '28px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            position: 'relative',
                            textAlign: 'right',
                        }}
                    >
                        {/* Label — only visible on hover */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            opacity: expanded ? 1 : 0,
                            transform: expanded ? 'translateX(0)' : 'translateX(8px)',
                            transition: 'opacity 0.2s ease, transform 0.2s ease',
                            pointerEvents: expanded ? 'auto' : 'none',
                        }}>
                            <span style={{
                                fontSize: '0.72rem',
                                fontWeight: isActive ? 500 : 400,
                                color: isActive ? 'var(--f-gold)' : 'var(--f-cream-dim)',
                                letterSpacing: '0.04em',
                                whiteSpace: 'nowrap',
                                transition: 'color 0.25s ease',
                                lineHeight: 1.2,
                            }}>
                                {sec.label}
                            </span>
                            {sec.sublabel && (
                                <span style={{
                                    fontSize: '0.6rem',
                                    color: isActive ? 'var(--f-gold)' : '#6b8c7a',
                                    letterSpacing: '0.04em',
                                    whiteSpace: 'nowrap',
                                    transition: 'color 0.25s ease',
                                }}>
                                    {sec.sublabel}
                                </span>
                            )}
                        </div>

                        {/* Dot indicator */}
                        <div style={{
                            width: '14px',
                            height: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <div style={{
                                width:  isActive ? '10px' : '6px',
                                height: isActive ? '10px' : '6px',
                                borderRadius: '50%',
                                background: isActive ? 'var(--f-gold)' : 'var(--f-green-light)',
                                border: isActive ? '2px solid var(--f-gold-light)' : '1px solid #2d5a3d',
                                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                boxShadow: isActive ? '0 0 8px var(--f-gold)66' : 'none',
                            }} />
                        </div>
                    </button>
                )
            })}
        </nav>
    )
}
