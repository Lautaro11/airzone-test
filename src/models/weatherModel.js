import { connectDB } from "#lib/DB.js";
const db = await connectDB();

export const deleteById = async (id) => {
  try {
    const collection = db.collection("weather");
    let dataFromDB = await collection.deleteOne({ _id: id });
    return dataFromDB;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 400,
      message: error.message || "Error deleting weather data from DB",
    };
  }
};

export const insertData = async (document) => {
  try {
    const collection = db.collection("weather");
    const result = await collection.insertOne(document);

    if (result.acknowledged) {
      console.log(
        "Document not found, created a new one:",
        result.insertedId.toString()
      );
    } else {
      throw {
        statusCode: 400,
        message: "Failed to create the document.",
      };
    }
  } catch (err) {
    console.error(err);
    throw {
      statusCode: 400,
      message: "Failed to create the document.",
    };
  }
};

export const fetchWeatherData = async (lat, lon) => {
  try {
    const collection = db.collection("weather");
    let dataFromDB = await collection
      .find({ lat: Number(lat), lon: Number(lon) })
      .toArray();
    return dataFromDB;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 400,
      message: error.message || "Error fetching weather data from DB",
    };
  }
};

export const fetchWeatherDataByHour = async (lat, lon, unixHour) => {
  try {
    const collection = db.collection("weather");
    let dataFromDB = await collection
      .aggregate([
        {
          $match: {
            lat: Number(lat),
            lon: Number(lon),
            "hourly.dt": {
              $gte: unixHour,
            },
          },
        },
        {
          $project: {
            lat: 1,
            lon: 1,
            searchedAt: 1,
            hourly: {
              $filter: {
                input: "$hourly",
                as: "hour",
                cond: { $eq: ["$$hour.dt", unixHour] },
              },
            },
          },
        },
      ])
      .toArray();
    return dataFromDB;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 400,
      message: error.message || "Error fetching weather data by hour from DB",
    };
  }
};
