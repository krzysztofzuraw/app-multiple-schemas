export const getSaleorVersion = (header: string | undefined | string[]) => {
  if (header && !Array.isArray(header)) {
    return parseFloat(header);
  }
  throw new Error("Saleor version header is not a string");
};
