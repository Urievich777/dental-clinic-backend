require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

pool.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к БД:', err.message)
  } else {
    console.log('База данных подключена успешно')
  }
})

module.exports = pool