const axios = require("axios");
const payload = {
  id: "urn:entities:E1",
  type: "T",
  status: {
    type: "Property",
    value: "OK",
  },
  state: {
    type: "Property",
    value: "OK",
  },
};
axios
  .post("http://localhost:1026/ngsi-ld/v1/entities", payload, {
    headers: { "content-type": "application/json" },
  })
  .then((res) => console.log(res.status))
  .catch((err) => console.log(err));
