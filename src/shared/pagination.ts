/** Page bounds applied after filtering and ordering, with 0 <= start <= end */
export interface PaginationQuery {
  /** Index of the first entry to return, zero-based and inclusive */
  start: number;

  /** Index at which to stop, exclusive */
  end: number;
}
