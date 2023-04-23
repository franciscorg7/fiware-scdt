const knownDataTypes = [
  "STRING",
  "NUMBER",
  "INTEGER",
  "FLOAT",
  "DOUBLE",
  "ARRAY",
  "OBJECT",
];
const mapTypeColor = {
  STRING: "cyan",
  NUMBER: "magenta",
  INTEGER: "geekblue",
  FLOAT: "volcano",
  DOUBLE: "orange",
  ARRAY: "green",
  OBJECT: "red",
};
const getTypeTagColor = (type) =>
  knownDataTypes.includes(type?.toUpperCase())
    ? mapTypeColor[type?.toUpperCase()]
    : "grey";

const typeTagService = { getTypeTagColor };
export default typeTagService;
