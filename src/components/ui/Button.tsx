import React from "react";
import { Link } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "ghost";

// 1. Create a union of allowed components
type ButtonElement = "button" | "a" | typeof Link;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLElement> {
    variant?: ButtonVariant;
    to?: string;
    as?: ButtonElement;
    href?: string; // Explicitly allowed for 'a' tags
    target?: string;
}

export function Button({ 
    variant = "primary", 
    className = "", 
    children, 
    as: Component = "button", 
    to, 
    ...props 
}: ButtonProps) {
    
    const base = "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97]";
    const variants: Record<ButtonVariant, string> = {
        primary: "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200",
        secondary: "border border-layout bg-card text-main hover:bg-zinc-100 dark:hover:bg-zinc-900",
        ghost: "text-muted hover:text-main hover:bg-zinc-100 dark:hover:bg-zinc-900"
    };

    const classes = `${base} ${variants[variant]} ${className}`;

    // 2. Route internal links correctly
    if (to) {
        return <Link to={to} className={classes}>{children}</Link>;
    }

    // 3. Render polymorphic component safely
    // Casting to React.ElementType is the "clean" way to satisfy TS
    const Tag = Component as React.ElementType;
    
    return (
        <Tag className={classes} {...props}>
            {children}
        </Tag>
    );
}