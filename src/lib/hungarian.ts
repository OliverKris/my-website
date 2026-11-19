/**
 * Maximum-weight bipartite matching (the Hungarian algorithm, O(n^3)).
 *
 * The same problem Easy-Sched's backend hands to SciPy's linear_sum_assignment:
 * rows are slots, columns are people, weight[i][j] is how good person j is in
 * slot i, and null means "not eligible". Returns, for each row, the chosen
 * column or -1 when the row is best left empty.
 */
export function maxWeightMatching(weight: (number | null)[][]): number[] {
    const rows = weight.length;
    const cols = rows ? weight[0].length : 0;
    const n = Math.max(rows, cols);
    if (n === 0) return [];

    let max = 0;
    for (const r of weight) for (const w of r) if (w != null && w > max) max = w;

    // Square cost matrix: maximising weight == minimising (max - weight).
    // Ineligible pairs and padding cost `max`, the same as leaving a row empty.
    const cost = (i: number, j: number) => {
        const w = i < rows && j < cols ? weight[i][j] : null;
        return w == null ? max : max - w;
    };

    const INF = Number.POSITIVE_INFINITY;
    const u = new Array<number>(n + 1).fill(0);
    const v = new Array<number>(n + 1).fill(0);
    const p = new Array<number>(n + 1).fill(0); // p[j] = row matched to column j (1-based)
    const way = new Array<number>(n + 1).fill(0);

    for (let i = 1; i <= n; i++) {
        p[0] = i;
        let j0 = 0;
        const minv = new Array<number>(n + 1).fill(INF);
        const used = new Array<boolean>(n + 1).fill(false);
        do {
            used[j0] = true;
            const i0 = p[j0];
            let delta = INF;
            let j1 = 0;
            for (let j = 1; j <= n; j++) {
                if (used[j]) continue;
                const cur = cost(i0 - 1, j - 1) - u[i0] - v[j];
                if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
                if (minv[j] < delta) { delta = minv[j]; j1 = j; }
            }
            for (let j = 0; j <= n; j++) {
                if (used[j]) { u[p[j]] += delta; v[j] -= delta; }
                else minv[j] -= delta;
            }
            j0 = j1;
        } while (p[j0] !== 0);
        do {
            const j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
        } while (j0);
    }

    const result = new Array<number>(rows).fill(-1);
    for (let j = 1; j <= n; j++) {
        const i = p[j] - 1;
        if (i < rows && j - 1 < cols && weight[i][j - 1] != null) result[i] = j - 1;
    }
    return result;
}
