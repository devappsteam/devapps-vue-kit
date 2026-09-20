import { NameParser } from "../utils/NameParser";
import { TemplateRenderer } from "../utils/TemplateRenderer";
import { FileGenerator } from "../utils/FileGenerator";
import path from "node:path";

export type ModuleType = "basic" | "resource" | "crud" | "dashboard";
export type UiMode = "modal" | "page";

export interface ModuleGeneratorOptions {
  name: string;
  type?: ModuleType;
  ui?: UiMode;
  force?: boolean;
  outputBase?: string;
  cwd?: string;
  customStubsPath?: string;
}

/**
 * Orchestrates the generation of all files that make up a module.
 */
export class ModuleGenerator {
  private readonly parser: NameParser;
  private readonly fg: FileGenerator;
  private readonly vars: ReturnType<typeof TemplateRenderer.varsFromParser>;
  private readonly options: Required<
    Pick<ModuleGeneratorOptions, "type" | "ui" | "force" | "outputBase">
  >;

  constructor(opts: ModuleGeneratorOptions) {
    this.parser = new NameParser(opts.name);
    this.fg = new FileGenerator(opts.cwd, opts.customStubsPath);
    this.vars = TemplateRenderer.varsFromParser(this.parser);

    this.options = {
      type: opts.type ?? "crud",
      ui: opts.ui ?? "modal",
      force: opts.force ?? false,
      outputBase: opts.outputBase ?? path.join(opts.cwd ?? process.cwd(), "src", "modules"),
    };
  }

  generate(): void {
    const { type, ui, force, outputBase } = this.options;
    const slug = this.parser.kebabCase;
    const moduleDir = path.join(outputBase, slug);

    console.log(`\n🚀 Generating module: ${this.parser.PascalCase} (${type}${type === "crud" ? ` / ${ui}` : ""})\n`);

    switch (type) {
      case "basic":
        this.generateBasic(moduleDir, force);
        break;
      case "resource":
        this.generateResource(moduleDir, force);
        break;
      case "crud":
        if (ui === "page") {
          this.generateCrudPage(moduleDir, force);
        } else {
          this.generateCrudModal(moduleDir, force);
        }
        break;
      case "dashboard":
        this.generateDashboard(moduleDir, force);
        break;
    }

    console.log(`\n✅ Module "${this.parser.PascalCase}" generated successfully!\n`);
  }

  private render(raw: string): string {
    return TemplateRenderer.render(raw, this.vars);
  }

  private stub(relPath: string): string {
    return this.fg.readStub(relPath);
  }

  private write(targetPath: string, content: string, force: boolean) {
    this.fg.write(targetPath, content, { force });
  }

  // ─── basic ───────────────────────────────────────────────────────────────────

  private generateBasic(dir: string, force: boolean): void {
    const name = this.parser.PascalCase;

    this.write(
      path.join(dir, "components", `${name}Component.vue`),
      this.render(this.stub("module/basic/component.vue.stub")),
      force,
    );
    this.write(
      path.join(dir, "index.ts"),
      this.render(this.stub("module/basic/index.ts.stub")),
      force,
    );
  }

  // ─── resource ────────────────────────────────────────────────────────────────

  private generateResource(dir: string, force: boolean): void {
    const name = this.parser.PascalCase;
    const slug = this.parser.kebabCase;

    this.write(path.join(dir, "services", `${slug}.service.ts`), this.render(this.stub("module/resource/service.ts.stub")), force);
    this.write(path.join(dir, "stores", `${slug}.store.ts`), this.render(this.stub("module/resource/store.ts.stub")), force);
    this.write(path.join(dir, "types", `${slug}.types.ts`), this.render(this.stub("module/resource/types.ts.stub")), force);
    this.write(path.join(dir, "components", `${name}List.vue`), this.render(this.stub("module/resource/List.vue.stub")), force);
    this.write(path.join(dir, "index.ts"), this.render(this.stub("module/resource/index.ts.stub")), force);
  }

  // ─── crud / modal ─────────────────────────────────────────────────────────────

