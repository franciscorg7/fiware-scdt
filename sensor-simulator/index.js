import fetch from "node-fetch";
import cron from "node-cron";
import config from "./config.js";
import wToolkit from "./utils/weather.toolkit.js";
import minimist from "minimist";

// Get arguments and options from the command-line
const args = minimist(process.argv.slice(2));

// If there is an help flag in the options list
if (args.help || args.h) {
  console.log(`
Usage: node script.js [options]

Options:
  -h, --help                  Show help options
  -s, --sensor <id>           Specify the id of the sensor to be updated (default: sensor:MultipleSensor:1)
  -c, --carla                 Communicate directly with CARLA API (instead of using Context Broker notification)
  -l, --location <lat,long>   Specify the geo location for the sensor to fetch data from (default: 41.15,-8.61) 

`);
  process.exit();
}

// Pre-process and validate the location option
if (args.l || args.location) {
  var geoLoc = (args.l || args.location).split(",");
}

// Schedule sensor simulation for triggering hourly
cron.schedule("* * * * *", async function () {
  // Current hour for day split (24 format)
  const currentHour = new Date().getHours();

  // Fetch sensor data for the instance hour
  const weather = await wToolkit.getWeather(
    geoLoc[0] || 41.15,
    geoLoc[1] || -8.61,
    1,
    currentHour
  );
  const airQuality = await wToolkit.getAirQuality(
    geoLoc[0] || 41.15,
    geoLoc[1] || -8.61,
    currentHour
  );
  const noiseLevel = wToolkit.getNoiseLevel(currentHour);

  // Build entity instance with sensor data
  const multiSensor = {
    id: args.sensor || args.s || "sensor:MultipleSensor:1",
    temperature: {
      type: "Float",
      value: weather.temperature,
    },
    humidity: {
      type: "Float",
      value: weather.humidity,
    },
    pressure: {
      type: "Float",
      value: weather.pressure,
    },
    precipitation: {
      type: "Float",
      value: weather.precipitation,
    },
    cloudcover: {
      type: "Float",
      value: weather.cloudcover,
    },
    windspeed: {
      type: "Float",
      value: weather.windspeed_10m,
    },
    noise: {
      type: "Float",
      value: noiseLevel,
    },
    airQuality: {
      type: "Integer",
      value: airQuality.europeanAQI,
    },
  };

  // Call ngsiJS API to update sensor:multipleSensor:1 entity registered at FIWARE OCB
  fetch(`${config.OCB_HOST}:${config.OCB_PORT}/entity/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(multiSensor),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

  // Call simulation API to update current weather state
  if (args.carla || args.c)
    fetch(`${config.SIMULATION_HOST}:${config.SIMULATION_PORT}/set-weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        temperature: weather.temperature,
        humidity: weather.humidity,
        pressure: weather.pressure,
        precipitation: weather.precipitation,
        cloudcover: weather.cloudcover,
        windspeed: weather.windspeed,
        noiseLevel: noiseLevel,
        airQuality: airQuality.europeanAQI,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
});
