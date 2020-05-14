export const getID = (url: string) =>
  url.replace(/\/$/, "").split("/").pop() as string;
