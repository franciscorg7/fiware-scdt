const NGSI = require("ngsijs");
const connection = new NGSI.Connection("http://localhost:1026");
connection.v2.listEntities().then((response) => {
  response.results.forEach((entity) => {
    console.log(entity.id);
  });
});
