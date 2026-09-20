import { describe, it, expect } from "vitest";
import { NameParser } from "../../src/cli/utils/NameParser";

describe("NameParser", () => {
  it("parses PascalCase properly", () => {
    const p = new NameParser("CustomerAccount");
    expect(p.PascalCase).toBe("CustomerAccount");
    expect(p.camelCase).toBe("customerAccount");
    expect(p.kebabCase).toBe("customer-account");
    expect(p.snakeCase).toBe("customer_account");
    expect(p.screamingSnakeCase).toBe("CUSTOMER_ACCOUNT");
    expect(p.plural).toBe("CustomerAccounts");
  });

  it("parses kebab-case properly", () => {
    const p = new NameParser("customer-account");
    expect(p.PascalCase).toBe("CustomerAccount");
    expect(p.pluralKebab).toBe("customer-accounts");
  });

  it("handles pluralisation rules", () => {
    expect(new NameParser("Company").plural).toBe("Companies");
    expect(new NameParser("Match").plural).toBe("Matches");
    expect(new NameParser("Boy").plural).toBe("Boys");
    expect(new NameParser("User").plural).toBe("Users");
  });

  it("throws on unsafe characters", () => {
    expect(() => new NameParser("../customer")).toThrow();
    expect(() => new NameParser("customer.account")).toThrow();
    expect(() => new NameParser("/etc/passwd")).toThrow();
  });
});
