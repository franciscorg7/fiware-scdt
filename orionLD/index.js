const axios = require('axios')
const payload = {
  "@context": {
    "status": "http://a.b.c/attrs/status",
    "state":  "http://a.b.c/attrs/state"
  },
  "id": "urn:entities:E3",
  "type": "T",
  "status": {
    "type": "Property",
    "value": "From Core Context"
  },
  "state": {
    "type": "Property",
    "value": "From User Context"
  },
  "state2": {
    "type": "Property",
    "value": "From Default URL"
  }
}
axios.post('http://localhost:1026/ngsi-ld/v1/entities', payload, 
            { headers: { "content-type": "application/ld+json" } })
            .then(res => console.log(res.status))
            .catch(err => console.log(err))