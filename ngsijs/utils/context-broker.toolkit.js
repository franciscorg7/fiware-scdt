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

module.exports = { buildEntity, buildEntityDummy };
