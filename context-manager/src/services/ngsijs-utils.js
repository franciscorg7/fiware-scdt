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

/**
 * Try to parse a string list of entities and return the JSON if successful
 *
 * @param {string} strListOfEntities
 * @returns {Object} parsed JSON
 */
const parseJSONEntities = (strListOfEntities) => {
  try {
    return JSON.parse(strListOfEntities);
  } catch (error) {
    return null;
  }
};

/**
 * Try to beautify a list of JSON entities and return it if successful
 *
 * @param {string} strListOfEntities
 * @returns {string} beauty stringified JSON
 */
const beautifyJSONEntities = (listOfEntitiesJSON) => {
  try {
    return JSON.stringify(listOfEntitiesJSON, null, 4);
  } catch (error) {
    return listOfEntitiesJSON;
  }
};

export {
  buildHistoryOptionsQueryString,
  parseJSONEntities,
  beautifyJSONEntities,
};
