import { HttpClient } from "../core/http/HttpClient";
import type { HttpClientConfig } from "../core/http/HttpClientConfig";
import type { VueKitConfig } from "./VueKitConfig";
import { _setHttpClientInstance } from "./useHttpClient";

export interface VueKit {
  http: HttpClient;
  config: VueKitConfig;
}

export function createVueKit(config: VueKitConfig): VueKit {
  const httpConfig: HttpClientConfig = { baseURL: config.api.baseURL };

  if (config.api.timeout !== undefined) httpConfig.timeout = config.api.timeout;
  if (config.api.auth !== undefined) httpConfig.auth = config.api.auth;
  if (config.api.handlers !== undefined) httpConfig.handlers = config.api.handlers;

  const http = new HttpClient(httpConfig);

  // Store globally so useHttpClient() works in stores/services
  _setHttpClientInstance(http);

  return { http, config };
}
