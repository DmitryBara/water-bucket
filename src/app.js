const app = require('express')()
const { ValidationError } = require('express-validation')
const jsonParser = require('body-parser').json()


app.get('/api/ping', (req, res) => {
  res.send({ message: 'pong' });
});

app.use('/api/bucket', jsonParser, require('./bucket/routes.js'))


app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }
  return res.status(400).json(err)
})


module.exports = app