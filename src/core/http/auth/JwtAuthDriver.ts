import type { AxiosInstance } from "axios";
import type { AuthDriver } from "./AuthDriver";
import type { TokenStorage } from "./TokenStorage";

export class JwtAuthDriver implements AuthDriver {
  constructor(private readonly storage: TokenStorage) {}

  configure(client: AxiosInstance): void {
    client.interceptors.request.use((config) => {
      const token = this.storage.get();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
  }

  clear(): void {
    this.storage.remove();
  }
}
