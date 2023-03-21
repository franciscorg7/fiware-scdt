const NGSI = require("ngsijs");
const connection = new NGSI.Connection("http://localhost:1026");

const express = require("express");
const app = express();
const PORT = 8081;

// Configure express to parse the request body as JSON
app.use(express.json({ extended: true }));

app.listen(PORT, () => {
  console.log(`ngsiJS server running at: http://localhost:${PORT}/`);
});

// Lists all entities registered in the context broker server
app.get("/entity/list", (req, res) => {
  connection.v2.listEntities().then((response) => {
    res.send(response.results);
  });
});

// Creates a new entity
app.post("/entity/create", (req, res) => {
  const entity = req.body;
  connection.v2.createEntity(entity).then(
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
  connection.v2.updateEntityAttributes(changes).then(
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
  connection.v2.deleteEntity(entityId).then(
    (response) => {
      res.send(response);
    },
    (error) => {
      res.send(error.message);
    }
  );
});

// Creates a new subscription to the context broker server
app.post("/subscription/create", (req, res) => {
  const subscription = req.body;
  connection.v2.createSubscription(subscription).then(
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
  connection.v2.updateSubscription(changes).then(
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
  connection.v2.listSubscriptions().then((response) => {
    res.send(response.results);
  });
});
