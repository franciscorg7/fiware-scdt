const { CYGNUS_HOST, CYGNUS_PORT } = require("../config.js");

const MAX_NUMBER_OF_RESULTS = 1000; // the maximum number of results possible for NGSIv2 API is 1000 (otherwise we need pagination)

/**
 * Parse a string into a boolean value
 *
 * @param {String} string
 * @returns {Boolean} true if the string matches true not caring about it's written
 */
const parseStringToBoolean = (string) => string.toLowerCase() === "true";

/**
 * Receives a request query object and maps it into the appropriate options object
 *
 * @param {Object} query
 * @returns entityList options
 */
const buildEntityListOptions = (query) => {
  const options = {};
  const noDummies = parseStringToBoolean(query.noDummies ?? "false");
  const idPattern = query.idPattern;
  const attrs = query.attrs;
  if (attrs) options["attrs"] = attrs;
  if (noDummies && idPattern)
    options["idPattern"] = `^${idPattern}(?!.*:dummy$).*$`;
  else if (noDummies) options["idPattern"] = `^(?!.*:dummy$).*$`;
  else if (idPattern) options["idPattern"] = `^${idPattern}.*`;
  return options;
};

/**
 *  Receives an NGSIv2 entity and returns the pretended entity object structure.
 *
 * @param {Object} entity
 * @returns {Object} pretended entity structure
 */
const buildEntity = (entity) => {
  const build = { ...entity };
  build["subscriptions"] = { value: [], type: "Array" };
  return build;
};

/**
 *  Receives an NGSIv2 entity and returns the corresponding dummy for repetition experiments.
 *
 * @param {Object} entity
 * @returns {Object} modified dummy entity
 */
const buildEntityDummy = (entity) => {
  const build = { ...entity };
  build["id"] = `${build["id"]}:dummy`;
  build["repetition"] = { value: 0, type: "Integer" };
  return build;
};

/**
 *  Receives an NGSIv2 entity and propagates its information to a Cygnus subscription.
 *
 * @param {Object} entity
 * @returns {Object} subscription
 */
const buildCygnusSubscription = async (entity, description) => {
  const entityAttrs = Object.keys(entity);
  const build = {
    description: description,
    subject: {
      entities: [
        {
          id: entity.id,
          type: entity.type,
        },
      ],
      condition: {
        attrs: [],
      },
    },
    notification: {
      http: {
        url: `${CYGNUS_HOST}:${CYGNUS_PORT}/notify`, // check if these configuration params match the ones you're using for your `cygnus` docker container
      },
      attrs: entityAttrs.filter(
        (attr) => attr != "id" && attr != "type" && attr != "subscriptions" // notify Cygnus only about simulation attributes
      ),
    },
    expires: new Date(new Date().getFullYear() + 50, 0, 1), // make the subscription expire in 50 years
  };
  return build;
};

module.exports = {
  MAX_NUMBER_OF_RESULTS,
  buildEntityListOptions,
  buildEntity,
  buildEntityDummy,
  buildCygnusSubscription,
};
