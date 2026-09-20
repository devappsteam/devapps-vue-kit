import type { AxiosInstance } from "axios";

export interface AuthDriver {
  configure(client: AxiosInstance): void;
  clear(): void;
}
