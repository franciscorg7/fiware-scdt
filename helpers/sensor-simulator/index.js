import fetch from "node-fetch";

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
 * @returns object with weather information for today
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
      return result;
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

/**
 * Fetch open-meteo API to get air quality information for today based on geo location.
 *
 * @param {number} lat
 * @param {number} long
 * @returns object with air quality information for today
 */
async function getAirQuality(lat, long) {
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
      return result;
    }
  } catch (err) {
    console.log(err);
  }
}

/**
 * Random hourly dBA levels in a day generator function
 * @returns list of hourly noise levels between minimum and maximum dBA levels for today
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
  return noiseLevelAcc;
}

console.log(await getWeather(41.15, -8.61, 1));
console.log(await getAirQuality(41.15, -8.61));
console.log(getNoiseLevels());
