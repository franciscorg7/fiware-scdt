/**
 * Given a string, an occurence and a replacement, returns the original string with all the ocurrences replaced.
 *
 * @param {string} string
 * @param {string} occurence
 * @param {string} replacement
 * @returns new string with all the occurences replaced
 */
const replaceAll = (string, occurence, replacement) =>
  string.split(occurence).join(replacement);

/**
 *  Gets the entity type based on its identifier (using NGSI entity adopted structure `[type]:[name]:[idNum]`)
 *
 * @param {string} entityId
 * @returns entity type
 */
const getEntityType = (entityId) => {
  const type = entityId.split(":")[0];
  return type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 *  Use replaceAll and getEntityType to translate NGSI entity id adopted structure `[type]:[name]:[idNum]`
 *  into MySQL tables name convention `[type]_[name]_[idNum]_[Type]`.
 *
 * @param {string} id
 * @returns corresponding entity MySQL table name
 */
const matchMySQLTableName = (id) =>
  replaceAll(id, ":", "_") + "_" + getEntityType(id);

module.exports = { replaceAll, getEntityType, matchMySQLTableName };
