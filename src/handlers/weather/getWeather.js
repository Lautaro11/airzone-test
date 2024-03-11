// This file is the handler for the getWeather endpoint
import generateResponse from "#lib/generateResponse.js";
import { getWeatherData, validateCoordinates } from "#lib/tools.js";

export default async function getWeather(req, res) {
  try {
    let { lat, lon } = req.query;

    if (!lat || !lon) {
      return generateResponse(400, { message: "Missing parameters" }, res);
    }

    if (!validateCoordinates(lat, lon)) {
      return generateResponse(400, { message: "Invalid coordinates" }, res);
    }

    // Round coordinates to 4 decimal places (same as the API response)
    lat = Number(lat).toFixed(4);
    lon = Number(lon).toFixed(4);

    // Fetch weather data
    let weatherData = await getWeatherData(lat, lon);

    return generateResponse(
      200,
      { hourly: weatherData.hourly, daily: weatherData.daily },
      res
    );
  } catch (e) {
    return generateResponse(e.statusCode || 400, {message: e.message || "Unexpected error"}, res);
  }
}
