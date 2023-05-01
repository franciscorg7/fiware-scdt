/**
 * Given the array of history query options, return the correct query string
 *
 * @param {Array} options
 */
const buildHistoryOptionsQueryString = (options) => {
  const attrNames = options
    .map((option) => option.attrName)
    .filter((attr) => attr);
  const startDate = options.find((option) => option.startDate)?.startDate;
  const endDate = options.find((option) => option.endDate)?.endDate;
  let queryString = "";
  attrNames.map((attr) => (queryString += `attrName=${attr}&`));
  if (startDate) queryString += `startDate=${startDate}&`;
  if (endDate) queryString += `endDate=${endDate}&`;
  if (queryString.endsWith("&")) queryString = queryString.slice(0, -1);
  return queryString;
};

export { buildHistoryOptionsQueryString };
