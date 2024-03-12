// This file is the handler for the getWeather endpoint
import { getWeatherData, validateCoordinates } from "#lib/tools.js";

export default async function getWeather(req, res) {
  try {
    let { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    if (!validateCoordinates(lat, lon)) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    // Round coordinates to 4 decimal places (same as the API response)
    lat = Number(lat).toFixed(4);
    lon = Number(lon).toFixed(4);

    // Fetch weather data
    let weatherData = await getWeatherData(lat, lon);

    return res.status(200).json({ hourly: weatherData.hourly, daily: weatherData.daily });
  } catch (e) {
    return res.status(Number(e.statusCode) || 400).json({message: e.message || "Unexpected error"});
  }
}
