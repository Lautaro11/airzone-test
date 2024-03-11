import 'dotenv/config';
import express from 'express';
import cors from 'cors';

//Define Routers
import weatherRoutes from './routes/weather.js';

import {connectDB} from "#lib/DB.js";

import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

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
  res.status(200).json({
    message: 'Airzone TEST API',
  });
});

//Implement Routers
app.use('/weather', weatherRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
