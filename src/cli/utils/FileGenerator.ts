import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Root of the @devapps/vue-kit package (two levels up from src/cli/utils). */
const PACKAGE_ROOT = path.resolve(__dirname, "../../..");

export interface WriteOptions {
  /** If true, overwrite existing files. Default: false. */
  force?: boolean;
}

export interface WriteResult {
  path: string;
  created: boolean;
  skipped: boolean;
}

/**
 * Responsible for resolving stub paths and writing generated files.
 *
 * Stub resolution order (first found wins):
 *  1. `<cwd>/.devapps/stubs/<stubRelPath>`
 *  2. `<package>/stubs/<stubRelPath>`
 */
export class FileGenerator {
  constructor(
    /** Working directory of the consuming project. Defaults to process.cwd(). */
    private readonly cwd: string = process.cwd(),
    /** Optional custom stubs path override (from VueKitConfig.cli.stubsPath). */
    private readonly customStubsRoot?: string,
  ) {}

  /**
   * Resolves a stub file path, preferring project-local overrides.
   * @param stubRelPath Relative path from the stubs root (e.g. "module/crud/modal/types/types.ts.stub")
   */
  resolveStub(stubRelPath: string): string {
    const customRoot =
      this.customStubsRoot ?? path.join(this.cwd, ".devapps", "stubs");

    const customPath = path.join(customRoot, stubRelPath);
    if (fs.existsSync(customPath)) {
      return customPath;
    }

    const packagePath = path.join(PACKAGE_ROOT, "stubs", stubRelPath);
    if (fs.existsSync(packagePath)) {
      return packagePath;
    }

    throw new Error(
      `Stub not found: "${stubRelPath}"\n` +
        `  Looked in:\n` +
        `    ${customPath}\n` +
        `    ${packagePath}`,
    );
  }

  /** Read and return stub content as a string. */
  readStub(stubRelPath: string): string {
    return fs.readFileSync(this.resolveStub(stubRelPath), "utf8");
  }

  /**
   * Write content to targetPath. Creates parent directories if needed.
   * Respects `force` flag before overwriting.
   */
  write(targetPath: string, content: string, options?: WriteOptions): WriteResult {
    const abs = path.isAbsolute(targetPath)
      ? targetPath
      : path.join(this.cwd, targetPath);

    if (fs.existsSync(abs) && !options?.force) {
      console.warn(`  ⚠  Skipped (already exists): ${abs}`);
      return { path: abs, created: false, skipped: true };
    }

    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content, "utf8");

    console.log(`  ✔  Created: ${abs}`);
    return { path: abs, created: true, skipped: false };
  }

  /**
   * High-level helper: resolve stub → render → write.
   */
  generate(
    stubRelPath: string,
    targetPath: string,
    render: (raw: string) => string,
    options?: WriteOptions,
  ): WriteResult {
    const raw = this.readStub(stubRelPath);
    const content = render(raw);
    return this.write(targetPath, content, options);
  }
}
