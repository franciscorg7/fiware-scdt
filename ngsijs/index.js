const NGSI = require("ngsijs");
const ngsiConnection = new NGSI.Connection("http://localhost:1026");
const express = require("express");
const mysql = require("mysql");
const cygnusMySQLToolkit = require("./utils/cynus-mysql.toolkit");
const app = express();
const PORT = 8081;

// Configure express to parse the request body as JSON
app.use(express.json({ extended: true }));

app.listen(PORT, () => {
  console.log(`ngsiJS server running at: http://localhost:${PORT}/`);
});

/**
 * ORION CONTEXT BROKER ENTITIES
 */

// Lists all entities registered in the context broker server
app.get("/entity/list", (req, res) => {
  ngsiConnection.v2.listEntities().then((response) => {
    res.send(response.results);
  });
});

// Creates a new entity
app.post("/entity/create", (req, res) => {
  const entity = req.body;
  ngsiConnection.v2.createEntity(entity).then(
    (response) => {
      res.send(response);
    },
    (error) => {
      res.send(error.message);
    }
  );
});

// Updates attributes from an existing entity
app.post("/entity/update", (req, res) => {
  const changes = req.body;
  ngsiConnection.v2.updateEntityAttributes(changes).then(
    (response) => {
      res.send(response);
    },
    (error) => {
      res.send(error.message);
    }
  );
});

// Removes an entity from the context broker server given its id
app.delete("/entity/:id/delete", (req, res) => {
  const entityId = req.params.id;
  ngsiConnection.v2.deleteEntity(entityId).then(
    (response) => {
      res.send(response);
    },
    (error) => {
      res.send(error.message);
    }
  );
});

/**
 * ORION CONTEXT BROKER SUBSCRIPTIONS
 */

// Creates a new subscription to the context broker server
app.post("/subscription/create", (req, res) => {
  const subscription = req.body;
  ngsiConnection.v2.createSubscription(subscription).then(
    (response) => {
      res.send(response);
    },
    (error) => {
      res.send(error.message);
    }
  );
});

// Removes a subscription from the context broker server given its id
app.delete("/subscription/:id/delete", (req, res) => {
  const subscriptionId = req.params.id;
  ngsiConnection.v2.deleteSubscription(subscriptionId).then(
    (response) => {
      res.send(response);
    },
    (error) => {
      res.send(error.message);
    }
  );
});

// Updates an existing subscription
app.post("/subscription/update", (req, res) => {
  const changes = req.body;
  ngsiConnection.v2.updateSubscription(changes).then(
    (response) => {
      res.send(response);
    },
    (error) => {
      res.send(error.message);
    }
  );
});

// Lists all entities registered in the context broker server
app.get("/subscription/list", (req, res) => {
  ngsiConnection.v2.listSubscriptions().then((response) => {
    res.send(response.results);
  });
});

/**
 * CYGNUS MYSQL SINK
 */

// Create a mysql connection to cygnus-mysql sink
var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123",
  database: "default",
});

// Lists all entries registered by Cygnus for the entity given its NGSI id
app.get("/history/entity/:id", (req, res) => {
  // Pre-process entity id to match mysql sink table name convention
  const entityId = cygnusMySQLToolkit.matchMySQLTableName(req.params.id);
  const attrName = req.query.attrName;

  if (attrName)
    mysqlConnection.query(
      `SELECT * FROM ${entityId} WHERE attrName = '${attrName}'`,
      (err, results) => {
        if (err) res.send(err);
        res.send(results);
      }
    );
  else
    mysqlConnection.query(`SELECT * FROM ${entityId}`, (err, results) => {
      if (err) res.send(err);
      res.send(results);
    });
});
