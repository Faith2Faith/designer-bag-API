const express = require('express')
const bagdata = require('./bagdata')


const app = express()

app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', (request, response) => {
  return response.render('index', { bagdata })
})

app.listen(2035, () => {
  // eslint-disable-next-line no-console
  console.log('listening to port 2035...')
})
