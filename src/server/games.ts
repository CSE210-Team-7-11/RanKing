import type { ScoreComparator } from './storage/types.ts';

/** Leaderboard order for each game ID. Sudoku scores are solve times, so faster ranks first */
export const comparators: ReadonlyMap<string, ScoreComparator> = new Map([
  ['sudoku', (a, b) => a.value - b.value],
]);
