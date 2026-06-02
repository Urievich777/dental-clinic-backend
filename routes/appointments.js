const express = require('express')
const router = express.Router()
const db = require('../db')
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, p.name as patient_name, p.phone as patient_phone,
             d.name as doctor_name, s.title as service_title
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors  d ON a.doctor_id  = d.id
      JOIN services s ON a.service_id = s.id
      ORDER BY a.starts_at
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Нужно войти в аккаунт' })

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const patient_id = decoded.id

    const { doctor_id, service_id, starts_at } = req.body
    const result = await db.query(`
      INSERT INTO appointments (patient_id, doctor_id, service_id, starts_at)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [patient_id, doctor_id, service_id, starts_at])
    res.status(201).json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body
    const result = await db.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router