const Vehicle = {
  id, // id in NGSIv2 format (type:Name:index)
  type, // string
  route, // matches Route id
  from, // edge id
  to, // edge id
  depart, // start time step
  departLane,
  departPos,
  departSpeed,
  departEdge,
  arrivalLane,
  arrivalPos,
  arrivalSpeed,
  line,
  personNumber,
  via,
  reroute,
  departPosLat,
  arrivalPosLat,
  speedFactor,
  insertionChecks,
};

const RouteFromEdges = {
  id, // id in NGSIv2 format (type:Name:index)
  edges, // list of edge ids (null if from/to provided)
  from, // edge id (null if edges list provided)
  to, // edge id (null if edges list provided)
};

const Person = {
  id, // id in NGSIv2 format (type:Name:index)
  type,
  depart,
  departPos,
  speedFactor,
};

const Walk = {
  id, // id in NGSIv2 format (type:Name:index)
  route, // route id
  edges, // list of edge ids
  from, // edge id
  to, // edge id
};

const Stops = {
  busStop,
  containerStop,
};

const ParkingArea = {
  id,
  lane,
  startPos,
  endPos,
  friendlyPos,
  name,
  roadSideCapacity,
  onRoad,
  width,
  length,
  angle,
};

const Weather = {
  cloudiness,
  precipitation,
  windIntensity,
  sunAzimuthAngle,
  sunAltitudeAngle,
  fogDensity,
  fogDistance,
  wetness,
  fogFalloff,
  scattering,
  minScatteringScale,
  dustStorm,
};
