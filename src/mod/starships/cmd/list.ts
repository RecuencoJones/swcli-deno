import { Handler } from "../../../util/cli.ts";
import { Entities } from "../../../util/entities.ts";
import { list } from "../../../services/list.ts";

export const description = "List starships";

export const flags = {
  page: "Page to retrieve",
  pagination: "Display pagination",
  json: "Display raw json data",
};

export const handler: Handler = async (args) => {
  const page = (args.page || args.P) ? parseInt(args.page || args.p) : 1;
  const json = args.json || args.J;
  const pagination = args.pagination || args.P;

  await list(Entities.STARSHIPS, { page, json, pagination });
};
