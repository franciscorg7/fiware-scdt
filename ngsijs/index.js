const NGSI = require("ngsijs");
const ngsiConnection = new NGSI.Connection("http://orion:1026");
const express = require("express");
const mysql = require("mysql");
const contextBrokerToolkit = require("./utils/context-broker.toolkit");
const cygnusMySQLToolkit = require("./utils/cynus-mysql.toolkit");
const app = express();
const { mySQLConfig, API_PORT } = require("./config.js");
const cygnusMySQLQueries = require("./utils/queries.js");
const cors = require("cors");

// Configure express to parse the request body as JSON
app.use(express.json({ extended: true }));
app.use(cors());

app.listen(API_PORT, () => {
  console.log(`ngsiJS server is running at: http://ngsijs:${API_PORT}/`);
});

/**
 * ORION CONTEXT BROKER ENTITIES
 */

// Lists all entities registered in the context broker server
app.get("/entity/list", (req, res) => {
  const options = contextBrokerToolkit.buildEntityListOptions(req.query);
  ngsiConnection.v2
    .listEntities({
      ...options,
      limit: contextBrokerToolkit.MAX_NUMBER_OF_RESULTS,
    })
    .then(
      (response) => {
        res.json({
          results: response.results,
          numOfEntitiesFound: response.results.length,
        });
      },
      (error) => {
        res.status(503).json({ error: { ...error } });
      }
    );
});

