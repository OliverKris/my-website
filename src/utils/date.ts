function parseMonthYear(value: string): Date {
    if (value.toLowerCase() === "present") return new Date();
    return new Date(`${value} 1`);
}

export function formatDuration(start: string, end: string): string {
    const startDate = parseMonthYear(start);
    const endDate = parseMonthYear(end);

    let years = endDate.getFullYear() - startDate.getFullYear();
    let months = endDate.getMonth() - startDate.getMonth();
    const days = endDate.getDate() - startDate.getDate();

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    // Round up to next month if there are leftover days
    if (days > 0) months += 1;

    if (months >= 12) {
        years += 1;
        months -= 12;
    }

    if (years > 0 && months > 0) return `${years} yr ${months} mo`;
    if (years > 0) return `${years} yr`;
    if (months > 0) return `${months} mo`;
    return "Less than 1 mo";
}
