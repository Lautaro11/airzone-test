// This file is the handler for the getWeather endpoint
import { getWeatherDataByHour, validateCoordinates } from "#lib/tools.js";

export default async function getWeatherByHour(req, res) {
  try {
    let { lat, lon, hour } = req.query;

    if (!lat || !lon || !hour) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    if (!validateCoordinates(lat, lon)) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    // Round coordinates to 4 decimal places (same as the API response)
    lat = Number(lat).toFixed(4);
    lon = Number(lon).toFixed(4);

    const formattedHour = hour.toString().split(":")[0].padStart(2, "0");
    hour = `${formattedHour}`;
    if (!validateHour(hour)) {
      return res.status(400).json({ message: "Invalid hour" });
    }

    // Fetch weather data from the API // Fetch weather data
    let weatherData = await getWeatherDataByHour(lat, lon, hour);

    return res.status(200).json(weatherData);
  } catch (e) {
    return res.status(e.statusCode || 400).json({message: e.message || "Unexpected error"});
  }
}

function validateHour(hour) {
  const hourRegex = /^([01]?[0-9]|2[0-3])$/;
  return hourRegex.test(hour);
}