import { createModule, CLI } from "../../util/cli.ts";
import * as list from "./cmd/list.ts";
import * as search from "./cmd/search.ts";
import * as get from "./mod/get/index.ts";

export const init = (parent: CLI) =>
  createModule("starships", parent)
    .cmd("list", list)
    .cmd("search", search)
    .mod(get.init);
