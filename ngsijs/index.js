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

// Gets an entity from the context broker server given its id
app.get("/entity/:id", (req, res) => {
  const entityId = req.params.id;
  ngsiConnection.v2.getEntity(entityId).then(
    (response) => {
      res.send({
        data: {
          ...response,
          message:
            "Entity was successfully retrieved from the Context Broker Server.",
        },
      });
    },
    (error) => res.send(error)
  );
});

// Creates a new entity
app.post("/entity/create", (req, res) => {
  const entity = contextBrokerToolkit.buildEntity(req.body);
  const dummy = contextBrokerToolkit.buildEntityDummy(entity);
  // Call the create method for the new entity
  ngsiConnection.v2.createEntity(entity).then(
    (result) => {
      // After being created the new entity, replicate the process for its dummy clone
      ngsiConnection.v2.createEntity(dummy).then(
        async (dummyResult) => {
          // Try to build subscriptions for the entity and its dummy replication and register them in the Context Broker Server
          try {
            const entityCygnusSubscription =
              await contextBrokerToolkit.buildCygnusSubscription(
                entity,
                `${entity.id} updates listener`
              );
            const dummyCygnusSubscription =
              await contextBrokerToolkit.buildCygnusSubscription(
                dummy,
                `${dummy.id} updates listener`
              );

            // Create both entity and dummy subscription in parallel and once they both finish, resolve the promise with all the data
            Promise.all([
              ngsiConnection.v2.createSubscription(entityCygnusSubscription),
              ngsiConnection.v2.createSubscription(dummyCygnusSubscription),
            ]).then(async (subscriptionResults) => {
              // After creating the subscriptions, update its reference inside the entity instance
              await ngsiConnection.v2.updateEntityAttributes({
                id: entity.id,
                subscriptions: {
                  type: "Array",
                  value: [subscriptionResults[0].subscription.id],
                },
              });
              // Do the same for its repetition dummy
              await ngsiConnection.v2.updateEntityAttributes({
                id: dummy.id,
                subscriptions: {
                  type: "Array",
                  value: [subscriptionResults[1].subscription.id],
                },
              });

              // Map entities subscription attribute response to match last context updates (prior to entity creation)
              result.entity.subscriptions.value = [
                subscriptionResults[0].subscription.id,
              ];
              dummyResult.entity.subscriptions.value = [
                subscriptionResults[1].subscription.id,
              ];
              res.send({
                data: {
                  entityResult: result,
                  entitySubscriptionResult: subscriptionResults[0], // entity subscription result
                  dummyResult: dummyResult,
                  dummySubscriptionResult: subscriptionResults[1], // dummy subscription result
                  message:
                    "Both entity and its repetition dummy were successfuly created. Cygnus is now listening to their changes.",
                },
              });
            });
          } catch (error) {
            // Catch any possible error related to the subscriptions process
            res.send(error);
          }
        },
        // Catch any possible error related to the entity dummy replication process
        (dummyError) => res.send(dummyError)
      );
    },
    // Catch any possible error related to the entity creation process
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
app.delete("/entity/:id/delete", async (req, res) => {
  // Get the entity id from the query parameters
  const entityId = req.params.id;

  // Catch case where the entity to be deleted is already a dummy
  if (entityId.includes(":dummy")) {
    try {
      // Save entity state before deleting it from the context broker server
      const dummyResult = await ngsiConnection.v2.getEntity(entityId);
      const dummyDelResult = await ngsiConnection.v2.deleteEntity(entityId);
      subscriptionIds = dummyResult.entity.subscriptions.value;
      subscriptionIds.forEach(async (id) => {
        await ngsiConnection.v2.deleteSubscription(id);
      });
      res.send({
        data: {
          dummyCorrelator: dummyDelResult.correlator,
          message:
            "The repetition dummy and its associated subscriptions were successfuly deleted.",
        },
      });
    } catch (error) {
      res.send(error);
    }
  } else {
    const dummyEntityId = entityId + ":dummy";
    try {
      // Save entity state before deleting it from the context broker server
      const entityResult = await ngsiConnection.v2.getEntity(entityId);
      const entityDelResult = await ngsiConnection.v2.deleteEntity(entityId);
      let subscriptionIds = entityResult.entity.subscriptions.value;
      subscriptionIds.forEach(async (id) => {
        await ngsiConnection.v2.deleteSubscription(id);
      });
      // Save entity state before deleting it from the context broker server
      const dummyResult = await ngsiConnection.v2.getEntity(dummyEntityId);
      const dummyDelResult = await ngsiConnection.v2.deleteEntity(
        dummyEntityId
      );
      subscriptionIds = dummyResult.entity.subscriptions.value;
      subscriptionIds.forEach(async (id) => {
        try {
          await ngsiConnection.v2.deleteSubscription(id);
        } catch (error) {
          console.log(error);
        }
      });
      res.send({
        data: {
          entityCorrelator: entityDelResult.correlator,
          dummyCorrelator: dummyDelResult.correlator,
          message:
            "Both entity, its repetition dummy and associated subscriptions were successfuly deleted.",
        },
      });
    } catch (error) {
      res.send(error);
    }
  }
});

/**
 * ORION CONTEXT BROKER SUBSCRIPTIONS
 */

// Creates a new subscription to the context broker server
app.post("/subscription/create", (req, res) => {
  const subscription = req.body;
  ngsiConnection.v2.createSubscription(subscription).then(
    (response) => {
      res.send({
        data: { ...response, message: "Subscription created successfully." },
      });
    },
    (error) => {
      res.send(error);
    }
  );
});

// Removes a subscription from the context broker server given its id
app.delete("/subscription/:id/delete", (req, res) => {
  const subscriptionId = req.params.id;
  ngsiConnection.v2.deleteSubscription(subscriptionId).then(
    (response) => {
      res.send({
        data: { ...response, message: "Subscription deleted successfully." },
      });
    },
    (error) => {
      res.send(error);
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
  const entitiesModified = req.body.entities || [];
  const startDate = req.body.startDate;
  const fromRepetition = req.body.fromRepetition;

  // Initialize auxiliar entity lists
  let globalEntities = [];

  // Get all simulation involved entities
  ngsiConnection.v2.listEntities().then(async (response) => {
    globalEntities = response.results;

    // Create a new repetition around the simulation state at a current time
    if (startDate) {
      globalEntities =
        await cygnusMySQLQueries.getContextOnRepetitionFromStartDate(
          globalEntities,
          entitiesModified,
          cygnusMySQLToolkit.dateToSQLDateTime(startDate)
        );
    } else if (fromRepetition) {
      // TODO: make endpoint work for the simulation state at a past repetition start
    }
    // Create a new repetition around current simulation context
    else {
      // Get global dummy context after starting a repetition with entity modifications
      globalEntities =
        await cygnusMySQLToolkit.getContextOnRepetitionFromCurrentContext(
          globalEntities,
          entitiesModified
        );

      // Update all the entities given the repetition configuration
      await Promise.all(
        globalEntities.map((entity) =>
          ngsiConnection.v2.updateEntityAttributes(entity).then(
            () => {},
            (error) => {
              reject(error.message);
            }
          )
        )
      );

      // After processing simulation state, propagate the repetition to Context Broker and historical sink
      cygnusMySQLQueries
        .startRepetition(mysqlConnection, ngsiConnection, globalEntities)
        .then(
          (results) => res.send(results),
          (error) => res.send(error)
        );
    }
  });
});

// Notify Orion Context Broker and Cygnus of the ending of a simulation repetition
app.patch("/history/repetition/end", (req, res) => {
  const repetitionId = req.body.repetitionId;

  // Id validation safety check
  if (!repetitionId)
    res.send({
      error: {
        code: "MISSING_REP_ID",
        message: "Repetition id must be provided.",
      },
    });

  cygnusMySQLQueries.endRepetition(mysqlConnection, repetitionId).then(
    (results) => {
      res.send(results);
    },
    (error) => {
      res.send(error);
    }
  );
});
