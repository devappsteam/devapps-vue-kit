/**
 * NameParser — centralises all name-casing transformations.
 *
 * Given a PascalCase input (e.g. "CustomerAccount") it derives:
 *  - PascalCase       → CustomerAccount
 *  - camelCase        → customerAccount
 *  - kebab-case       → customer-account
 *  - snake_case       → customer_account
 *  - SCREAMING_SNAKE  → CUSTOMER_ACCOUNT
 *  - Plural (simple)  → CustomerAccounts
 *
 * Security: sanitises names to prevent path traversal and shell injection.
 */
export class NameParser {
  private readonly words: string[];

  constructor(input: string) {
    NameParser.assertSafe(input);
    this.words = NameParser.split(input);

    if (this.words.length === 0) {
      throw new Error(`Invalid module name: "${input}"`);
    }
  }

  /** Original PascalCase — e.g. CustomerAccount */
  get PascalCase(): string {
    return this.words.map((w) => capitalize(w)).join("");
  }

  /** camelCase — e.g. customerAccount */
  get camelCase(): string {
    return this.words
      .map((w, i) => (i === 0 ? w.toLowerCase() : capitalize(w)))
      .join("");
  }

  /** kebab-case — e.g. customer-account */
  get kebabCase(): string {
    return this.words.map((w) => w.toLowerCase()).join("-");
  }

  /** snake_case — e.g. customer_account */
  get snakeCase(): string {
    return this.words.map((w) => w.toLowerCase()).join("_");
  }

  /** SCREAMING_SNAKE_CASE — e.g. CUSTOMER_ACCOUNT */
  get screamingSnakeCase(): string {
    return this.words.map((w) => w.toUpperCase()).join("_");
  }

  /** Naïve plural — appends "s". Sufficient for code generation. */
  get plural(): string {
    const last = this.words[this.words.length - 1];
    if (!last) return this.PascalCase + "s";

    const pluralLast = naivePlural(last);
    return this.words
      .slice(0, -1)
      .map((w) => capitalize(w))
      .concat(capitalize(pluralLast))
      .join("");
  }

  /** Plural in camelCase */
  get pluralCamel(): string {
    const p = new NameParser(this.plural);
    return p.camelCase;
  }

  /** Plural in kebab-case */
  get pluralKebab(): string {
    return naivePluralKebab(this.kebabCase);
  }

  // ─── private helpers ────────────────────────────────────────────────────────

  private static split(input: string): string[] {
    // Accept PascalCase, camelCase, kebab-case, snake_case
    return input
      .replace(/([a-z])([A-Z])/g, "$1 $2") // camel/pascal → spaces
      .replace(/[-_]/g, " ") // kebab/snake → spaces
      .split(/\s+/)
      .filter(Boolean);
  }

  /**
   * Guards against path traversal and shell injection in user-provided names.
   */
  static assertSafe(name: string): void {
    if (/[/.\\]/.test(name)) {
      throw new Error(
        `Module name "${name}" contains illegal characters (/, \\, .). ` +
          `Use PascalCase names like "CustomerAccount".`,
      );
    }

    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)) {
      throw new Error(
        `Module name "${name}" is invalid. ` +
          `Use only letters, digits, hyphens or underscores, starting with a letter.`,
      );
    }
  }
}

// ─── utility functions ────────────────────────────────────────────────────────

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function naivePlural(word: string): string {
  const w = word.toLowerCase();

  if (w.endsWith("y") && !["a", "e", "i", "o", "u"].includes(w.charAt(w.length - 2) ?? "")) {
    return w.slice(0, -1) + "ies";
  }

  if (w.endsWith("s") || w.endsWith("sh") || w.endsWith("ch") || w.endsWith("x") || w.endsWith("z")) {
    return w + "es";
  }

  return w + "s";
}

function naivePluralKebab(kebab: string): string {
  const parts = kebab.split("-");
  const last = parts[parts.length - 1];
  if (!last) return kebab + "s";
  parts[parts.length - 1] = naivePlural(last);
  return parts.join("-");
}
