function generateResponse(statusCode, message, res) {
  // Set content type and CORS headers
  res.type('application/json');
  res.header("Access-Control-Allow-Origin", process.env.STAGE === "dev" ? "*" : process.env.AUTHORIZED_HOST);
  res.header("Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,PATCH,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  // Set status code and send the response
  if (message) {
    res.status(statusCode).json(message);
  } else {
    res.sendStatus(statusCode);
  }

  return res;
}
export default generateResponse;