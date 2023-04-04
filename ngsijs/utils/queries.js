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
