const db = require("../lib/db");

class User {
  static async create(data, connection = db) {
    const [result] = await connection.execute(
      "INSERT INTO users (username, first_name, last_name, email, password, country_code, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        data.username,
        data.first_name,
        data.last_name,
        data.email,
        data.password,
        data.country_code ?? null,
        data.phone_number ?? null
      ]
    );

    return this.findById(result.insertId, connection);
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute(
      "SELECT id, username, first_name, last_name, email, country_code, phone_number, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    return rows[0] ?? null;
  }

  static async findByEmail(email, connection = db) {
    const [rows] = await connection.execute(
      "SELECT id, username, first_name, last_name, email, country_code, phone_number, password, created_at, updated_at FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    return rows[0] ?? null;
  }

  static async list(connection = db) {
    const [rows] = await connection.execute(
      "SELECT id, username, first_name, last_name, email, country_code, phone_number, created_at, updated_at FROM users ORDER BY id DESC"
    );

    return rows;
  }

  static async updatePassword(email, password, connection = db) {
    await connection.execute("UPDATE users SET password = ? WHERE email = ?", [password, email]);
  }
}

module.exports = User;
