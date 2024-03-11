import express from 'express';
import getWeather from "../src/handlers/weather/getWeather.js";
import getWeatherByHour from "../src/handlers/weather/getWeatherByHour.js";

const router = express.Router();

router.get('/', getWeather);
router.get('/hour', getWeatherByHour);

export default router;