import {
  ComponentGenerator,
  PageGenerator,
  ServiceGenerator,
  StoreGenerator,
  TypeGenerator,
  type SingleFileGeneratorOptions,
} from "../generators/SingleFileGenerators";

export function MakeComponentCommand(name: string, opts: SingleFileGeneratorOptions = { name }): void {
  ComponentGenerator({ ...opts, name });
}

export function MakePageCommand(name: string, opts: SingleFileGeneratorOptions = { name }): void {
  PageGenerator({ ...opts, name });
}

export function MakeServiceCommand(name: string, opts: SingleFileGeneratorOptions = { name }): void {
  ServiceGenerator({ ...opts, name });
}

export function MakeStoreCommand(name: string, opts: SingleFileGeneratorOptions = { name }): void {
  StoreGenerator({ ...opts, name });
}

export function MakeTypeCommand(name: string, opts: SingleFileGeneratorOptions = { name }): void {
  TypeGenerator({ ...opts, name });
}
