import ky from "https://unpkg.com/ky/index.js";
import { printColumns } from "../util/format.ts";
import { getID } from "./common.ts";

export type GetOptions = {
  json?: boolean;
};

export async function get(entity: string, id: string, options: GetOptions) {
  const response = await ky.get(
    `https://swapi.dev/api/${entity}/${id}/`,
  );
  const data: Record<string, any> = await response.json();

  if (options.json) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    printColumns([data].map(({ url, name }: any) => ({
      id: getID(url),
      name,
      url,
    })));
  }
}
