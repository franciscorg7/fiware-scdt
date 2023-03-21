import fetch from "node-fetch";

// Current hour for day split (24 format)
const currentHour = new Date().getHours();

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
 * @returns object with weather information for the current hour,
 * with temperature in Celsius, relative humidty in percentage and
 * surface pressure in Hectopascal.
 */
async function getWeather(lat, long, forecastNumOfDays) {
  try {
    const parsedLat = lat && parseFloat(lat).toFixed(2);
    const parsedLong = long && parseFloat(long).toFixed(2);
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${parsedLat}&longitude=${parsedLong}&hourly=temperature_2m,relativehumidity_2m,surface_pressure&current_weather=true&forecast_days=${forecastNumOfDays}`
    );

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    } else {
      let result = await response.json();
      const temperature = result.hourly.temperature_2m[currentHour];
      const relHumidity = result.hourly.relativehumidity_2m[currentHour];
      const pressure = result.hourly.surface_pressure[currentHour];
      return {
        temperature: temperature,
        relativeHumidity: relHumidity,
        pressure: pressure,
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
 * @returns object with air quality information for the current hour in European AQI
 */
async function getAirQuality(lat, long) {
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
 * @returns list of hourly noise levels between minimum and maximum dBA levels for the current hour
 */
function getNoiseLevels() {
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

console.log(await getWeather(41.15, -8.61, 1));
console.log(await getAirQuality(41.15, -8.61));
console.log(getNoiseLevels());
