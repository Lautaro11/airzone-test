import {deleteById, insertData, fetchWeatherData, fetchWeatherDataByHour} from "#models/weatherModel.js";

// Fetch weather data from the API
export async function getWeatherFromApi(lat, lon) {
  let weatherData;
  let requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  try {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`;
    const response = await fetch(
      url,
      requestOptions
    );
    weatherData = await response.json();
    if (!weatherData.lat && !weatherData.lon) {
      throw {
        statusCode: weatherData.cod || 400,
        message: weatherData.message || "Error fetching data from the API",
      };
    }
    weatherData.searchedAt = new Date().getTime();
    await insertData(weatherData);
    return weatherData;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 400,
      message: error.message || "Error fetching weather data from the API",
    };
  }
}

export async function getWeatherData(lat, lon) {
  let weatherData;

  try {
    let dataFromDB = await fetchWeatherData(lat, lon);

    weatherData = await checkToUpdateData(dataFromDB, lat, lon);
    return weatherData;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 400,
      message: error.message || "Error fetching weather data",
    };
  }
}

export async function checkToUpdateData(dataFromDB, lat, lon) {
  try {
    let weatherData;
    let now = new Date();
    if (
      !dataFromDB.length ||
      dataFromDB[0].searchedAt < now.getTime() - 3 * 60 * 60 * 1000
    ) {
      // If the data is in the DB, delete it because it's outdated
      if (dataFromDB.length) {
        await deleteById(dataFromDB[0]._id);
      }
      weatherData = await getWeatherFromApi(lat, lon);
    } else {
      weatherData = dataFromDB[0];
    }
    return weatherData;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 400,
      message: error.message || "Error checking the weather data",
    };
  }
}

// Validate the coordinates
export async function validateCoordinates(lat, lon) {
  // Regex to validate decimal numbers
  const decimalRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/;

  // Validate that the coordinates are decimal numbers
  if (decimalRegex.test(lat) && decimalRegex.test(lon)) {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    // Validate that the coordinates are within the valid range
    return latNum >= -90 && latNum <= 90 && lonNum >= -180 && lonNum <= 180;
  }
  return false;
}

// // Insert the data into the DB
// export async function insertData(document) {
//   try {
//     const result = await collection.insertOne(document);

//     if (result.acknowledged) {
//       console.log(
//         "Document not found, created a new one:",
//         result.insertedId.toString()
//       );
//     } else {
//       throw {
//         statusCode: 400,
//         message: "Failed to create the document.",
//       };
//     }
//   } catch (err) {
//     console.error(err);
//     throw {
//       statusCode: 400,
//       message: "Failed to create the document.",
//     };
//   }
// }

export async function convertHourToUnix(hour, minutes = 0, seconds = 0) {
  let now = new Date();
  now.setUTCHours(hour, minutes, seconds, 0);
  // Unix time is in seconds, so we divide by 1000 to get the correct format
  return Math.floor(new Date(now.getTime() / 1000));
}

export async function getWeatherDataByHour(lat, lon, hour) {
  let weatherData;

  try {
    let unixHour = await convertHourToUnix(hour);
    let dataFromDB = await fetchWeatherDataByHour(lat, lon, unixHour);
    
    weatherData = await checkToUpdateData(dataFromDB, lat, lon);
    if (!dataFromDB.length) {
      weatherData.hourly = weatherData.hourly.filter((hour) => hour.dt === unixHour)
    }
    return {
      lat: weatherData.lat,
      lon: weatherData.lon,
      hourly: weatherData.hourly,
      searchedAt: weatherData.searchedAt,
    };
  } catch (error) {
    throw {
      statusCode: error.statusCode || 400,
      message: error.message || "Error fetching weather data by hour",
    };
  }
}
