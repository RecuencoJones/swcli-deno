import { createModule, CLI } from "../../util/cli.ts";
import * as list from "./cmd/list.ts";
import * as search from "./cmd/search.ts";
import * as get from "./cmd/get.ts";

export const name = "people";

export const builder = (mod: CLI) =>
  mod
    .cmd("list", list)
    .cmd("search", search)
    .cmd("get", get);
