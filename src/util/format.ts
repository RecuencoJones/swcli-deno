function getMaxLength(items: Array<string>) {
  return items.reduce(
    (accum: number, next: string) => Math.max(accum, next?.length || -Infinity),
    -Infinity,
  );
}

function printRow(values: Array<string>) {
  console.log(values.join("\t"));
}

export function printColumns(
  items: Array<Record<string, string>>,
  options: any = {},
) {
  const colWidth: Record<string, number> = Object.keys(items[0]).reduce(
    (accum, key) => ({
      ...accum,
      [key]: getMaxLength(items.map((item) => item[key])),
    }),
    {},
  );

  if (!options.skipHeaders) {
    const headers = Object.keys(colWidth).map((key) =>
      key.toUpperCase().padEnd(colWidth[key])
    );

    printRow(headers);
  }

  items
    .map((item) =>
      Object.entries(item).reduce((accum, [key, value]) => ({
        ...accum,
        [key]: (value ?? "").padEnd(colWidth[key]),
      }), {})
    )
    .forEach((item) => {
      const cols: Array<string> = Object.values(item);

      printRow(cols);
    });
}
