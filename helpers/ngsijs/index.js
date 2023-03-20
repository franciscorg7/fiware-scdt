const NGSI = require("ngsijs");
const connection = new NGSI.Connection("http://localhost:1026");

const multiSensor = {
  id: "MultipleSensor1",
  type: "Sensor",
  airQuality: {
    type: "Integer",
    value: 17,
    metadata: {},
  },
  humidity: {
    type: "Float",
    value: 96,
    metadata: {},
  },
  noise: {
    type: "Float",
    value: 73.2,
    metadata: {},
  },
  pressure: {
    type: "Float",
    value: 1012.3,
    metadata: {},
  },
  temperature: {
    type: "Float",
    value: 13.4,
    metadata: {},
  },
};

// List all entities registered in the Context Broker Service
const listEntities = () =>
  connection.v2.listEntities().then((response) =>
    response.results.forEach((entity) => {
      console.log(entity.id);
    })
  );

// Create a new entity
const createEntity = (entity) =>
  connection.v2.createEntity(entity).then(
    (response) => {
      console.log(response);
    },
    (error) => {
      console.log(error);
    }
  );

// Removes an entity from the context broker server given its id
const deleteEntity = (entityId) =>
  connection.v2.deleteEntity(entityId).then(
    (response) => {
      console.log(response);
    },
    (error) => {
      console.log(error);
    }
  );

listEntities();
