export function FadeIn({ children, visible, delay = 0 }: {
    children: React.ReactNode
    visible: boolean
    delay?: number
    }) {
    return (
        <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
            }}>
            {children}
        </div>
    )
}