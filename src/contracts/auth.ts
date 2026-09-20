import type { TokenStorage } from "../core/http/auth/TokenStorage";

export type AuthDriver = "none" | "jwt" | "cookie";

export interface AuthConfig {
  driver: AuthDriver;
  tokenStorage?: TokenStorageConfig | TokenStorage;
  csrf?: CsrfConfig;
}

export interface TokenStorageConfig {
  type: "localStorage" | "sessionStorage";
  key: string;
}

export interface CsrfConfig {
  enabled: boolean;
  endpoint?: string;
}
