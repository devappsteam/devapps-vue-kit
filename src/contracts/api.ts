import type { PaginationLinks, PaginationMeta } from "./pagination";

export interface ApiResource<T> {
  data: T;
}

export interface ApiCollection<T> {
  data: T[];
}

export interface ApiPaginatedCollection<T> {
  data: T[];
  links: PaginationLinks;
  meta: PaginationMeta;
}

export type ApiParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
