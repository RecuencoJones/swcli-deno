import { createCLI } from "./util/cli.ts";
import * as people from "./mod/people/index.ts";
import * as starships from "./mod/starships/index.ts";

createCLI("swcli")
  .version("0.1.0")
  .description("Use https://swapi.dev from your terminal")
  .mod(people.init)
  .mod(starships.init)
  .parse();
