import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
    const ref = useRef<T | null>(null);
    const [inView, setInView] = useState(false);

    const threshold = options?.threshold;
    const root = options?.root;
    const rootMargin = options?.rootMargin;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                obs.disconnect();
            }
        }, { threshold, root, rootMargin })

        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold, root, rootMargin])
    
    return {ref, inView};
}