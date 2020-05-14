import { createModule, CLI } from "../../../../util/cli.ts";
import * as index from "./cmd/index.ts";
import * as details from "./cmd/details.ts";

export const name = "get";

export const builder = (mod: CLI) =>
  mod
    .handler(index)
    .cmd("details", details);