// Gets an entity from the context broker server given its id
app.get("/entity/:id", (req, res) => {
  const entityId = req.params.id;
  ngsiConnection.v2.getEntity(entityId).then(
    (response) => {
      res.json(response);
    },
    (error) => res.status(404).json({ error: { ...error } })
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
              res.json({
                entityResult: result,
                entitySubscriptionResult: subscriptionResults[0], // entity subscription result
                dummyResult: dummyResult,
                dummySubscriptionResult: subscriptionResults[1], // dummy subscription result
                message:
                  "Both entity and its repetition dummy were successfuly created. Cygnus is now listening to their changes.",
              });
            });
          } catch (subscriptionError) {
            // Catch any possible error related to the subscriptions process
            res.status(500).json({ error: { ...subscriptionError } });
          }
        },
        // Catch any possible error related to the entity dummy replication process
        (dummyError) => res.status(500).json({ error: { ...dummyError } })
      );
    },
    // Catch any possible error related to the entity creation process
    (entityError) => {
      res.status(500).json({ error: { ...entityError } });
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
      let dummySubscriptionIds = dummyResult.entity.subscriptions.value;
      dummySubscriptionIds.forEach(async (id) => {
        try {
          await ngsiConnection.v2.deleteSubscription(id);
        } catch (error) {
          res.send(error);
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

// Lists all subscriptions registered in the context broker server
app.get("/subscription/list", (_, res) => {
  ngsiConnection.v2
    .listSubscriptions({ limit: contextBrokerToolkit.MAX_NUMBER_OF_RESULTS })
    .then(
      (response) => res.send({ results: response.results }),
      (error) => res.status(500).send(error)
    );
});

/**
 * CYGNUS MYSQL SINK
 */

// Create a mysql connection to cygnus-mysql sink
var mySQLConnection = mysql.createConnection(mySQLConfig);

// Lists all entries registered by Cygnus for the entity given its NGSI id
app.get("/history/entity/:id", (req, res) => {
  // Pre-process entity id to match mysql sink table name convention
  const entityId = cygnusMySQLToolkit.matchMySQLTableName(req.params.id);

  // Possible query parameters
  const attrNames = !req.query.attrName
    ? undefined
    : Array.isArray(req.query.attrName)
    ? req.query.attrName
    : [req.query.attrName];
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const limit = req.query.limit;

  if (attrNames && startDate && endDate && limit)
    cygnusMySQLQueries
      .getEntityHistoryFromAttributeAndDateRangesAndLimit(
        mySQLConnection,
        entityId,
        attrNames,
        startDate,
        endDate,
        limit
      )
      .then(
        (results) => res.json({ results: results }),
        (err) => res.status(500).send(err)
      );
  else if (attrNames && startDate && endDate)
    cygnusMySQLQueries
      .getEntityHistoryFromAttributeAndDateRanges(
        mySQLConnection,
        entityId,
        attrNames,
        startDate,
        endDate
      )
      .then(
        (results) => res.json({ results: results }),
        (err) => res.status(500).send(err)
      );
  else if (attrNames && limit)
    cygnusMySQLQueries
      .getEntityHistoryFromAttributeAndLimit(
        mySQLConnection,
        entityId,
        attrNames,
        limit
      )
      .then(
        (results) => res.json({ results: results }),
        (err) => res.status(500).send(err)
      );
  else if (startDate && endDate && limit)
    cygnusMySQLQueries
      .getEntityHistoryFromDateRangesAndLimit(
        mySQLConnection,
        entityId,
        startDate,
        endDate,
        limit
      )
      .then(
        (results) => res.json({ results: results }),
        (err) => res.status(500).send(err)
      );
  else if (attrNames)
    cygnusMySQLQueries
      .getEntityHistoryFromAttribute(mySQLConnection, entityId, attrNames)
      .then(
        (results) => res.json({ results: results }),
        (err) => res.status(500).send(err)
      );
  else if (startDate && endDate)
    cygnusMySQLQueries
      .getEntityHistoryFromDateRanges(
        mySQLConnection,
        entityId,
        startDate,
        endDate
      )
      .then(
        (results) => res.json({ results: results }),
        (err) => res.status(500).send(err)
      );
  else if (limit)
    cygnusMySQLQueries
      .getEntityHistoryFromLimit(mySQLConnection, entityId, limit)
      .then(
        (results) => res.json({ results: results }),
        (err) => res.status(500).send(err)
      );
  else
    cygnusMySQLQueries.getEntityHistory(mySQLConnection, entityId).then(
      (results) => res.json({ results: results }),
      (err) => res.status(500).send(err)
    );
});

// Notify Orion Context Broker and Cygnus of a simulation repetition
app.post("/history/repetition", async (req, res) => {
  const entitiesModified = req.body.entitiesModified || [];
  const startDate = req.body.startDate;
  const fromRepetition = req.body.fromRepetition;

  // Initialize auxiliar entity lists
  let globalEntities = [];

  // Initialize nextRepetitionId
  let nextRepetitionId;

  try {
    // Get the index to be used for this repetition
    nextRepetitionId = await cygnusMySQLQueries.getNextRepetitionIndex(
      mySQLConnection
    );
  } catch (error) {
    // If there was an error with getting repetitions table, it means that there was no repetition already
    nextRepetitionId = 1;
  }

  // Get all simulation involved entities
  ngsiConnection.v2
    .listEntities({ limit: contextBrokerToolkit.MAX_NUMBER_OF_RESULTS }) // get all the dummy entities in the simulation (noteice ngsiv2 API has 20 results set to default)
    .then(async (response) => {
      globalEntities = response.results;

      // Create a new repetition around the simulation state at a current time
      if (startDate) {
        // Loop through all entities and get their closest history state to the given startDate (storing all the mapping promises in mappedGlobalEntities)
        const mappedGlobalEntities = globalEntities.map(async (entity) => {
          // Get the closest recvTime value of the current entity to the given startDate
          const closestRecvTime = await cygnusMySQLQueries.getClosestRecvTime(
            mySQLConnection,
            cygnusMySQLToolkit.matchMySQLTableName(entity.id),
            startDate
          );

          // Get entity history state from date ranges (start date and end date are the same)
          const entityOnClosestRecvTime =
            await cygnusMySQLQueries.getEntityHistoryFromDateRanges(
              mySQLConnection,
              cygnusMySQLToolkit.matchMySQLTableName(entity.id),
              closestRecvTime[0].recvTime,
              closestRecvTime[0].recvTime
            );

          // Base for the entity instance build
          let buildEntity = {
            id: entity.id,
            type: entity.type,
          };

          // Update entity instance with past date historical data (regarding possibile input modifications)
          entityOnClosestRecvTime.map((attr) =>
            attr.attrName !== "repetition"
              ? (buildEntity[attr.attrName] = {
                  value: cygnusMySQLToolkit.parseMySQLAttrValue(
                    attr.attrValue,
                    attr.attrType
                  ),
                  type: attr.attrType,
                })
              : (buildEntity["repetition"] = {
                  value: nextRepetitionId,
                  type: "Integer",
                })
          );
          return buildEntity;
        });

        // Wait for all global entities mapping before returning the result
        globalEntities = await Promise.all(mappedGlobalEntities);

        // Update all the entities given the repetition configuration
        await Promise.all(
          globalEntities.map((entity) =>
            ngsiConnection.v2.updateEntityAttributes(entity).then(
              () => {},
              (error) => {
                Promise.reject(error.message);
              }
            )
          )
        );
      }
      // Create a new repetition based on another past one
      else if (fromRepetition) {
        // Get the closest recvTime value of the current entity to the given startDate
        const repetitionStartDate =
          await cygnusMySQLQueries.getRepetitionStartDate(
            mySQLConnection,
            fromRepetition
          );

        // Loop through all entities and get their context in the beggining of given repetition (storing all the mapping promises in mappedGlobalEntities)
        const mappedGlobalEntities = globalEntities.map(async (entity) => {
          // Get closest recvTime value for the given entity and the given repetitionStartDate (make sure they don't mismatch over milliseconds)
          const closestRecvTime = await cygnusMySQLQueries.getClosestRecvTime(
            mySQLConnection,
            cygnusMySQLToolkit.matchMySQLTableName(entity.id),
            cygnusMySQLToolkit.dateToSQLDateTime(new Date(repetitionStartDate))
          );

          // Get entity history state from date ranges (start date and end date are the same)
          const entityOnPastRepetition =
            await cygnusMySQLQueries.getEntityHistoryFromDateRanges(
              mySQLConnection,
              cygnusMySQLToolkit.matchMySQLTableName(entity.id),
              closestRecvTime[0].recvTime,
              closestRecvTime[0].recvTime
            );

          // Base for the entity instance build
          let buildEntity = {
            id: entity.id,
            type: entity.type,
          };

          // Update entity instance with past date historical data (regarding possibile input modifications)
          entityOnPastRepetition.map((attr) =>
            attr.attrName !== "repetition"
              ? (buildEntity[attr.attrName] = {
                  value: cygnusMySQLToolkit.parseMySQLAttrValue(
                    attr.attrValue,
                    attr.attrType
                  ),
                  type: attr.attrType,
                })
              : (buildEntity["repetition"] = {
                  value: nextRepetitionId,
                  type: "Integer",
                })
          );
          return buildEntity;
        });

        // Wait for all global entities mapping before returning the result
        globalEntities = await Promise.all(mappedGlobalEntities);

        // Update all the entities given the repetition configuration
        await Promise.all(
          globalEntities.map((entity) =>
            ngsiConnection.v2.updateEntityAttributes(entity).then(
              () => {},
              (error) => {
                Promise.reject(error.message);
              }
            )
          )
        );
      }
      // Create a new repetition around current simulation context
      else {
        // Get global dummy context after starting a repetition with entity modifications
        globalEntities = await cygnusMySQLToolkit.getContextOnRepetition(
          globalEntities,
          entitiesModified,
          nextRepetitionId
        );

        // Update all the entities given the repetition configuration
        await Promise.all(
          globalEntities.map((entity) =>
            ngsiConnection.v2.updateEntityAttributes(entity).then(
              () => {},
              (error) => {
                Promise.reject(error.message);
              }
            )
          )
        );
      }

      // After processing simulation state, propagate the repetition to Context Broker and historical sink
      cygnusMySQLQueries.startRepetition(mySQLConnection).then(
        (results) => res.send(results),
        (error) => res.status(500).send(error)
      );
    });
});

// Lists all repetitions registered
app.get("/history/repetition/list", (_, res) => {
  cygnusMySQLQueries.getRepetitionList(mySQLConnection).then(
    (results) => res.json({ results: results }),
    (error) => res.status(500).send({ error: error })
  );
});

// Notify Orion Context Broker and Cygnus of the ending of a simulation repetition
app.patch("/history/repetition/end", (req, res) => {
  const repetitionId = req.body.repetitionId;

  // Id validation safety check
  if (!repetitionId)
    res.status(400).send({
      error: {
        code: "MISSING_REP_ID",
        message: "Repetition id must be provided.",
      },
    });

  cygnusMySQLQueries.endRepetition(mySQLConnection, repetitionId).then(
    (results) => res.json(results),
    (error) => {
      res.status(500).send(error);
    }
  );
});
