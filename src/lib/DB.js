import { MongoClient } from "mongodb";

let db;
export async function connectDB() {

  let dbName = process.env.MONGO_DB_NAME || "airzone-test";

  try {
    if (db) {
      console.log("Using existing database connection");
      return db;
    }

    const url = `mongodb://localhost:27017/${dbName}`;

    let client = new MongoClient(url);

    let dbClient = await client.connect();
    console.log("Conexión exitosa a MongoDB");
    return dbClient.db();
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error);
    return undefined;
  }
}
