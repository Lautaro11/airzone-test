// This file is the handler for the getWeather endpoint
import generateResponse from "#lib/generateResponse.js";
import { getWeatherDataByHour, validateCoordinates } from "#lib/tools.js";

export default async function getWeatherByHour(req, res) {
  try {
    let { lat, lon, hour } = req.query;

    if (!lat || !lon || !hour) {
      return generateResponse(400, { message: "Missing parameters" }, res);
    }

    if (!validateCoordinates(lat, lon)) {
      return generateResponse(400, { message: "Invalid coordinates" }, res);
    }

    // Round coordinates to 4 decimal places (same as the API response)
    lat = Number(lat).toFixed(4);
    lon = Number(lon).toFixed(4);

    if (!validateHour(hour)) {
      return generateResponse(400, { message: "Invalid hour" }, res);
    }

    // Fetch weather data from the API // Fetch weather data
    let weatherData = await getWeatherDataByHour(lat, lon, hour);

    return generateResponse(
      200,
      weatherData,
      res
    );
  } catch (e) {
    return generateResponse(e.statusCode || 400, {message: e.message || "Unexpected error"}, res);
  }
}

function validateHour(hour) {
  const formattedHour = hour.toString().split(":")[0].padStart(2, "0");
  hour = `${formattedHour}`;
  const hourRegex = /^([01]?[0-9]|2[0-3])$/;
  return hourRegex.test(hour);
}