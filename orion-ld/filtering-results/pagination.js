const axios = require("axios");
axios
  .get("http://localhost:1026/ngsi-ld/v1/entities?type=T&offset=12&limit=40")
  .then((res) => console.log(res.data))
  .catch((err) => console.log(err));
