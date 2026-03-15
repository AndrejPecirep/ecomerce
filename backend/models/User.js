const db = require('../config/db');

class User {
  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return result.rows[0] || null;
  }

  static async create({ name, email, password, role = 'customer' }) {
    const result = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, password, role]
    );
    return result.rows[0];
  }
}

module.exports = User;
