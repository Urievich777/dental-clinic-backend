const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Регистрация пациента
router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const result = await db.query(`
      INSERT INTO patients (name, phone, email, password)
      VALUES ($1, $2, $3, $4) RETURNING id, name, email
    `, [name, phone, email, hashed])
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Вход пациента
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await db.query(
      'SELECT * FROM patients WHERE email = $1', [email]
    )
    const patient = result.rows[0]
    if (!patient) return res.status(404).json({ error: 'Пользователь не найден' })

    const match = await bcrypt.compare(password, patient.password)
    if (!match) return res.status(401).json({ error: 'Неверный пароль' })

    const token = jwt.sign(
      { id: patient.id, name: patient.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ token, name: patient.name })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router