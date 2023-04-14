const { CYGNUS_HOST, CYGNUS_PORT } = require("../config.js");

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
  build["repetition"] = { value: null, type: "Integer" };
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

module.exports = { buildEntity, buildEntityDummy, buildCygnusSubscription };
