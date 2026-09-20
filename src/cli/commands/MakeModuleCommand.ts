import { ModuleGenerator, type ModuleType, type UiMode, type ModuleGeneratorOptions } from "../generators/ModuleGenerator";

export interface MakeModuleOptions {
  type?: ModuleType;
  ui?: UiMode;
  force?: boolean;
  cwd?: string;
  outputBase?: string;
  customStubsPath?: string;
}

export function MakeModuleCommand(name: string, opts: MakeModuleOptions = {}): void {
  const config: ModuleGeneratorOptions = {
    name,
    type: opts.type ?? "crud",
    ui: opts.ui ?? "modal",
    force: opts.force ?? false,
  };
  
  if (opts.outputBase !== undefined) config.outputBase = opts.outputBase;
  if (opts.cwd !== undefined) config.cwd = opts.cwd;
  if (opts.customStubsPath !== undefined) config.customStubsPath = opts.customStubsPath;

  const generator = new ModuleGenerator(config);

  generator.generate();
}
