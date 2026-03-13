const db = require("../config/db");
class Product {
  static create({ name, description, price, image, category }, callback) {
    db.query(
      "INSERT INTO products (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)",
      [name, description, price, image, category],
      callback
    );
  }
  static getAll(callback) {
    db.query("SELECT * FROM products", callback);
  }
  static search(query, category, callback) {
    let sql = "SELECT * FROM products WHERE (name LIKE ? OR description LIKE ?)";
    let params = [`%${query}%`, `%${query}%`];
    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }
    db.query(sql, params, callback);
  }
  static getCategories(callback) {
    db.query("SELECT DISTINCT category FROM products", callback);
  }

  // new: get products by array of ids
  static findByIds(ids, callback) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return callback(null, []);
    }
    // build placeholders
    const placeholders = ids.map(() => "?").join(",");
    const sql = `SELECT * FROM products WHERE id IN (${placeholders})`;
    db.query(sql, ids, callback);
  }
}
module.exports = Product;