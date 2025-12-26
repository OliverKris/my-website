import type { ElementType, ReactNode, CSSProperties } from "react";
import { useMemo } from "react";
import { useInView } from "../hooks/useInView";
import { getInitialScrollY } from "../utils/initialScroll";

const REVEAL_DELAY_VAR = "--reveal-delay" as const;
type CSSVarStyle = CSSProperties & Record<typeof REVEAL_DELAY_VAR, string>;

type Props<T extends ElementType> = {
    as?: T;
    children: ReactNode;
    className?: string;
    threshold?: number;
    delayMs?: number;
};

export default function Reveal<T extends ElementType = "div">({ 
    as, 
    children, 
    className = "", 
    threshold = 0.1, 
    delayMs = 0 
}: Props<T>) {
    const Tag = (as ?? "div") as ElementType;
    const options = useMemo(() => ({ threshold }), [threshold])
    const { ref, inView } = useInView<HTMLDivElement>(options);

    const allowInitialDelay = getInitialScrollY() < 50;
    
    const style = useMemo<CSSVarStyle>(() => {
        const delay = allowInitialDelay ? `${delayMs}ms` : "0ms";
        return { [REVEAL_DELAY_VAR]: delay };
    }, [allowInitialDelay, delayMs])

    return (
        <Tag 
            ref={ref} 
            className={`${className} reveal ${inView ? "revealVisible":""}`}
            style={style}
        >
            {children}
        </Tag>
    );
}