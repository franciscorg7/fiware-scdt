import fetch from "node-fetch";

/**
 *
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
 * Fetch open-meteo API to get temperature and relative humidity based on geo location
 *
 * @param {number} lat
 * @param {number} long
 * @returns object with temperature, windspeed, winddirection, wwcode and sensor read time
 */
async function getWeather(lat, long) {
  try {
    const parsedLat = lat && parseFloat(lat).toFixed(2);
    const parsedLong = long && parseFloat(long).toFixed(2);
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${parsedLat}&longitude=${parsedLong}&hourly=temperature_2m,relativehumidity_2m&current_weather=true`
    );

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    } else {
      let result = await response.json();
      return result.current_weather;
    }
  } catch (err) {
    console.log(err);
  }
}

console.log(await getWeather(41.15, -8.61));
