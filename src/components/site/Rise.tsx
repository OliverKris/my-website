import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Entrance for the parts of a section: each child rises 24px and fades in,
 * staggered, once, as the section scrolls into view. Content is in the DOM
 * and readable without script; reduced motion drops the travel.
 */
export function Rise({ children, className = "", delay = 0, as = "div" }: {
    children: ReactNode; className?: string; delay?: number; as?: "div" | "section" | "header" | "li" | "figure";
}) {
    const reduce = useReducedMotion();
    const Tag = motion[as];
    return (
        <Tag
            className={className}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: delay / 1000 }}
        >
            {children}
        </Tag>
    );
}

/** Page frame: one pair of equal outer margins, used by every section. */
export const frame = "mx-auto w-full max-w-[1440px] px-5 md:px-12";
