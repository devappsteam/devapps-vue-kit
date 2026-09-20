export { createVueKit } from "./config/createVueKit";
export type { VueKit } from "./config/createVueKit";
export type { VueKitConfig } from "./config/VueKitConfig";

export { HttpClient } from "./core/http/HttpClient";
export type { HttpClientConfig } from "./core/http/HttpClientConfig";
export { HttpError } from "./core/http/HttpError";

export { LocalStorageTokenStorage } from "./core/http/auth/LocalStorageTokenStorage";
export { SessionStorageTokenStorage } from "./core/http/auth/SessionStorageTokenStorage";
export type { TokenStorage } from "./core/http/auth/TokenStorage";

export { BaseService } from "./core/services/BaseService";
export { CrudService } from "./core/services/CrudService";

export { defineCrudStore } from "./core/stores/CrudStore";
export type { CrudState } from "./core/stores/BaseStore";

export { Form } from "./core/forms/Form";
export { Pagination } from "./core/pagination/Pagination";

export type {
  ApiResource,
  ApiCollection,
  ApiPaginatedCollection,
  ApiParams,
  ApiErrorResponse,
} from "./contracts/api";

export type {
  PaginationMeta,
  PaginationLinks,
  PaginationParams,
} from "./contracts/pagination";

export type {
  AuthConfig,
  AuthDriver,
  TokenStorageConfig,
  CsrfConfig,
} from "./contracts/auth";

export type { HttpHandlers } from "./contracts/http";
