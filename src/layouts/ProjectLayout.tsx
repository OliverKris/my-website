import { Outlet, useNavigate, useLocation } from 'react-router-dom'

// Each project can define its own back button config.
// Key = the pathname, value = label shown on the button.
const BACK_LABELS: Record<string, string> = {
    '/projects/formality': '← All Projects',
    // Add more as you build them:
    // '/projects/something-else': '← Back',
}

export default function ProjectLayout() {
    const navigate  = useNavigate()
    const { pathname } = useLocation()

    const label = BACK_LABELS[pathname] ?? '← Back'

    return (
        <div style={{ position: 'relative' }}>
            {/* Back button — floats top-left, always visible */}
            <button
                onClick={() => navigate('/projects')}
                aria-label="Back to projects"
                style={{
                    position: 'fixed',
                    top: '1.25rem',
                    left: '1.5rem',
                    zIndex: 200,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.45rem 0.9rem',
                    border: '1px solid var(--f-green-light, #2d5a3d)',
                    borderRadius: '999px',
                    color: 'var(--f-cream-dim, #c8c0b0)',
                    fontFamily: 'var(--f-font-sans, sans-serif)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease, color 0.2s ease, border-color 0.2s ease',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                }}
                onMouseEnter={e => {
                    const btn = e.currentTarget
                    btn.style.background    = 'var(--f-green-light, #2d5a3d)'
                    btn.style.color         = 'var(--f-cream, #f5f0e8)'
                    btn.style.borderColor   = 'var(--f-gold, #c9a84c)'
                }}
                onMouseLeave={e => {
                    const btn = e.currentTarget
                    btn.style.background    = 'var(--f-green-mid, #1a3a28)'
                    btn.style.color         = 'var(--f-cream-dim, #c8c0b0)'
                    btn.style.borderColor   = 'var(--f-green-light, #2d5a3d)'
                }}
            >
                {label}
            </button>

            <Outlet />
        </div>
    )
}
