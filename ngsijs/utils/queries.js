const cygnusMySQLToolkit = require("./cynus-mysql.toolkit");

/**
 *  Get an entity history given its NGSIv2 id
 *
 * @param {mysql.Connection} mySQLConnection
 * @param {Integer} entityId
 */
const getEntityHistory = (mySQLConnection, entityId) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, attrType, recvTime FROM ${entityId}`
  );

/**
 * Get an entity's attribute history given its name and its entity NGSIv2 id
 *
 * @param {mysql.Connection} mySQLConnection
 * @param {String} entityId
 * @param {String} attrName
 */
const getEntityHistoryFromAttribute = (mySQLConnection, entityId, attrName) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, attrType, recvTime FROM ${entityId} WHERE attrName = '${attrName}'`
  );

/**
 * Get an entity history given its NGSIv2 id limiting the number of entries to be returned
 *
 * @param {mysql.Connection} mySQLConnection
 * @param {Integer} entityId
 * @param {Integer} limit
 */
const getEntityHistoryFromLimit = (mySQLConnection, entityId, limit) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, attrType, recvTime FROM ${entityId} LIMIT ${limit}`
  );

/**
 * Get an entity history given its NGSIv2 id and date ranges
 *
 * @param {mysql.Connection} mySQLConnection
 * @param {String} entityId
 * @param {Date} startDate
 * @param {Date} endDate
 */
const getEntityHistoryFromDateRanges = (
  mySQLConnection,
  entityId,
  startDate,
  endDate
) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, attrType, recvTime FROM ${entityId} WHERE recvTime BETWEEN '${startDate}' AND '${endDate}'`
  );

/**
 * Get an entity's attribute history given its name and its entity NGSIv2 id limiting the number of entries to be returned
 *
 * @param {mysql.Connection} mySQLConnection
 * @param {String} entityId
 * @param {String} attrName
 * @param {Integer} limit
 */
const getEntityHistoryFromAttributeAndLimit = (
  mySQLConnection,
  entityId,
  attrName,
  limit
) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, attrType, recvTime FROM ${entityId} WHERE attrName = '${attrName}' LIMIT ${limit}`
  );

/**
 * Get an entity's attribute history given its name and its entity NGSIv2 id given a date range
 *
 * @param {mysql.Connection} mySQLConnection
 * @param {String} entityId
 * @param {String} attrName
 * @param {Date} startDate
 * @param {Date} endDate
 */
const getEntityHistoryFromAttributeAndDateRanges = (
  mySQLConnection,
  entityId,
  attrName,
  startDate,
  endDate
) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, attrType, recvTime FROM ${entityId} WHERE attrName = '${attrName}' AND recvTime BETWEEN '${startDate}' AND '${endDate}'`
  );

/**
 * Get an entity history given its NGSIv2 id and a date range limiting the number of entries to be returned
 *
 * @param {mysql.Connection} mySQLConnection
 * @param {String} entityId
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {Integer} limit
 */
const getEntityHistoryFromDateRangesAndLimit = (
  mySQLConnection,
  entityId,
  startDate,
  endDate,
  limit
) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT attrName, attrValue, attrType, recvTime FROM ${entityId} WHERE recvTime BETWEEN '${startDate}' AND '${endDate}' LIMIT ${limit}`
  );

/**
 * Get an entity's attribute history given its name and its entity NGSIv2 id and a date range limiting the number of entries to be returned
 *
 * @param {mysql.Connection} mySQLConnection
 * @param {String} entityId
 * @param {String} attrName
 * @param {Date} startDate
 * @param {Date} endDate
 * @param {Integer} limit
 */
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
    `SELECT attrName, attrValue, attrType, recvTime FROM ${entityId} WHERE attrName = '${attrName}' AND recvTime BETWEEN '${startDate}' AND '${endDate}' LIMIT ${limit}`
  );

/**
 *  Start a repetition by propagating this to the repetitions table
 *
 * @param {mysql.Connection} mySQLConnection
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

/**
 *  End a repetition by its id by updating its endDate attribute on the repetitions table
 *
 * @param {mysql.Connection} mySQLConnection
 * @param {Integer} repetitionId
 */
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

/**
 *  Get an entity's closest recvTime attribute value given a dateTime value
 *
 * @param {mysql.Connection} mySQLConnection
 * @param {String} entityId
 * @param {Date} dateTime
 * @returns closest recvTime attribute value
 */
const getClosestRecvTime = (mySQLConnection, entityId, dateTime) =>
  cygnusMySQLToolkit.runQuery(
    mySQLConnection,
    `SELECT recvTime FROM ${entityId} ORDER BY ABS(DATEDIFF(recvTime, '${dateTime}')) LIMIT 1`
  );

/**
 *  Get the index to be used in the next repetition by incrementing the current one
 *
 * @param {mysql.Connection} mySQLConnection
 * @returns index of the next repetition
 */
const getNextRepetitionIndex = (mySQLConnection) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await cygnusMySQLToolkit.runQuery(
        mySQLConnection,
        `SELECT id FROM repetitions ORDER BY id DESC LIMIT 1`
      );
      // Increment last repetition index before resolving
      resolve(result[0].id + 1);
    } catch (error) {
      reject(error);
    }
  });

/**
 *
 * @param {*} mySQLConnection
 * @param {*} repetitionId
 * @returns
 */
const getRepetitionStartDate = (mySQLConnection, repetitionId) =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await cygnusMySQLToolkit.runQuery(
        mySQLConnection,
        `SELECT startDate FROM repetitions WHERE id = ${repetitionId}`
      );
      resolve(result[0].startDate);
    } catch (error) {
      reject(error);
    }
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
  getClosestRecvTime,
  getRepetitionStartDate,
  getNextRepetitionIndex,
  startRepetition,
  endRepetition,
};
