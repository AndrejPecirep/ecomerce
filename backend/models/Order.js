const db = require('../config/db');

class Order {
  static async create({ userId, products, total, address, note }) {
    const result = await db.query(
      `INSERT INTO orders (user_id, products, total, address, note)
       VALUES ($1, $2::jsonb, $3, $4, $5)
       RETURNING id`,
      [userId, JSON.stringify(products), total, address, note || '']
    );
    return result.rows[0];
  }

  static async findByUser(userId) {
    const result = await db.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC, id DESC',
      [userId]
    );
    return result.rows;
  }
}

module.exports = Order;
