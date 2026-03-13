const db = require("../config/db");

class User {
  static findByEmail(email, callback) {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
  }

  static findById(id, callback) {
    db.query("SELECT * FROM users WHERE id = ?", [id], callback);
  }

  static create({ name, email, password }, callback) {
    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password],
      callback
    );
  }
}

module.exports = User;
