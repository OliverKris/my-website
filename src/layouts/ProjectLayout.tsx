import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const BACK_LABELS: Record<string, string> = {
    '/projects/formality': '← All Projects',
};

export default function ProjectLayout() {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const label = BACK_LABELS[pathname] ?? '← Back';

    return (
        <div className="relative">
            <button
                onClick={() => navigate('/projects')}
                aria-label="Back to projects"
                className="fixed top-5 left-6 z-200 flex items-center gap-md px-[0.9rem] py-[0.45rem] rounded-full text-[0.75rem] tracking-[0.04em] cursor-pointer backdrop-blur-sm border transition-[background,color,border-color] duration-200 ease-out bg-[rgba(26,58,40,0.75)] border-[#2d5a3d] text-[#c8c0b0] hover:bg-[rgba(45,90,61,0.8)] hover:text-[#f5f0e8] hover:border-[#c9a84c]"
            >
                {label}
            </button>

            <Outlet />
        </div>
    );
}
