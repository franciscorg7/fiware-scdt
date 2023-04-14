const NGSI = require("ngsijs");
const ngsiConnection = new NGSI.Connection("http://localhost:1026");
const express = require("express");
const mysql = require("mysql");
const contextBrokerToolkit = require("./utils/context-broker.toolkit");
const cygnusMySQLToolkit = require("./utils/cynus-mysql.toolkit");
const app = express();
const { mySQLConfig, API_PORT } = require("./config.js");
const cygnusMySQLQueries = require("./utils/queries.js");

// Configure express to parse the request body as JSON
app.use(express.json({ extended: true }));

app.listen(API_PORT, () => {
  console.log(`ngsiJS server is running at: http://localhost:${API_PORT}/`);
});

// TODO: Review endpoint responses and uniformize them

/**
 * ORION CONTEXT BROKER ENTITIES
 */

// Lists all entities registered in the context broker server
app.get("/entity/list", (_, res) => {
  ngsiConnection.v2.listEntities().then(
    (response) => {
      res.send({
        data: {
          results: response.results,
          numOfEntitiesFound: response.results.length,
          message:
            "Entity list was successfully retrieved from the Context Broker Server.",
        },
      });
    },
    (error) => res.send(error)
  );
});

// Creates a new entity
app.post("/entity/create", (req, res) => {
  const entity = req.body;
  const dummy = contextBrokerToolkit.buildEntityDummy(entity);
  ngsiConnection.v2.createEntity(entity).then(
    (result) => {
      ngsiConnection.v2.createEntity(dummy).then(
        (dummyResult) =>
          res.send({
            data: {
              entityResult: result,
              dummyResult: dummyResult,
              message:
                "Both entity and its repetition dummy were successfuly created.",
            },
          }),
        (dummyError) => res.send(dummyError)
      );
    },
    (error) => {
      res.send(error);
    }
  );
});

// Updates attributes from an existing entity
app.post("/entity/update", (req, res) => {
  const changes = req.body;
  ngsiConnection.v2.updateEntityAttributes(changes).then(
    (response) => {
      res.send({
        data: {
          ...response,
          changes: changes,
          message: "Entity successfully updated.",
        },
      });
    },
    (error) => {
      res.send(error);
    }
  );
});

