const db = require("../lib/db");

class Client {
  static async create(data, connection = db) {
    const [result] = await connection.execute(
      "INSERT INTO clients (username, email, password) VALUES (?, ?, ?)",
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
      "SELECT id, username, first_name, last_name, email, country_code, phone_number, phone_verified_at, company_name, company_details, created_at, updated_at FROM clients WHERE id = ? LIMIT 1",
      [id]
    );

    return rows[0] ?? null;
  }

  static async findByEmail(email, connection = db) {
    const [rows] = await connection.execute(
      "SELECT id, username, first_name, last_name, email, country_code, phone_number, phone_verified_at, company_name, company_details, password, created_at, updated_at FROM clients WHERE email = ? LIMIT 1",
      [email]
    );

    return rows[0] ?? null;
  }

  static async updatePassword(email, password, connection = db) {
    await connection.execute("UPDATE clients SET password = ? WHERE email = ?", [password, email]);
  }

  static async updateProfile(id, data, connection = db) {
    const current = await this.findById(id, connection);

    await connection.execute(
      "UPDATE clients SET username = ?, first_name = ?, last_name = ?, company_name = ?, company_details = ? WHERE id = ?",
      [
        data.username ?? current?.username,
        data.first_name ?? current?.first_name ?? null,
        data.last_name ?? current?.last_name ?? null,
        data.company_name ?? current?.company_name ?? null,
        data.company_details ?? current?.company_details ?? null,
        id
      ]
    );

    return this.findById(id, connection);
  }

  static async updatePhone(id, data, connection = db) {
    await connection.execute(
      "UPDATE clients SET country_code = ?, phone_number = ?, phone_verified_at = CURRENT_TIMESTAMP WHERE id = ?",
      [data.country_code, data.phone_number, id]
    );

    return this.findById(id, connection);
  }
}

module.exports = Client;
