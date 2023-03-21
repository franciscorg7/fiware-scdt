const NGSI = require("ngsijs");
const connection = new NGSI.Connection("http://localhost:1026");

const multiSensor = {
  id: "sensor:MultipleSensor:1",
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

const multiSensorSubscription = {
  description: "A subscription to get surrounding info from the sensors.",
  subject: {
    id: "Subscription:MultipleSensor1",
    type: "Subscription",
    entities: [
      {
        id: "sensor:MultipleSensor:1",
        type: "Sensor",
      },
    ],
    condition: {
      attrs: ["airQuality", "humidity", "noise", "pressure", "temperature"],
    },
  },
  notification: {
    http: {
      url: "http://localhost:1026/accumulate",
    },
    attrs: ["airQuality", "humidity", "noise", "pressure", "temperature"],
  },
  expires: "2040-01-01T14:00:00.00Z",
};

const attrUpdate = {
  id: "sensor:MultipleSensor:1",
  temperature: {
    type: "Float",
    value: 16.7,
  },
};

const subscriptionUpdate = {
  id: "64182ef2cdccc852000c87ca",
  subject: {
    entities: [{ id: "sensor:MultipleSensor:1", type: "Sensor" }],
    condition: {
      attrs: ["airQuality", "humidity", "noise", "pressure", "temperature"],
    },
  },
};

// List all entities registered in the context broker server
const listEntities = () =>
  connection.v2.listEntities().then((response) =>
    response.results.forEach((entity) => {
      console.log(entity);
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

// Update attributes from an existing entity
const updateEntity = (changes) =>
  connection.v2.updateEntityAttributes(changes).then(
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
      console.log("Successfully removed, " + response);
    },
    (error) => {
      console.log(error);
    }
  );

// Creates a new subscription to the context broker server
const createSubscription = (subscription) =>
  connection.v2.createSubscription(subscription).then(
    (response) => {
      console.log(response);
    },
    (error) => {
      console.log(error);
    }
  );

// Update details from an existing subscription
const updateSubscription = (changes) =>
  connection.v2.updateSubscription(changes).then(
    (response) => {
      console.log(response);
    },
    (error) => {
      console.log(error);
    }
  );

// List all the subscriptions in the context broker server
const listSubscriptions = () =>
  connection.v2.listSubscriptions().then(
    (response) => {
      console.log(response.results);
    },
    (error) => {
      console.log(error);
    }
  );

// createEntity(multiSensor);
listEntities();
// deleteEntity("sensor:MultipleSensor:1");
// updateEntity(attrUpdate);
// createSubscription(multiSensorSubscription);
// updateSubscription(subscriptionUpdate);
// listSubscriptions();
