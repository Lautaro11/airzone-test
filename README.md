# Airzone Test

## Descripción
Esta aplicación Node.js utiliza Express para proporcionar información climática basada en coordenadas geográficas. La aplicación interactúa con una base de datos MongoDB llamada "airzone-test" y utiliza la colección "weather" para almacenar datos climáticos, estos datos son obtenidos de una API externa (https://openweathermap.org/api/one-call-3).

## Funcionalidades

### Endpoints de la API

1. **GET /getWeather**
   - **Descripción:** Obtiene información climática para una ubicación específica.
   - **Parámetros de entrada:**
     - `lat`: Latitud de la ubicación.
     - `lon`: Longitud de la ubicación.
   - **Respuesta:**
     - `hourly`: Array de objetos con información climática por hora.
     - `daily`: Array de objetos con información climática diaria.

2. **GET /getWeatherByHour**
   - **Descripción:** Obtiene información climática para una ubicación específica en una hora específica.
   - **Parámetros de entrada:**
     - `lat`: Latitud de la ubicación.
     - `lon`: Longitud de la ubicación.
     - `hour`: Hora específica para la consulta.
   - **Respuesta:**
     - Información climática para la ubicación y hora específicas.

### Sistema de Cache

La aplicación implementa un sistema de caché para mejorar el rendimiento y reducir las consultas a la API externa. Se utilizan los datos almacenados en la base de datos siempre que hayan sido obtenidos en las últimas 3 horas. De lo contrario, la aplicación consulta la API externa (https://openweathermap.org/api/one-call-3) para obtener datos actualizados, los almacena en la base de datos y luego los utiliza.

## Estructura del Proyecto

- **src/models/:** Contiene los archivos relacionados con la interacción con la base de datos.
- **routes/:** Contiene los archivos que definen las rutas de la API.
- **config.js:** Archivo de configuración para la conexión a la base de datos y otros ajustes.
- **app.js:** Archivo principal que configura y ejecuta la aplicación Express.
- **src/handlers/weather:** Contiene la logica de los endpoints.
- **src/lib/:** Contiene funciones auxiliares donde, entre ellas, se encuentra la conexion con la DB.

## Configuración

1. Clona el repositorio: `https://github.com/Lautaro11/airzone-test.git`
2. Instala las dependencias: `npm install`
3. Copia el `.env.example` y cambia el nombre a `.env`, luego rellena los campos.
4. Ejecuta la aplicación: `npm start`

¡Disfruta de tu aplicación de información climática!

## Tecnologías Utilizadas

- Node.js
- Express
- MongoDB
- [OpenWeatherMap API](https://openweathermap.org/api/one-call-3)
