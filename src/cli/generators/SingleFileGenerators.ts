import { NameParser } from "../utils/NameParser";
import { TemplateRenderer } from "../utils/TemplateRenderer";
import { FileGenerator } from "../utils/FileGenerator";
import path from "node:path";

export interface SingleFileGeneratorOptions {
  name: string;
  force?: boolean;
  cwd?: string;
  customStubsPath?: string;
}

function makeGenerator(stubPath: string, getTarget: (name: NameParser, base: string) => string) {
  return (opts: SingleFileGeneratorOptions) => {
    const parser = new NameParser(opts.name);
    const fg = new FileGenerator(opts.cwd, opts.customStubsPath);
    const vars = TemplateRenderer.varsFromParser(parser);
    const base = opts.cwd ?? process.cwd();
    const target = getTarget(parser, base);
    const raw = fg.readStub(stubPath);
    const content = TemplateRenderer.render(raw, vars);
    const writeOptions = opts.force !== undefined ? { force: opts.force } : {};
    fg.write(target, content, writeOptions);
  };
}

export const ComponentGenerator = makeGenerator(
  "components/component.vue.stub",
  (p, base) => path.join(base, "src", "components", `${p.PascalCase}.vue`),
);

export const PageGenerator = makeGenerator(
  "pages/page.vue.stub",
  (p, base) => path.join(base, "src", "pages", `${p.PascalCase}Page.vue`),
);

export const ServiceGenerator = makeGenerator(
  "services/service.ts.stub",
  (p, base) => path.join(base, "src", "services", `${p.kebabCase}.service.ts`),
);

export const StoreGenerator = makeGenerator(
  "stores/store.ts.stub",
  (p, base) => path.join(base, "src", "stores", `${p.kebabCase}.store.ts`),
);

export const TypeGenerator = makeGenerator(
  "types/types.ts.stub",
  (p, base) => path.join(base, "src", "types", `${p.kebabCase}.types.ts`),
);
