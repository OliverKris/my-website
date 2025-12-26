let initialY: number | null = null;
let started = false;

export function initInitialScrollCapture() {
    if (typeof window === "undefined") return;
    if (started) return;
    started = true;

    let last = window.scrollY;
    let sameCount = 0;
    let frames = 0;

    const tick = () => {
        frames += 1;
        const y = window.scrollY;

        if (y === last) sameCount += 1;
        else sameCount = 0;

        last = y;

        if (sameCount >= 2 || frames >= 20) {
            initialY = y;
            return;
        }
        requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
}

export function getInitialScrollY(): number {
    if (typeof window === "undefined") return 0;
    return initialY ?? window.scrollY;
}