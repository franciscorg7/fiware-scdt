/**
 * Cygnus Entity Query List
 */

const getEntityHistory = (mysqlConnection, entityId) =>
  new Promise((resolve, reject) => {
    mysqlConnection.query(
      `SELECT attrName, attrValue, recvTime FROM ${entityId}`,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  });

const getEntityHistoryFromAttribute = (mysqlConnection, entityId, attrName) =>
  new Promise((resolve, reject) => {
    mysqlConnection.query(
      `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE attrName = '${attrName}'`,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  });

const getEntityHistoryFromLimit = (mysqlConnection, entityId, limit) =>
  new Promise((resolve, reject) => {
    mysqlConnection.query(
      `SELECT attrName, attrValue, recvTime FROM ${entityId} LIMIT ${limit}`,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  });

const getEntityHistoryFromDateRanges = (
  mysqlConnection,
  entityId,
  startDate,
  endDate
) =>
  new Promise((resolve, reject) => {
    mysqlConnection.query(
      `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE recvTime BETWEEN '${startDate}' AND '${endDate}'`,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  });

const getEntityHistoryFromAttributeAndLimit = (
  mysqlConnection,
  entityId,
  attrName,
  limit
) =>
  new Promise((resolve, reject) => {
    mysqlConnection.query(
      `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE attrName = '${attrName}' LIMIT ${limit}`,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  });

const getEntityHistoryFromAttributeAndDateRanges = (
  mysqlConnection,
  entityId,
  attrName,
  startDate,
  endDate
) =>
  new Promise((resolve, reject) => {
    mysqlConnection.query(
      `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE attrName = '${attrName}' AND recvTime BETWEEN '${startDate}' AND '${endDate}'`,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  });

const getEntityHistoryFromDateRangesAndLimit = (
  mysqlConnection,
  entityId,
  startDate,
  endDate,
  limit
) =>
  new Promise((resolve, reject) => {
    mysqlConnection.query(
      `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE recvTime BETWEEN '${startDate}' AND '${endDate}' LIMIT ${limit}`,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  });

const getEntityHistoryFromAttributeAndDateRangesAndLimit = (
  mysqlConnection,
  entityId,
  attrName,
  startDate,
  endDate,
  limit
) =>
  new Promise((resolve, reject) => {
    mysqlConnection.query(
      `SELECT attrName, attrValue, recvTime FROM ${entityId} WHERE attrName = '${attrName}' AND recvTime BETWEEN '${startDate}' AND '${endDate}' LIMIT ${limit}`,
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  });

/**
 * Cygnus Repetitions List
 */
const makeRepetition = (mysqlConnection) => {
  // TODO: continue with makeRepetition flow. first create repetitions table if doesn't exist, then create a new repetition entry and then update entity dummies repetition attribute
  new Promise((resolve, reject) => {
    mysqlConnection.query(
      "CREATE TABLE IF NOT EXISTS `repetitions` (`id` int(11) NOT NULL AUTO_INCREMENT, `startDate` datetime NOT NULL, `endDate` datetime NOT NULL, PRIMARY KEY (`id`))",
      (err, results) => {
        if (err) reject(err);
        resolve(results);
      }
    );
  });
};

module.exports = {
  getEntityHistory,
  getEntityHistoryFromAttribute,
  getEntityHistoryFromLimit,
  getEntityHistoryFromDateRanges,
  getEntityHistoryFromAttributeAndLimit,
  getEntityHistoryFromAttributeAndDateRanges,
  getEntityHistoryFromDateRangesAndLimit,
  getEntityHistoryFromAttributeAndDateRangesAndLimit,
};
