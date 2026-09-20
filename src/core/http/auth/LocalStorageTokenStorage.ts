import type { TokenStorage } from "./TokenStorage";

export class LocalStorageTokenStorage implements TokenStorage {
  constructor(private readonly key: string) {}

  get(): string | null {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(this.key);
  }

  set(token: string): void {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(this.key, token);
  }

  remove(): void {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(this.key);
  }
}
