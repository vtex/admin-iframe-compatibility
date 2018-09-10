var express = require('express');

const app = express()

app.use(express.static('./', {
  maxAge: '10s',
  etag: false
}))

app.listen(4200, () => {
  console.log('Serving static js in localhost:4200/')
})