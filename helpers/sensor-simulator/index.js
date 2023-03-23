import fetch from "node-fetch";
import cron from "node-cron";

// Orion Context Broker env variables
const OCB_HOST = "http://localhost";
const OCB_PORT = 8081;

// Simulation env variables
const SIMULATION_HOST = "http://192.168.1.101";
const SIMULATION_PORT = 5000;

/**
 * Helper that generates the YYYY-MM-DD format string dates for today and tomorrow
 *
 * @returns object with string dates from today and tomorrow
 */
function getTodayTomorrowStringDates() {
  const parsedToday = new Date().toISOString().slice(0, 10);
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const parsedTomorrow = tomorrow.toISOString().slice(0, 10);

  return { parsedToday, parsedTomorrow };
}

/**
 * WMO Weather Interpretation Codes (WW)
 * -------------------------------------------------------------
 * 0            Clear sky
 * 1, 2, 3 	    Mainly clear, partly cloudy, and overcast
 * 45, 48 	    Fog and depositing rime fog
 * 51, 53, 55 	Drizzle: Light, moderate, and dense intensity
 * 56, 57 	    Freezing Drizzle: Light and dense intensity
 * 61, 63, 65 	Rain: Slight, moderate and heavy intensity
 * 66, 67 	    Freezing Rain: Light and heavy intensity
 * 71, 73, 75 	Snow fall: Slight, moderate, and heavy intensity
 * 77 	        Snow grains
 * 80, 81, 82 	Rain showers: Slight, moderate, and violent
 * 85, 86 	    Snow showers slight and heavy
 * 95  	        Thunderstorm: Slight or moderate
 * 96, 99  	    Thunderstorm with slight and heavy hail
 */

/**
 * Fetch open-meteo API to get temperature, relative humidity and surface pressure
 * based on geo location. It is possible to control the number of forecast days using
 * the third argument which is the number of forecast days.
 *
 * @param {number} lat
 * @param {number} long
 * @param {number} forecastNumOfDays
 * @param {number} currentHour
 * @returns object with weather information for the current hour,
 * with temperature in Celsius, relative humidty in percentage and
 * surface pressure in Hectopascal.
 */
async function getWeather(lat, long, forecastNumOfDays, currentHour) {
  try {
    const parsedLat = lat && parseFloat(lat).toFixed(2);
    const parsedLong = long && parseFloat(long).toFixed(2);
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${parsedLat}&longitude=${parsedLong}&hourly=temperature_2m,relativehumidity_2m,surface_pressure,precipitation,cloudcover,windspeed_10m&forecast_days=${forecastNumOfDays}`
    );

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    } else {
      let result = await response.json();
      const temperature = result.hourly.temperature_2m[currentHour];
      const humidity = result.hourly.relativehumidity_2m[currentHour];
      const pressure = result.hourly.surface_pressure[currentHour];
      const precipitation = result.hourly.precipitation[currentHour];
      const cloudcover = result.hourly.cloudcover[currentHour];
      const windspeed_10m = result.hourly.windspeed_10m[currentHour];
      return {
        temperature: temperature,
        humidity: humidity,
        pressure: pressure,
        precipitation: precipitation,
        cloudcover: cloudcover,
        windspeed_10m: windspeed_10m,
      };
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * The European Air Quality Index (AQI))
 * -------------------------------------------------------------
 * 0-20       Good
 * 20-40 	    Fair
 * 40-50 	    Moderate
 * 50-100 	  Poor
 * 100-150    Very poor
 * 150-1200   Extremely poor
 */

/**
 * Fetch open-meteo API to get air quality information for today based on geo location.
 *
 * @param {number} lat
 * @param {number} long
 * @param {number} currentHour
 * @returns object with air quality information for the current hour in European AQI
 */
async function getAirQuality(lat, long, currentHour) {
  // Helper function that maps EAQI index into its corresponding label
  const eaqiToLabel = (index) => {
    if (index >= 0 && index <= 20) return "Good";
    else if (index > 20 && index <= 40) return "Fair";
    else if (index > 40 && index <= 50) return "Moderate";
    else if (index > 50 && index <= 100) return "Poor";
    else if (index > 100 && index <= 150) return "Very Poor";
    else if (index > 150 && index <= 1200) return "Extremely Poor";
    else return "Invalid value";
  };
  try {
    const parsedLat = lat && parseFloat(lat).toFixed(2);
    const parsedLong = long && parseFloat(long).toFixed(2);
    const { parsedToday, parsedTomorrow } = getTodayTomorrowStringDates();

    const response = await fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${parsedLat}&longitude=${parsedLong}&hourly=pm10,european_aqi&start_date=${parsedToday}&end_date=${parsedTomorrow}`
    );

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    } else {
      let result = await response.json();
      const europeanAQI = result.hourly.european_aqi[currentHour];
      return { europeanAQI: europeanAQI, label: eaqiToLabel(europeanAQI) };
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * Random hourly dBA levels in a day generator function
 * @param {number} currentHour
 * @returns list of hourly noise levels between minimum and maximum dBA levels for the current hour
 */
function getNoiseLevel(currentHour) {
  const MIN_NOISE_LEVEL = 55.8;
  const MAX_NOISE_LEVEL = 95.0;

  let noiseLevelAcc = [];
  let i = 0;
  while (i < 24) {
    noiseLevelAcc.push(
      Math.floor(Math.random() * (MAX_NOISE_LEVEL - MIN_NOISE_LEVEL + 1)) +
        MIN_NOISE_LEVEL
    );
    i++;
  }
  return noiseLevelAcc[currentHour];
}

// Schedule sensor simulation for triggering hourly
cron.schedule("* * * * *", async function () {
  // Current hour for day split (24 format)
  const currentHour = new Date().getHours();

  // Fetch sensor data for the instance hour
  const weather = await getWeather(41.15, -8.61, 1, currentHour);
  const airQuality = await getAirQuality(41.15, -8.61, currentHour);
  const noiseLevel = getNoiseLevel(currentHour);

  // Build entity instance with sensor data
  const multiSensor = {
    id: "sensor:MultipleSensor:1",
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
  fetch(`${OCB_HOST}:${OCB_PORT}/entity/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(multiSensor),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));

    //TODO: check if subscription notifies CARLA well
//   // Call simulation API to update current weather state
//   fetch(`${SIMULATION_HOST}:${SIMULATION_PORT}/set-weather`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       temperature: weather.temperature,
//       humidity: weather.humidity,
//       pressure: weather.pressure,
//       precipitation: weather.precipitation,
//       cloudcover: weather.cloudcover,
//       windspeed: weather.windspeed,
//       noiseLevel: noiseLevel,
//       airQuality: airQuality.europeanAQI,
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err));
// });

export default { getWeather, getAirQuality, getNoiseLevel };
