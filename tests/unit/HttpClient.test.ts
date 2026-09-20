import { describe, it, expect, vi } from "vitest";
import { HttpClient } from "../../src/core/http/HttpClient";

describe("HttpClient", () => {
  it("initializes with baseURL", () => {
    const http = new HttpClient({ baseURL: "https://api.example.com" });
    const instance = http.instance();

    expect(instance.defaults.baseURL).toBe("https://api.example.com");
  });

  it("handles empty auth config without failing", () => {
    const http = new HttpClient({
      baseURL: "https://api.example.com",
      auth: { driver: "none" },
    });
    expect(http.instance()).toBeDefined();
  });
});
