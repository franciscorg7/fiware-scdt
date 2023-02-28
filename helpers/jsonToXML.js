const fs = require("fs");

const HEADER = '<?xml version="1.0" encoding="UTF-8"?>';
const GENERATED_ON = `<!-- automatically generated on ${new Date()} by jsonToXML script (by Francisco Gonçalves) -->`;

const jsonToXML = (json) => {
  let buffer = "";
  buffer += HEADER + "\n\n";
  buffer += GENERATED_ON + "\n\n";

  buffer += "<routes>\n";
  buffer += `<vType id="${json.vehicleType.value}" accel="${json.accel.value}" decel="${json.decel.value} max="${json.maxSpeed.value}">\n`;
  buffer += `<vehicle id="${json.vehicle.id}" type="${json.vehicleType.value}">\n`;
  buffer += "</vehicle>\n\n";
  buffer += "</routes>\n";
  try {
    fs.writeFileSync(`${entityId}.rou.xml`, buffer);
  } catch (error) {
    console.log(error);
  }
};
