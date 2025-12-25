export function sortByLabel<T extends { label: string }>(items: T[]): T[] {
    return [...items].sort((a, b) => a.label.localeCompare(b.label));
}
