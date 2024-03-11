import 'dotenv/config';
import express from 'express';
import cors from 'cors';

//Define Routers
import weatherRoutes from './routes/weather.js';

import {connectDB} from "#lib/DB.js";

import generateResponse from "#lib/generateResponse.js";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));


// //VERIFICAR QUE ESTEN LAS VARIABLES DE ENTORNO
// const requiredEnvVars = [
//   'WEATHER_API_KEY',
//   'MONGO_DB_NAME',
//   'PORT'
// ];

// function validateEnvVars() {
//   const unsetEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

//   if (unsetEnvVars.length > 0) {
//     const missingVars = unsetEnvVars.join(', ');
//     throw new Error(`Missing required environment variables: ${missingVars}`);
//   }
// }

// // Call the function to perform the validation
// try {
//   validateEnvVars();
// } catch (error) {
//   console.error(error.message);
//   process.exit(1);
// }

app.use(express.json());

app.use(cors({ origin: "*" }));

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Error Interno del Servidor',
  });
});

const db = await connectDB();
if (!db) {
  console.error("Error connecting to database");
  process.exit(1);
}


// Configurar las rutas
app.route('/').get((req, res) => {
  generateResponse(200, {
    message: 'Airzone TEST API',
  }, res);
});

//Implement Routers
app.use('/weather', weatherRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
