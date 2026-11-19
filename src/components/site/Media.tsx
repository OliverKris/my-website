import { useEffect, useRef, useState } from "react";

function useIsDark() {
    const [dark, setDark] = useState(() => document.documentElement.getAttribute("data-theme") === "dark");
    useEffect(() => {
        const obs = new MutationObserver(() => setDark(document.documentElement.getAttribute("data-theme") === "dark"));
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        return () => obs.disconnect();
    }, []);
    return dark;
}

/** A screenshot that follows the site theme: the app's light UI on the light site, dark on dark. */
export function ThemedShot({ name, alt, width, height, className = "", eager = false }: {
    name: string; alt: string; width: number; height: number; className?: string; eager?: boolean;
}) {
    const dark = useIsDark();
    return (
        <img
            src={`/media/easy-sched/${name}-${dark ? "dark" : "light"}.webp`}
            alt={alt}
            width={width}
            height={height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className={`block w-full h-auto ${className}`}
        />
    );
}

/**
 * A muted, looping product film with a poster frame. It only plays while on
 * screen, and stays on the poster for people who prefer reduced motion.
 */
export function LoopVideo({ src, poster, label, className = "" }: {
    src: string; poster: string; label: string; className?: string;
}) {
    const ref = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) el.play().catch(() => { /* autoplay blocked: poster stays */ });
            else el.pause();
        }, { threshold: 0.25 });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return (
        <video
            ref={ref}
            className={`block w-full h-auto ${className}`}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={label}
        />
    );
}
