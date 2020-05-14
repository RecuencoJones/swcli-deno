import { Args } from "../../../../../util/cli.ts";
import { Entities } from "../../../../../util/entities.ts";
import { get } from "../../../../../services/get.ts";

export const usage = "<id>";

export const description = "Retrieve a starship by its id";

export const flags = {
  json: "Display raw json data",
};

export const handler = async (args: Args) => {
  const id = args._[0].toString();
  const json = args.json || args.J;

  await get(Entities.STARSHIPS, id, { json });
};
