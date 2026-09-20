import type { TokenStorage } from "./TokenStorage";

export class SessionStorageTokenStorage implements TokenStorage {
  constructor(private readonly key: string) {}

  get(): string | null {
    if (typeof sessionStorage === "undefined") return null;
    return sessionStorage.getItem(this.key);
  }

  set(token: string): void {
    if (typeof sessionStorage === "undefined") return;
    sessionStorage.setItem(this.key, token);
  }

  remove(): void {
    if (typeof sessionStorage === "undefined") return;
    sessionStorage.removeItem(this.key);
  }
}