// Removes an entity from the context broker server given its id
app.delete("/entity/:id/delete", (req, res) => {
  const entityId = req.params.id;
  const dummyEntityId = entityId + ":dummy";

  ngsiConnection.v2.deleteEntity(entityId).then(
    (result) => {
      ngsiConnection.v2.deleteEntity(dummyEntityId).then(
        (dummyResult) =>
          res.send({
            data: {
              entityCorrelator: result.correlator,
              dummyCorrelator: dummyResult.correlator,
              message:
                "Both entity and its repetition dummy were successfuly deleted.",
            },
          }),
        (dummyError) => {
          res.send(dummyError);
        }
      );
    },
    (error) => {
      res.send(error);
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
    cygnusMySQLQueries
      .getEntityHistoryFromAttributeAndDateRangesAndLimit(
        mysqlConnection,
        entityId,
        attrName,
        startDate,
        endDate,
        limit
      )
      .then(
        (results) => res.send(results),
        (err) => res.send(err)
      );
  else if (attrName && startDate && endDate)
    cygnusMySQLQueries
      .getEntityHistoryFromAttributeAndDateRanges(
        mysqlConnection,
        entityId,
        attrName,
        startDate,
        endDate
      )
      .then(
        (results) => res.send(results),
        (err) => res.send(err)
      );
  else if (attrName && limit)
    cygnusMySQLQueries
      .getEntityHistoryFromAttributeAndLimit(
        mysqlConnection,
        entityId,
        attrName,
        limit
      )
      .then(
        (results) => res.send(results),
        (err) => res.send(err)
      );
  else if (startDate && endDate && limit)
    cygnusMySQLQueries
      .getEntityHistoryFromDateRangesAndLimit(
        mysqlConnection,
        entityId,
        startDate,
        endDate,
        limit
      )
      .then(
        (results) => res.send(results),
        (err) => res.send(err)
      );
  else if (attrName)
    cygnusMySQLQueries
      .getEntityHistoryFromAttribute(mysqlConnection, entityId, attrName)
      .then(
        (results) => res.send(results),
        (err) => res.send(err)
      );
  else if (startDate && endDate)
    cygnusMySQLQueries
      .getEntityHistoryFromDateRanges(
        mysqlConnection,
        entityId,
        startDate,
        endDate
      )
      .then(
        (results) => res.send(results),
        (err) => res.send(err)
      );
  else if (limit)
    cygnusMySQLQueries
      .getEntityHistoryFromLimit(mysqlConnection, entityId, limit)
      .then(
        (results) => res.send(results),
        (err) => res.send(err)
      );
  else
    cygnusMySQLQueries.getEntityHistory(mysqlConnection, entityId).then(
      (results) => res.send(results),
      (err) => res.send(err)
    );
});

// Notify Orion Context Broker and Cygnus of a simulation repetition
app.post("/history/repetition", (req, res) => {
  const entitiesModified = req.body.entities;
  const startDate = req.body.startDate;

  // Extract ids from given modified entities in the request
  const entitiesModifiedIds = entitiesModified.map((entity) => entity.id);

  // Initialize auxiliar entity lists
  let globalEntities = [];
  let globalEntitiesIds = [];
  let currentRepetition = 0;

  // Create a new repetition around the simulation state at a current time
  if (startDate) {
    // TODO: make endpoint work for the simulation state at a given start date
  }
  // Create a new repetition around current simulation state
  else {
    // Get all simulation involved entities
    ngsiConnection.v2.listEntities().then((response) => {
      globalEntities = response.results;
      globalEntitiesIds = globalEntities.map((entity) => entity.id);

      // Loop through the list of requested modified entities
      entitiesModifiedIds.forEach((id) => {
        if (globalEntitiesIds.includes(id)) {
          const entityMod = entitiesModified.find((e) => e.id === id);
          const attrsMod = Object.keys(entityMod).filter((key) => key !== "id");

          // Get current repetition index
          currentRepetition = globalEntities.find((entity) =>
            entity.id.includes(":dummy")
          ).repetition.value;

          // Select only the original entities (and not their dummies since we want the original entity current state)
          globalEntities = globalEntities.filter(
            (entity) => !entity.id.includes(":dummy")
          );

          // Get each entity original state, mirror it to its dummy and update current repetition index
          globalEntities = globalEntities.map((entity) => {
            if (entity.id === id) {
              // Loop through the modified attributes in order to update entity original ones
              for (const attr of attrsMod) {
                entity[attr].value = entityMod[attr].value;
              }
              // Associate original entity current state with its dummy
              entity.id += ":dummy";
              // Increment entity dummy repetition index
              entity.repetition = {
                type: "Integer",
                value: currentRepetition + 1,
                metadata: {},
              };
            }
            return entity;
          });
        }
      });

      // After processing simulation state, propagate the repetition to Context Broker and historical sink
      cygnusMySQLQueries
        .startRepetition(mysqlConnection, ngsiConnection, globalEntities)
        .then(
          (results) => res.send(results),
          (error) => res.send(error)
        );
    });
  }

  // cygnusMySQLToolkit.matchMySQLTableName(id);
  // getEntityHistoryFromDateRanges();
});

// Notify Orion Context Broker and Cygnus of the ending of a simulation repetition
app.patch("/history/repetition/end", (req, res) => {
  const repetitionId = req.body.repetitionId;

  // Id validation safety check
  if (!repetitionId) res.send("Repetition id must be provided.");

  cygnusMySQLQueries.endRepetition(mysqlConnection, repetitionId).then(
    (results) => {
      res.send(results);
    },
    (error) => {
      res.send(error);
    }
  );
});
