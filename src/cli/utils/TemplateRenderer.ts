import type { NameParser } from "./NameParser";

export interface TemplateVars {
  ModuleName: string;
  moduleName: string;
  moduleSlug: string;
  ModuleNamePlural: string;
  moduleNamePlural: string;
  moduleSlugPlural: string;
  resourcePath: string;
  [key: string]: string;
}

/**
 * Replaces `{{ VarName }}` placeholders in a stub string.
 */
export class TemplateRenderer {
  static varsFromParser(parser: NameParser, resourcePath?: string): TemplateVars {
    return {
      ModuleName: parser.PascalCase,
      moduleName: parser.camelCase,
      moduleSlug: parser.kebabCase,
      ModuleNamePlural: parser.plural,
      moduleNamePlural: parser.pluralCamel,
      moduleSlugPlural: parser.pluralKebab,
      resourcePath: resourcePath ?? `/${parser.pluralKebab}`,
    };
  }

  static render(template: string, vars: TemplateVars): string {
    return template.replace(/\{\{\s*([a-zA-Z_]+)\s*\}\}/g, (_, key: string) => {
      const value = vars[key];
      return value !== undefined ? value : `{{ ${key} }}`;
    });
  }
}
