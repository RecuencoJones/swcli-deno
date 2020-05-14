import { createModule, CLI } from "../../../../util/cli.ts";
import * as index from "./cmd/index.ts";
import * as details from "./cmd/details.ts";

export const init = (parent: CLI) =>
  createModule("get", parent)
    .handler(index)
    .cmd("details", details);
