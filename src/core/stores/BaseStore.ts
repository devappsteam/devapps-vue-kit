/**
 * Shared state shape expected by CrudStore.
 * Exported so consuming apps can type their stores explicitly.
 */
export interface CrudState<T> {
  items: T[];
  item: T | null;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  } | null;
}

/**
 * Returns the default initial state for a CrudStore.
 */
export function initialCrudState<T>(): CrudState<T> {
  return {
    items: [],
    item: null,
    loading: false,
    saving: false,
    deleting: false,
    error: null,
    pagination: null,
  };
}
