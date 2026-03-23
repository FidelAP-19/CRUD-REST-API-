require('dotenv').config()
const Pool = require('pg').Pool

// pg automatically reads PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT from environment
const pool = new Pool()

// GET all users
const getUsers = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM users ORDER BY id ASC')
    response.status(200).json(results.rows)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
}

// GET a single user by ID
const getUserById = async (request, response) => {
  const id = parseInt(request.params.id)
  try {
    const results = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    response.status(200).json(results.rows)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
}

// POST a new user
// Note: RETURNING * is required — PostgreSQL does not have results.insertId (that's MySQL)
const createUser = async (request, response) => {
  const { name, email } = request.body
  try {
    const results = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    )
    response.status(201).send(`User added with ID: ${results.rows[0].id}`)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
}

// PUT — update an existing user
const updateUser = async (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body
  try {
    await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id]
    )
    response.status(200).send(`User modified with ID: ${id}`)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
}

// DELETE a user
const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id)
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id])
    response.status(200).send(`User deleted with ID: ${id}`)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}