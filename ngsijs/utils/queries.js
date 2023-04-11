const cygnusMySQLToolkit = require("./cynus-mysql.toolkit");

/**
 * Cygnus Entity Query List
 */
const getEntityHistory = (mysqlConnection, entityId) =>
  cygnusMySQLToolkit.runQuery(
    mysqlConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId}`
  );

const getEntityHistoryFromAttribute = (mysqlConnection, entityId, attrName) =>
  cygnusMySQLToolkit.runQuery(
    mysqlConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE attrName = '${attrName}'`
  );

const getEntityHistoryFromLimit = (mysqlConnection, entityId, limit) =>
  cygnusMySQLToolkit.runQuery(
    mysqlConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} LIMIT ${limit}`
  );

const getEntityHistoryFromDateRanges = (
  mysqlConnection,
  entityId,
  startDate,
  endDate
) =>
  cygnusMySQLToolkit.runQuery(
    mysqlConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE recvTime BETWEEN '${startDate}' AND '${endDate}'`
  );

const getEntityHistoryFromAttributeAndLimit = (
  mysqlConnection,
  entityId,
  attrName,
  limit
) =>
  cygnusMySQLToolkit.runQuery(
    mysqlConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE attrName = '${attrName}' LIMIT ${limit}`
  );

const getEntityHistoryFromAttributeAndDateRanges = (
  mysqlConnection,
  entityId,
  attrName,
  startDate,
  endDate
) =>
  cygnusMySQLToolkit.runQuery(
    mysqlConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE attrName = '${attrName}' AND recvTime BETWEEN '${startDate}' AND '${endDate}'`
  );

const getEntityHistoryFromDateRangesAndLimit = (
  mysqlConnection,
  entityId,
  startDate,
  endDate,
  limit
) =>
  cygnusMySQLToolkit.runQuery(
    mysqlConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE recvTime BETWEEN '${startDate}' AND '${endDate}' LIMIT ${limit}`
  );

const getEntityHistoryFromAttributeAndDateRangesAndLimit = (
  mysqlConnection,
  entityId,
  attrName,
  startDate,
  endDate,
  limit
) =>
  cygnusMySQLToolkit.runQuery(
    mysqlConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE attrName = '${attrName}' AND recvTime BETWEEN '${startDate}' AND '${endDate}' LIMIT ${limit}`
  );

/**
 * Cygnus Repetitions Query List
 */
const makeRepetition = (mysqlConnection, ngsiConnection, globalEntities) =>
  new Promise(async (resolve, reject) => {
    // Make sure repetitions table exists
    try {
      await cygnusMySQLToolkit.runQuery(
        mysqlConnection,
        "CREATE TABLE IF NOT EXISTS `repetitions` (`id` int(11) NOT NULL AUTO_INCREMENT, `startDate` datetime, `endDate` datetime, PRIMARY KEY (`id`))"
      );
    } catch (error) {
      reject(error);
    }

    // Register a new repetition entry with current datetime and undefined endDate
    try {
      await cygnusMySQLToolkit.runQuery(
        mysqlConnection,
        `INSERT INTO repetitions (startDate, endDate) VALUES ('${cygnusMySQLToolkit.dateToSQLDateTime(
          new Date()
        )}', NULL)`
      );
    } catch (error) {
      reject(error);
    }

    // Update all the entities given the repetition configuration
    await Promise.all(
      globalEntities.map((entity) =>
        ngsiConnection.v2.updateEntityAttributes(entity).then(
          (response) => {},
          (error) => {
            reject(error.message);
          }
        )
      )
    );

    // If previous operations were successful, promise can resolve
    resolve(
      "Repetition successfully propagated through the Context Broker and the historical sink."
    );
  });

module.exports = {
  getEntityHistory,
  getEntityHistoryFromAttribute,
  getEntityHistoryFromLimit,
  getEntityHistoryFromDateRanges,
  getEntityHistoryFromAttributeAndLimit,
  getEntityHistoryFromAttributeAndDateRanges,
  getEntityHistoryFromDateRangesAndLimit,
  getEntityHistoryFromAttributeAndDateRangesAndLimit,
  makeRepetition,
};
