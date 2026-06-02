require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/doctors',      require('./routes/doctors'))
app.use('/api/appointments', require('./routes/appointments'))
app.use('/api/auth',         require('./routes/auth'))
app.use('/api/services', require('./routes/services'))

app.get('/', (req, res) => {
  res.json({ message: 'Сервер клиники работает!' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`)
})