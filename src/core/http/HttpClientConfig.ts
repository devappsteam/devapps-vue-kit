import type { AuthConfig } from "../../contracts/auth";
import type { HttpHandlers } from "../../contracts/http";

export interface HttpClientConfig {
  baseURL: string;

  timeout?: number;

  auth?: AuthConfig;

  handlers?: HttpHandlers;
}
