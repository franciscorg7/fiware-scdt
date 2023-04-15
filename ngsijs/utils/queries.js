const cygnusMySQLToolkit = require("./cynus-mysql.toolkit");

/**
 * Cygnus Entity Query List
 */
const getEntityHistory = (mySQLConnection, entityId) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId}`
  );

const getEntityHistoryFromAttribute = (mySQLConnection, entityId, attrName) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE attrName = '${attrName}'`
  );

const getEntityHistoryFromLimit = (mySQLConnection, entityId, limit) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} LIMIT ${limit}`
  );

const getEntityHistoryFromDateRanges = (
  mySQLConnection,
  entityId,
  startDate,
  endDate
) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE recvTime BETWEEN '${startDate}' AND '${endDate}'`
  );

const getEntityHistoryFromAttributeAndLimit = (
  mySQLConnection,
  entityId,
  attrName,
  limit
) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE attrName = '${attrName}' LIMIT ${limit}`
  );

const getEntityHistoryFromAttributeAndDateRanges = (
  mySQLConnection,
  entityId,
  attrName,
  startDate,
  endDate
) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE attrName = '${attrName}' AND recvTime BETWEEN '${startDate}' AND '${endDate}'`
  );

const getEntityHistoryFromDateRangesAndLimit = (
  mySQLConnection,
  entityId,
  startDate,
  endDate,
  limit
) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE recvTime BETWEEN '${startDate}' AND '${endDate}' LIMIT ${limit}`
  );

const getEntityHistoryFromAttributeAndDateRangesAndLimit = (
  mySQLConnection,
  entityId,
  attrName,
  startDate,
  endDate,
  limit
) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE attrName = '${attrName}' AND recvTime BETWEEN '${startDate}' AND '${endDate}' LIMIT ${limit}`
  );

/**
 * Cygnus Repetitions Query List
 */
const startRepetition = (mySQLConnection) =>
  new Promise(async (resolve, reject) => {
    let insertResult;

    // Make sure repetitions table exists
    try {
      await cygnusMySQLToolkit.runQuery(
        mySQLConnection,
        "CREATE TABLE IF NOT EXISTS `repetitions` (`id` int(11) NOT NULL AUTO_INCREMENT, `startDate` datetime, `endDate` datetime, PRIMARY KEY (`id`))"
      );
    } catch (error) {
      reject(error);
    }

    // Register a new repetition entry with current datetime and undefined endDate
    try {
      insertResult = await cygnusMySQLToolkit.runQuery(
        mySQLConnection,
        `INSERT INTO repetitions (startDate, endDate) VALUES ('${cygnusMySQLToolkit.dateToSQLDateTime(
          new Date()
        )}', NULL)`
      );
    } catch (error) {
      reject(error);
    }

    // Build response body
    const response = {
      data: {
        id: insertResult.insertId,
        message:
          "Repetition successfully propagated through the Context Broker and the historical sink.",
        startDate: cygnusMySQLToolkit.dateToSQLDateTime(new Date()),
      },
    };

    resolve(response);
  });

const endRepetition = (mySQLConnection, repetitionId) =>
  new Promise(async (resolve, reject) => {
    try {
      queryResult = await cygnusMySQLToolkit.runQuery(
        mySQLConnection,
        `UPDATE repetitions SET endDate = NOW() WHERE id = ${repetitionId}`
      );
      queryResult.affectedRows == 0 &&
        reject({
          error: {
            code: "NO_ROWS_MATCHED",
            message: "There is no repetition matching given id.",
          },
        });
    } catch (error) {
      reject(error);
    }

    // Response body
    const response = {
      data: {
        id: repetitionId,
        message: "Repetition successfully ended.",
        endDate: cygnusMySQLToolkit.dateToSQLDateTime(new Date()),
      },
    };

    // If patch operation was successful, promise can resolve
    resolve(response);
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
  startRepetition,
  endRepetition,
};
