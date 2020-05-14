import { parse, Args } from "https://deno.land/std/flags/mod.ts";
import { printColumns } from "../util/format.ts";

export type Handler = (args: Args) => void | Promise<void>;

export interface CLI {
  version(str: string): CLI;
  description(str: string): CLI;
  mod(nameOrOptions: ModOptions["name"] | ModOptions): CLI;
  cmd(name: string, handlerOrOptions: CmdOptions["handler"] | CmdOptions): CLI;
  handler(handlerOrOptions: CmdOptions["handler"] | CmdOptions): CLI;
  parse(): void;
}

export type CmdOptions = {
  name?: string;
  description?: string;
  usage?: string;
  flags?: Record<string, string>;
  handler: Handler;
};

export type ModOptions = {
  name: string;
  description?: string;
  builder: (mod: CLI) => CLI;
};

function formatCommandLine(cliName: string, cmd: CmdOptions) {
  const parts = [`${cliName}`];

  if (cmd.name) parts.push(cmd.name);

  if (cmd.usage) {
    parts.push(cmd.usage);
  } else {
    parts.push("[flags]");
  }

  return parts.join(" ");
}

function formatModuleLine(cliName: string, modName: string) {
  return `${cliName} ${modName} <command> [flags]`;
}

const usageRows = Object.freeze({ "0": "", "1": "", "2": "" });

function printUsage(cli: InternalCLIModule, handler?: CmdOptions) {
  const lines = [];
  const columns: Array<Record<string, string>> = [];

  if (!handler) {
    lines.push(`${cli.name} ${cli._version || ""}`);
  } else {
    lines.push(`${cli.name} ${handler.name}`);
  }

  if (cli._description) {
    lines.push("", cli._description);
  }

  columns.push(usageRows);
  columns.push({ ...usageRows, "0": "Usage:" });

  if (handler) {
    columns.push({
      ...usageRows,
      "1": formatCommandLine(cli.name, handler),
      "2": handler.description as string,
    });
  } else {
    cli.defaultHandler && columns.push({
      ...usageRows,
      "1": formatCommandLine(cli.name, cli.defaultHandler),
      "2": cli.defaultHandler.description as string,
    });

    Object.keys(cli._commands).forEach((cmd) => {
      columns.push({
        ...usageRows,
        "1": formatCommandLine(cli.name, cli._commands[cmd]),
        "2": cli._commands[cmd].description as string,
      });
    });

    Object.keys(cli._modules).forEach((mod) => {
      columns.push({
        ...usageRows,
        "1": formatModuleLine(cli.name, mod),
        "2": cli._modules[mod]._description as string,
      });
    });
  }

  columns.push({});

  columns.push({
    ...usageRows,
    "0": "Flags:",
  });

  if (handler?.flags) {
    Object.entries(handler.flags).forEach(([key, value]) => {
      columns.push({
        ...usageRows,
        "1": key.length === 1 ? `-${key}` : `--${key}`,
        "2": value,
      });
    });
  }

  columns.push({
    ...usageRows,
    "1": "-h, --help",
    "2": "Display this dialog",
  });

  console.log(lines.join("\n"));

  printColumns(columns, { skipHeaders: true });
}

export class CLIError extends Error {}

class InternalCLIModule implements CLI {
  public name: string;
  public shortName: string;
  public _version?: string;
  public _description?: string;
  public _modules: Record<string, InternalCLIModule> = {};
  public _commands: Record<string, CmdOptions> = {};
  public defaultHandler: CmdOptions = { handler: () => printUsage(this) };

  constructor(name: string, protected readonly parent?: CLI) {
    this.shortName = name;
    this.name = this.parent
      ? `${(this.parent as InternalCLIModule).name} ${name}`
      : name;
  }

  version(str: string) {
    this._version = str;

    return this;
  }

  description(str: string) {
    this._description = str;

    return this;
  }

  mod(options: ModOptions) {
    const mod = options.builder(
      createModule(options.name, this),
    ) as InternalCLIModule;

    this._modules[mod.shortName] = mod;

    return this;
  }

  cmd(name: string, handlerOrOptions: CmdOptions["handler"] | CmdOptions) {
    let options: CmdOptions;

    if (typeof handlerOrOptions === "function") {
      options = { name, handler: handlerOrOptions };
    } else {
      options = { name, ...handlerOrOptions };
    }

    this._commands[name] = options as CmdOptions;

    return this;
  }

  handler(handlerOrOptions: CmdOptions["handler"] | CmdOptions) {
    this.defaultHandler = typeof handlerOrOptions === "function"
      ? { handler: handlerOrOptions }
      : handlerOrOptions;

    return this;
  }

  protected async start(args: Args) {
    try {
      const firstPositional = args._[0]?.toString();

      if (Object.keys(this._modules).includes(firstPositional)) {
        const mod = this._modules[firstPositional];

        if (!args._.slice(1).length && (args.help || args.h)) {
          printUsage(mod);
        } else {
          await mod.start({
            ...args,
            _: args._.slice(1),
          });
        }
      } else if (Object.keys(this._commands).includes(firstPositional)) {
        if (args.h || args.help) {
          printUsage(this, this._commands[firstPositional]);
        } else {
          await this._commands[firstPositional].handler({
            ...args,
            _: args._.slice(1),
          });
        }
      } else {
        if (args.h || args.help) {
          printUsage(this);
        } else {
          await this.defaultHandler.handler(args);
        }
      }
    } catch (e) {
      if (e instanceof CLIError) {
        printUsage(this);
        console.log();
        console.error(e.message);
        Deno.exit(1);
      } else {
        throw e;
      }
    }
  }

  parse() {
    if (this.parent) {
      throw new Error("Calling parse() is only allowed from root cli module!");
    }

    const { args } = Deno;
    this.start(parse(args));
  }
}

export function createCLI(name: string): CLI {
  return new InternalCLIModule(name);
}

export function createModule(name: string, parent: CLI): CLI {
  return new InternalCLIModule(name, parent);
}

export function importDynamicModule(path: string) {
  return (cli: CLI) => import(path).then(({ init }) => init(cli));
}
