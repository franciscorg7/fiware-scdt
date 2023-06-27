const API_PORT = 8081;
const CYGNUS_HOST = "http://cygnus";
const CYGNUS_PORT = 5050;
const NGSI_HOST = "http://orion";
const NGSI_PORT = 1026;
const mySQLConfig = {
  host: "mysql-db",
  user: "root",
  password: "123",
  database: "default",
};

module.exports = {
  mySQLConfig,
  API_PORT,
  CYGNUS_HOST,
  CYGNUS_PORT,
  NGSI_HOST,
  NGSI_PORT,
};
