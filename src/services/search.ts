import ky from "https://unpkg.com/ky/index.js";
import { printColumns } from "../util/format.ts";
import { getID } from "./common.ts";
import { ListOptions } from "./list.ts";

export async function search(
  entity: string,
  term: string,
  options: ListOptions,
) {
  const response = await ky.get(
    `https://swapi.dev/api/${entity}/?search=${term}&page=${options.page}`,
  );
  const data = await response.json();

  if (options.json) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    const pagination: Array<string> = [""];

    if (data.previous) {
      pagination.push(`Previous page: ${data.previous}`);
    }

    if (data.next) {
      pagination.push(`Next page: ${data.next}`);
    }

    printColumns(data.results.map(({ url, name }: any) => ({
      id: getID(url),
      name,
      url,
    })));

    if (options.pagination) {
      console.log(pagination.join("\n"));
    }
  }
}
