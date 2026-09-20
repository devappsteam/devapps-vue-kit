import type { HttpClient } from "../core/http/HttpClient";

let _instance: HttpClient | null = null;

/**
 * Stores the global HttpClient instance.
 * Called internally by `createVueKit` — do not call manually.
 * @internal
 */
export function _setHttpClientInstance(http: HttpClient): void {
  _instance = http;
}

/**
 * Returns the globally configured HttpClient instance.
 * Requires that `createVueKit()` has been called in main.ts before use.
 *
 * @example
 * // In your store:
 * import { useHttpClient } from '@devappsnpm/vue-kit'
 * export const useCompanyStore = defineCrudStore('company', () => new CompanyService(useHttpClient()))
 */
export function useHttpClient(): HttpClient {
  if (!_instance) {
    throw new Error(
      "[vue-kit] useHttpClient() called before createVueKit(). " +
        "Make sure to call app.use(createVueKit({ ... })) in your main.ts."
    );
  }
  return _instance;
}
