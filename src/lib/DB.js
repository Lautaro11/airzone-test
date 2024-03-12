import { MongoClient } from "mongodb";

let db;
export async function connectDB() {

  let dbName = process.env.MONGO_DB_NAME || "airzone-test";

  try {
    if (db) {
      console.log("Using existing database connection");
      return db;
    }

    let url;

    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'docker') {
      url = `mongodb://mongo/${dbName}`;
    } else {
      url = `${process.env.MONGO_DB_URL}/${dbName}`;
    }

    let client = new MongoClient(url);

    let dbClient = await client.connect();
    console.log("Conexión exitosa a MongoDB");
    return dbClient.db();
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error);
    return undefined;
  }
}