  private generateCrudModal(dir: string, force: boolean): void {
    const name = this.parser.PascalCase;
    const slug = this.parser.kebabCase;

    this.write(path.join(dir, "components", `${name}List.vue`), this.render(this.stub("module/crud/modal/components/List.vue.stub")), force);
    this.write(path.join(dir, "components", `${name}FormModal.vue`), this.render(this.stub("module/crud/modal/components/FormModal.vue.stub")), force);
    this.write(path.join(dir, "components", `${name}DeleteModal.vue`), this.render(this.stub("module/crud/modal/components/DeleteModal.vue.stub")), force);
    this.write(path.join(dir, "views", `${name}View.vue`), this.render(this.stub("module/crud/modal/views/View.vue.stub")), force);
    this.write(path.join(dir, "services", `${slug}.service.ts`), this.render(this.stub("module/crud/modal/services/service.ts.stub")), force);
    this.write(path.join(dir, "stores", `${slug}.store.ts`), this.render(this.stub("module/crud/modal/stores/store.ts.stub")), force);
    this.write(path.join(dir, "types", `${slug}.types.ts`), this.render(this.stub("module/crud/modal/types/types.ts.stub")), force);
    this.write(path.join(dir, "router.ts"), this.render(this.stub("module/crud/modal/router.ts.stub")), force);
    this.write(path.join(dir, "index.ts"), this.render(this.stub("module/crud/modal/index.ts.stub")), force);
  }

  // ─── crud / page ─────────────────────────────────────────────────────────────

  private generateCrudPage(dir: string, force: boolean): void {
    const name = this.parser.PascalCase;
    const slug = this.parser.kebabCase;

    this.write(path.join(dir, "components", `${name}List.vue`), this.render(this.stub("module/crud/page/components/List.vue.stub")), force);
    this.write(path.join(dir, "components", `${name}Form.vue`), this.render(this.stub("module/crud/page/components/Form.vue.stub")), force);
    this.write(path.join(dir, "components", `${name}DeleteModal.vue`), this.render(this.stub("module/crud/page/components/DeleteModal.vue.stub")), force);
    this.write(path.join(dir, "pages", `${name}ListPage.vue`), this.render(this.stub("module/crud/page/pages/ListPage.vue.stub")), force);
    this.write(path.join(dir, "pages", `${name}CreatePage.vue`), this.render(this.stub("module/crud/page/pages/CreatePage.vue.stub")), force);
    this.write(path.join(dir, "pages", `${name}EditPage.vue`), this.render(this.stub("module/crud/page/pages/EditPage.vue.stub")), force);
    this.write(path.join(dir, "pages", `${name}ShowPage.vue`), this.render(this.stub("module/crud/page/pages/ShowPage.vue.stub")), force);
    this.write(path.join(dir, "services", `${slug}.service.ts`), this.render(this.stub("module/crud/page/services/service.ts.stub")), force);
    this.write(path.join(dir, "stores", `${slug}.store.ts`), this.render(this.stub("module/crud/page/stores/store.ts.stub")), force);
    this.write(path.join(dir, "types", `${slug}.types.ts`), this.render(this.stub("module/crud/page/types/types.ts.stub")), force);
    this.write(path.join(dir, "router.ts"), this.render(this.stub("module/crud/page/router.ts.stub")), force);
    this.write(path.join(dir, "index.ts"), this.render(this.stub("module/crud/page/index.ts.stub")), force);
  }

  // ─── dashboard ───────────────────────────────────────────────────────────────

  private generateDashboard(dir: string, force: boolean): void {
    const name = this.parser.PascalCase;
    const slug = this.parser.kebabCase;

    this.write(path.join(dir, "views", `${name}Dashboard.vue`), this.render(this.stub("module/dashboard/Dashboard.vue.stub")), force);
    this.write(path.join(dir, "router.ts"), this.render(this.stub("module/dashboard/router.ts.stub")), force);
    this.write(path.join(dir, "index.ts"), this.render(this.stub("module/dashboard/index.ts.stub")), force);
  }
}
