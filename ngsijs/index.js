const NGSI = require("ngsijs");
const ngsiConnection = new NGSI.Connection("http://localhost:1026");
const express = require("express");
const mysql = require("mysql");
const contextBrokerToolkit = require("./utils/context-broker.toolkit");
const cygnusMySQLToolkit = require("./utils/cynus-mysql.toolkit");
const app = express();
const { mySQLConfig, API_PORT } = require("./config.js");
const {
  getEntityHistory,
  getEntityHistoryFromAttribute,
  getEntityHistoryFromLimit,
  getEntityHistoryFromDateRanges,
  getEntityHistoryFromAttributeAndLimit,
  getEntityHistoryFromAttributeAndDateRanges,
  getEntityHistoryFromDateRangesAndLimit,
  getEntityHistoryFromAttributeAndDateRangesAndLimit,
} = require("./utils/queries.js");

// Configure express to parse the request body as JSON
app.use(express.json({ extended: true }));

app.listen(API_PORT, () => {
  console.log(`ngsiJS server is running at: http://localhost:${API_PORT}/`);
});

/**
 * ORION CONTEXT BROKER ENTITIES
 */

// Lists all entities registered in the context broker server
app.get("/entity/list", (_, res) => {
  ngsiConnection.v2.listEntities().then((response) => {
    res.send(response.results);
  });
});

// Creates a new entity
app.post("/entity/create", (req, res) => {
  const entity = req.body;
  const dummy = contextBrokerToolkit.buildEntityDummy(entity);
  ngsiConnection.v2.createEntity(entity).then(
    () => {
      ngsiConnection.v2.createEntity(dummy).then(
        () =>
          res.send(
            "Both entity and its repetition dummy were successfuly created."
          ),
        (dummyError) => res.send(dummyError.message)
      );
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
  const dummyEntityId = entityId + ":dummy";
  ngsiConnection.v2.deleteEntity(entityId).then(
    () => {
      ngsiConnection.v2.deleteEntity(dummyEntityId).then(
        () =>
          res.send(
            "Both entity and its repetition dummy were successfuly deleted."
          ),
        (dummyError) => {
          res.send(dummyError.message);
        }
      );
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
app.get("/subscription/list", (_, res) => {
  ngsiConnection.v2.listSubscriptions().then((response) => {
    res.send(response.results);
  });
});

/**
 * CYGNUS MYSQL SINK
 */

// Create a mysql connection to cygnus-mysql sink
var mysqlConnection = mysql.createConnection(mySQLConfig);

// Lists all entries registered by Cygnus for the entity given its NGSI id
app.get("/history/entity/:id", (req, res) => {
  // Pre-process entity id to match mysql sink table name convention
  const entityId = cygnusMySQLToolkit.matchMySQLTableName(req.params.id);

  // Possible query parameters
  const attrName = req.query.attrName;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const limit = req.query.limit;

  if (attrName && startDate && endDate && limit)
    getEntityHistoryFromAttributeAndDateRangesAndLimit(
      mysqlConnection,
      entityId,
      attrName,
      startDate,
      endDate,
      limit
    ).then(
      (results) => res.send(results),
      (err) => res.send(err)
    );
  else if (attrName && startDate && endDate)
    getEntityHistoryFromAttributeAndDateRanges(
      mysqlConnection,
      entityId,
      attrName,
      startDate,
      endDate
    ).then(
      (results) => res.send(results),
      (err) => res.send(err)
    );
  else if (attrName && limit)
    getEntityHistoryFromAttributeAndLimit(
      mysqlConnection,
      entityId,
      attrName,
      limit
    ).then(
      (results) => res.send(results),
      (err) => res.send(err)
    );
  else if (startDate && endDate && limit)
    getEntityHistoryFromDateRangesAndLimit(
      mysqlConnection,
      entityId,
      startDate,
      endDate,
      limit
    ).then(
      (results) => res.send(results),
      (err) => res.send(err)
    );
  else if (attrName)
    getEntityHistoryFromAttribute(mysqlConnection, entityId, attrName).then(
      (results) => res.send(results),
      (err) => res.send(err)
    );
  else if (startDate && endDate)
    getEntityHistoryFromDateRanges(
      mysqlConnection,
      entityId,
      startDate,
      endDate
    ).then(
      (results) => res.send(results),
      (err) => res.send(err)
    );
  else if (limit)
    getEntityHistoryFromLimit(mysqlConnection, entityId, limit).then(
      (results) => res.send(results),
      (err) => res.send(err)
    );
  else
    getEntityHistory(mysqlConnection, entityId).then(
      (results) => res.send(results),
      (err) => res.send(err)
    );
});

// Notify orion context broker and cygnus of an history repetition
app.post("/history/repeat", (req, res) => {
  const entitiesModified = req.body.entities;
  // const startDate = req.body.startDate;

  // Extract ids from given entities in the request
  const entitiesModifiedIds = entitiesModified.map((entity) => entity.id);

  // Initialize auxiliar entity lists
  let globalEntities = [];
  let globalEntitiesIds = [];

  // Get all simulation involved entities
  ngsiConnection.v2.listEntities().then((response) => {
    globalEntities = response.results;
    globalEntitiesIds = globalEntities.map((entity) => entity.id);

    // Loop through the list of requested entity modifications to the repetition
    entitiesModifiedIds.forEach((id) => {
      if (globalEntitiesIds.includes(id)) {
        const entityMod = entitiesModified.find((e) => e.id === id);
        const attrsMod = Object.keys(entityMod).filter((key) => key !== "id");
        globalEntities.map((entity) => {
          if (entity.id === id) {
            for (const attr of attrsMod) {
              entity[attr].value = entityMod[attr].value;
            }
          }
          return entity;
        });
      }
    });
    res.send(globalEntities);
  });
  // cygnusMySQLToolkit.matchMySQLTableName(id);
  // getEntityHistoryFromDateRanges();
});
