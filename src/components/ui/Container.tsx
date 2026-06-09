interface Props {
    children: React.ReactNode;
    className?: string;
}

export function Container({ children, className = "" }: Props) {
    return (
        <div className={`${className} mx-auto max-w-4xl px-6`}>
            {children}
        </div>
    );
}