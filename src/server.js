const app = require('./app')
const database = require('./db')

require('dotenv').config({path:'.env'})
const SERVER_PORT = process.env.SERVER_PORT

const server = app.listen(SERVER_PORT, async () => {
  await database.sync({force: true})
  console.log(`Server running at: http://localhost:${SERVER_PORT}/`)
});


process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

function shutDown() {
  server.close(() => {
      process.exit(0);
  });

  setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
  }, 10000);
}