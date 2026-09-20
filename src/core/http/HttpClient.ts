import axios, { type AxiosInstance } from "axios";

import type { HttpClientConfig } from "./HttpClientConfig";

import { JwtAuthDriver } from "./auth/JwtAuthDriver";

import { CookieAuthDriver } from "./auth/CookieAuthDriver";

import type { AuthDriver } from "./auth/AuthDriver";

import type { TokenStorage } from "./auth/TokenStorage";

import type { TokenStorageConfig } from "../../contracts/auth";

import { LocalStorageTokenStorage } from "./auth/LocalStorageTokenStorage";

import { SessionStorageTokenStorage } from "./auth/SessionStorageTokenStorage";

import { registerResponseInterceptor } from "./interceptors/response.interceptor";

export class HttpClient {
  private readonly client: AxiosInstance;

  private readonly authDriver: AuthDriver | undefined;

  constructor(config: HttpClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 30000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    this.authDriver = this.createAuthDriver(config);

    this.authDriver?.configure(this.client);

    registerResponseInterceptor(this.client, config.handlers);
  }

  private createAuthDriver(config: HttpClientConfig): AuthDriver | undefined {
    const auth = config.auth;

    if (!auth || auth.driver === "none") {
      return undefined;
    }

    if (auth.driver === "cookie") {
      return new CookieAuthDriver(auth.csrf);
    }

    if (auth.driver === "jwt") {
      return new JwtAuthDriver(this.resolveTokenStorage(auth.tokenStorage));
    }

    return undefined;
  }

  private resolveTokenStorage(
    tokenStorage: TokenStorageConfig | TokenStorage | undefined,
  ): TokenStorage {
    if (tokenStorage && "get" in tokenStorage && "set" in tokenStorage) {
      return tokenStorage;
    }

    const key = tokenStorage?.key ?? "auth_token";

    if (tokenStorage?.type === "sessionStorage") {
      return new SessionStorageTokenStorage(key);
    }

    return new LocalStorageTokenStorage(key);
  }

  /** Clears whatever authentication state the configured driver holds (token, csrf, etc). */
  clearAuth(): void {
    this.authDriver?.clear();
  }

  instance(): AxiosInstance {
    return this.client;
  }
}
