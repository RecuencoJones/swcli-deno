import { createModule, CLI } from "../../util/cli.ts";
import * as list from "./cmd/list.ts";
import * as search from "./cmd/search.ts";
import * as get from "./mod/get/index.ts";

export const name = "starships";

export const builder = (mod: CLI) =>
  mod
    .cmd("list", list)
    .cmd("search", search)
    .mod(get);
