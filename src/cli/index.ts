import { MakeModuleCommand } from "./commands/MakeModuleCommand";
import {
  MakeComponentCommand,
  MakePageCommand,
  MakeServiceCommand,
  MakeStoreCommand,
  MakeTypeCommand,
} from "./commands/MakeOtherCommands";
import type { ModuleType, UiMode } from "./generators/ModuleGenerator";

// ─── arg parsing ─────────────────────────────────────────────────────────────

function parseArgs(argv: string[]): {
  command: string | undefined;
  args: string[];
  flags: Record<string, string | boolean>;
} {
  const [, , command, ...rest] = argv;

  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (const token of rest) {
    if (token.startsWith("--")) {
      const [key, value] = token.slice(2).split("=");
      if (key) {
        flags[key] = value !== undefined ? value : true;
      }
    } else {
      args.push(token);
    }
  }

  return { command, args, flags };
}

// ─── help ────────────────────────────────────────────────────────────────────

function printHelp(): void {
  console.log(`
@devapps/vue-kit CLI — v0.1.0

Usage:
  npx devapps-vue <command> <name> [options]

Commands:
  make:module    <Name>  --type=basic|resource|crud|dashboard  --ui=modal|page
  make:component <Name>
  make:page      <Name>
  make:service   <Name>
  make:store     <Name>
  make:type      <Name>

Options:
  --type=<type>   Module type (basic, resource, crud, dashboard). Default: crud
  --ui=<ui>       UI mode for crud modules (modal, page). Default: modal
  --force         Overwrite existing files
  --help          Show this help message

Examples:
  npx devapps-vue make:module Customer --type=crud --ui=modal
  npx devapps-vue make:module Customer --type=crud --ui=page
  npx devapps-vue make:component CustomerCard
  npx devapps-vue make:page CustomerDashboard
  npx devapps-vue make:service Customer
  npx devapps-vue make:store Customer
  npx devapps-vue make:type Customer
`);
}

// ─── main ────────────────────────────────────────────────────────────────────

export function run(argv: string[] = process.argv): void {
  const { command, args, flags } = parseArgs(argv);

  if (!command || flags["help"]) {
    printHelp();
    return;
  }

  const name = args[0];

  if (!name && command !== "--help") {
    console.error(`\n❌ Missing name argument for command: ${command}\n`);
    printHelp();
    process.exit(1);
  }

  const force = flags["force"] === true || flags["force"] === "true";

  try {
    switch (command) {
      case "make:module":
        MakeModuleCommand(name!, {
          type: (flags["type"] as ModuleType) ?? "crud",
          ui: (flags["ui"] as UiMode) ?? "modal",
          force,
        });
        break;

      case "make:component":
        MakeComponentCommand(name!, { name: name!, force });
        break;

      case "make:page":
        MakePageCommand(name!, { name: name!, force });
        break;

      case "make:service":
        MakeServiceCommand(name!, { name: name!, force });
        break;

      case "make:store":
        MakeStoreCommand(name!, { name: name!, force });
        break;

      case "make:type":
        MakeTypeCommand(name!, { name: name!, force });
        break;

      default:
        console.error(`\n❌ Unknown command: "${command}"\n`);
        printHelp();
        process.exit(1);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(`\n❌ ${err.message}\n`);
    } else {
      console.error("\n❌ An unexpected error occurred.\n");
    }
    process.exit(1);
  }
}
