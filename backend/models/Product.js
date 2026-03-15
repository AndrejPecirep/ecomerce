const db = require('../config/db');

class Product {
  static async create({ name, description, price, image, category, stock }) {
    const result = await db.query(
      `INSERT INTO products (name, description, price, image, category, stock)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, description, price, image, category, stock]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await db.query('SELECT * FROM products ORDER BY created_at DESC, id DESC');
    return result.rows;
  }

  static async search(query = '', category = '') {
    const result = await db.query(
      `SELECT * FROM products
       WHERE ($1 = '' OR name ILIKE $2 OR description ILIKE $2)
         AND ($3 = '' OR category = $3)
       ORDER BY created_at DESC, id DESC`,
      [query, `%${query}%`, category]
    );
    return result.rows;
  }

  static async getCategories() {
    const result = await db.query('SELECT DISTINCT category FROM products ORDER BY category ASC');
    return result.rows.map((row) => row.category);
  }

  static async findByIds(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return [];
    const result = await db.query(
      'SELECT * FROM products WHERE id = ANY($1::int[])',
      [ids]
    );
    return result.rows;
  }
}

module.exports = Product;
