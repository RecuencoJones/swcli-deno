import { Args, CLIError } from "../../../util/cli.ts";
import { Entities } from "../../../util/entities.ts";
import { search } from "../../../services/search.ts";

export const handler = async (args: Args) => {
  const term = args._[0].toString();

  if (!term) {
    throw new CLIError("search requires at least one positional argument!");
  }

  const page = (args.page || args.P) ? parseInt(args.page || args.p) : 1;
  const json = args.json || args.J;
  const pagination = args.pagination || args.P;

  await search(Entities.PEOPLE, term, { page, json, pagination });
};
