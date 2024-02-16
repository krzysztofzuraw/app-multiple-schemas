export const getSaleorVersion = (header: string | undefined | string[]) => {
  if (header && !Array.isArray(header)) {
    return parseFloat(header);
  }
  // fallback to Saleor 3.14
  return 3.14;
};
