const db = require("../lib/db");

class PasswordCode {
  static async expireActive(email, accountType, connection = db) {
    await connection.execute(
      "UPDATE password_codes SET used_at = CURRENT_TIMESTAMP WHERE email = ? AND account_type = ? AND used_at IS NULL",
      [email, accountType]
    );
  }

  static async create(data, connection = db) {
    const [result] = await connection.execute(
      "INSERT INTO password_codes (email, account_type, code, expires_at) VALUES (?, ?, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 MINUTE))",
      [data.email, data.account_type, data.code]
    );

    return result.insertId;
  }

  static async findActiveLatest(email, accountType, connection = db) {
    const [rows] = await connection.execute(
      "SELECT id, code FROM password_codes WHERE email = ? AND account_type = ? AND used_at IS NULL AND expires_at > CURRENT_TIMESTAMP ORDER BY id DESC LIMIT 1",
      [email, accountType]
    );

    return rows[0] ?? null;
  }

  static async markUsed(id, connection = db) {
    await connection.execute("UPDATE password_codes SET used_at = CURRENT_TIMESTAMP WHERE id = ?", [id]);
  }
}

module.exports = PasswordCode;
