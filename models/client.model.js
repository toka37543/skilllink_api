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
      "SELECT id, username, first_name, last_name, email, country_code, phone_number, company_name, company_details, created_at, updated_at FROM clients WHERE id = ? LIMIT 1",
      [id]
    );

    return rows[0] ?? null;
  }

  static async findByEmail(email, connection = db) {
    const [rows] = await connection.execute(
      "SELECT id, username, first_name, last_name, email, country_code, phone_number, company_name, company_details, password, created_at, updated_at FROM clients WHERE email = ? LIMIT 1",
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
      "UPDATE clients SET username = ?, first_name = ?, last_name = ?, country_code = ?, phone_number = ?, company_name = ?, company_details = ? WHERE id = ?",
      [
        data.username ?? current?.username,
        data.first_name,
        data.last_name,
        data.country_code ?? null,
        data.phone_number ?? null,
        data.company_name ?? null,
        data.company_details ?? null,
        id
      ]
    );

    return this.findById(id, connection);
  }
}

module.exports = Client;
