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

/**
 * Given a mysqlConnection instance and a SQL query returns a promise with that query result
 *
 * @param {mysql.Connection} mysqlConnection
 * @param {string} query
 * @returns query result
 */
const runQuery = (mysqlConnection, query) =>
  new Promise((resolve, reject) => {
    mysqlConnection.query(query, (error, results, _) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });

/**
 * Given a date, convert it to a SQL datetime
 * @param {Date} date
 * @returns SQL datetime format
 */
const dateToSQLDateTime = (date) =>
  date.toISOString().slice(0, 19).replace("T", " ");

/**
 * Since MySQL data comes in string format, parse it regarding the attribute type
 *
 * @param {String} attrValue
 * @param {String} attrType
 * @returns parsed attribute value
 */
const parseMySQLAttrValue = (attrValue, attrType) => {
  attrType = attrType.toUpperCase();
  switch (attrType) {
    case "INTEGER":
      return parseInt(attrValue);
    case "FLOAT" || "DOUBLE":
      return parseFloat(attrValue);
    default:
      return attrValue;
  }
};

/**
 * Get global dummy state from the current context with the repetition entity modifications
 *
 * @param {Array} globalEntities
 * @param {Array} entitiesModified
 * @param {Integer} nextRepetitionId
 * @returns an array of all the dummy entities on the repetition modifications
 */
const getContextOnRepetition = async (
  globalEntities,
  entitiesModified,
  nextRepetitionId
) => {
  // Initialize modifications auxiliar variables
  let entityMod;
  let attrsMod;

  // Get current repetition index (all dummies must share the same global repetition index)
  currentRepetition = globalEntities.find((entity) =>
    entity.id.includes(":dummy")
  ).repetition.value;

  // Select only the original entities (and not their dummies since we want the original entities current state)
  globalEntities = globalEntities.filter(
    (entity) => !entity.id.includes(":dummy")
  );

  // Get each entity original state, mirror it to its dummy and update current repetition index
  globalEntities = globalEntities.map((entity) => {
    // Check if there are any modification to make to current entity and update auxiliar variables
    entityMod = entitiesModified.find((e) => e.id === entity.id);
    attrsMod =
      entityMod && Object.keys(entityMod).filter((key) => key !== "id");

    // If entity has modifications, loop through its attributes in order to update the original ones and store them in the dummy
    if (entityMod && attrsMod) {
      for (const attr of attrsMod) {
        entity[attr].value = entityMod[attr].value;
      }
    }
    // Associate original entity current state with its dummy
    entity.id += ":dummy";
    // Increment entity dummy repetition index
    entity.repetition = {
      type: "Integer",
      value: nextRepetitionId,
    };
    return entity;
  });
  return globalEntities;
};

module.exports = {
  replaceAll,
  getEntityType,
  matchMySQLTableName,
  runQuery,
  dateToSQLDateTime,
  parseMySQLAttrValue,
  getContextOnRepetition,
};
