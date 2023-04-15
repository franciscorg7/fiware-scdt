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
    mysqlConnection.query(query, (error, results, fields) => {
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
 * Get global dummy context after starting a repetition with entity modifications
 *
 * @param {Array} globalEntities
 * @param {Array} entitiesModified
 * @returns an array of all the dummy entities after repetition changes
 */
const getContextAfterRepetition = async (globalEntities, entitiesModified) => {
  // Extract ids from global entities
  let globalEntitiesIds = globalEntities.map((entity) => entity.id);

  // Extract ids from given modified entities
  const entitiesModifiedIds = entitiesModified.map((entity) => entity.id);

  entitiesModifiedIds.map(async (modifiedId) => {
    if (globalEntitiesIds.includes(modifiedId)) {
      const entityMod = entitiesModified.find((e) => e.id === modifiedId);
      const attrsMod = Object.keys(entityMod).filter((key) => key !== "id");

      // Get current repetition index (all dummies must share the same global repetition index)
      currentRepetition = globalEntities.find((entity) =>
        entity.id.includes(":dummy")
      ).repetition.value;

      // Select only the original entities (and not their dummies since we want the original entity current state)
      globalEntities = globalEntities.filter(
        (entity) => !entity.id.includes(":dummy")
      );

      // Get each entity original state, mirror it to its dummy and update current repetition index
      globalEntities = globalEntities.map((entity) => {
        // If modified, loop through entity attributes in order to update its original ones storing them in the dummy
        if (entity.id === modifiedId) {
          for (const attr of attrsMod) {
            entity[attr].value = entityMod[attr].value;
          }
        }
        // Associate original entity current state with its dummy
        entity.id += ":dummy";
        // Increment entity dummy repetition index
        entity.repetition = {
          type: "Integer",
          value: currentRepetition ? currentRepetition + 1 : 1,
          metadata: {},
        };
        return entity;
      });
    }
  });
  return globalEntities;
};

module.exports = {
  replaceAll,
  getEntityType,
  matchMySQLTableName,
  runQuery,
  dateToSQLDateTime,
  getContextAfterRepetition,
};
