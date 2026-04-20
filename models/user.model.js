const db = require("../lib/db");

class User {
  static async create(data, connection = db) {
    const [result] = await connection.execute(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [
        data.username,
        data.email,
        data.password
      ]
    );

    return this.findById(result.insertId, connection);
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute(
      "SELECT id, username, first_name, last_name, email, country_code, phone_number, phone_verified_at, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    return rows[0] ?? null;
  }

  static async findByEmail(email, connection = db) {
    const [rows] = await connection.execute(
      "SELECT id, username, first_name, last_name, email, country_code, phone_number, phone_verified_at, password, created_at, updated_at FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    return rows[0] ?? null;
  }

  static async list(connection = db) {
    const [rows] = await connection.execute(
      "SELECT id, username, first_name, last_name, email, country_code, phone_number, phone_verified_at, created_at, updated_at FROM users ORDER BY id DESC"
    );

    return rows;
  }

  static async updatePassword(email, password, connection = db) {
    await connection.execute("UPDATE users SET password = ? WHERE email = ?", [password, email]);
  }

  static async updateProfile(id, data, connection = db) {
    const current = await this.findById(id, connection);

    await connection.execute(
      "UPDATE users SET first_name = ?, last_name = ? WHERE id = ?",
      [
        data.first_name ?? current?.first_name ?? null,
        data.last_name ?? current?.last_name ?? null,
        id
      ]
    );

    return this.findById(id, connection);
  }

  static async updatePhone(id, data, connection = db) {
    await connection.execute(
      "UPDATE users SET country_code = ?, phone_number = ?, phone_verified_at = CURRENT_TIMESTAMP WHERE id = ?",
      [data.country_code, data.phone_number, id]
    );

    return this.findById(id, connection);
  }
}

module.exports = User;
