const db = require("../config/db");
class Order {
  static create({ userId, products, total, address, paymentIntentId }, callback) {
    db.query(
      "INSERT INTO orders (user_id, products, total, address, payment_intent_id) VALUES (?, ?, ?, ?, ?)",
      [userId, JSON.stringify(products), total, address, paymentIntentId || null],
      callback
    );
  }
  static findByUser(userId, callback) {
    db.query("SELECT * FROM orders WHERE user_id = ?", [userId], callback);
  }
  static findById(orderId, callback) {
    db.query("SELECT * FROM orders WHERE id = ?", [orderId], callback);
  }
}
module.exports = Order;