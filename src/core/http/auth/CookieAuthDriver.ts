import type { AxiosInstance } from "axios";
import type { AuthDriver } from "./AuthDriver";
import type { CsrfConfig } from "../../../contracts/auth";

const MUTATING_METHODS = new Set(["post", "put", "patch", "delete"]);

export class CookieAuthDriver implements AuthDriver {
  private csrfInitialization: Promise<void> | null = null;

  constructor(private readonly csrf?: CsrfConfig) {}

  configure(client: AxiosInstance): void {
    client.defaults.withCredentials = true;
    client.defaults.withXSRFToken = true;
    client.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

    if (this.csrf?.enabled) {
      client.interceptors.request.use(async (config) => {
        const method = config.method?.toLowerCase();

        if (method && MUTATING_METHODS.has(method)) {
          await this.ensureCsrfCookie(client);
        }

        return config;
      });
    }
  }

  clear(): void {
    this.csrfInitialization = null;
  }

  private ensureCsrfCookie(client: AxiosInstance): Promise<void> {
    if (!this.csrfInitialization) {
      const endpoint = this.csrf?.endpoint ?? "/sanctum/csrf-cookie";
      this.csrfInitialization = client.get(endpoint).then(() => undefined);
    }

    return this.csrfInitialization;
  }
}
