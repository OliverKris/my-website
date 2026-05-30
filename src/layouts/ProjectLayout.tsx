import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import './ProjectLayout.css'; // Import a dedicated CSS file

const BACK_LABELS: Record<string, string> = {
    '/projects/formality': '← All Projects',
}

export default function ProjectLayout() {
    const navigate  = useNavigate()
    const { pathname } = useLocation()
    const label = BACK_LABELS[pathname] ?? '← Back'

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => navigate('/projects')}
                aria-label="Back to projects"
                className="back-btn" // Clean class name instead of inline soup
            >
                {label}
            </button>

            <Outlet />
        </div>
    )
}