import type { PaginationMeta, PaginationLinks } from "../../contracts/pagination";

/**
 * Immutable value-object that wraps Laravel pagination meta + links
 * and exposes derived helpers.
 */
export class Pagination {
  readonly meta: PaginationMeta;
  readonly links: PaginationLinks;

  constructor(meta: PaginationMeta, links: PaginationLinks) {
    this.meta = meta;
    this.links = links;
  }

  get currentPage(): number {
    return this.meta.current_page;
  }

  get lastPage(): number {
    return this.meta.last_page;
  }

  get perPage(): number {
    return this.meta.per_page;
  }

  get total(): number {
    return this.meta.total;
  }

  get from(): number | null {
    return this.meta.from;
  }

  get to(): number | null {
    return this.meta.to;
  }

  get isFirstPage(): boolean {
    return this.meta.current_page === 1;
  }

  get isLastPage(): boolean {
    return this.meta.current_page === this.meta.last_page;
  }

  get hasPrevPage(): boolean {
    return this.links.prev !== null;
  }

  get hasNextPage(): boolean {
    return this.links.next !== null;
  }

  /** Total number of pages. */
  get pageCount(): number {
    return this.meta.last_page;
  }

  /** Array of page numbers for rendering a paginator UI. */
  pages(): number[] {
    return Array.from({ length: this.meta.last_page }, (_, i) => i + 1);
  }

  /** Build the next page params or null if on last page. */
  nextPageParams(): { page: number } | null {
    if (this.isLastPage) return null;
    return { page: this.meta.current_page + 1 };
  }

  /** Build the prev page params or null if on first page. */
  prevPageParams(): { page: number } | null {
    if (this.isFirstPage) return null;
    return { page: this.meta.current_page - 1 };
  }
}
