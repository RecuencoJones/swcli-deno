import { printColumns } from "../util/format.ts";
import { getID } from "./common.ts";

export type ListOptions = {
  page?: number;
  json?: boolean;
  pagination?: boolean;
};

export async function list(entity: string, options: ListOptions) {
  const response = await fetch(
    `https://swapi.dev/api/${entity}/?page=${options.page}`,
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
