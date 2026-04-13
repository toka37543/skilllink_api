const db = require("../lib/db");

class ChatRoom {
  static async create(data, connection = db) {
    const existing = await this.findByJobId(data.job_id, connection);
    if (existing) {
      return existing;
    }

    const [result] = await connection.execute(
      "INSERT INTO chat_rooms (job_id, offer_id, client_id, user_id) VALUES (?, ?, ?, ?)",
      [data.job_id, data.offer_id, data.client_id, data.user_id]
    );

    return this.findById(result.insertId, connection);
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM chat_rooms WHERE id = ? LIMIT 1", [id]);
    return rows[0] ?? null;
  }

  static async findByJobId(jobId, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM chat_rooms WHERE job_id = ? LIMIT 1", [jobId]);
    return rows[0] ?? null;
  }

  static async listForAccount(type, id, connection = db) {
    const column = type === "client" ? "client_id" : "user_id";
    const [rows] = await connection.execute(`SELECT * FROM chat_rooms WHERE ${column} = ? ORDER BY id DESC`, [id]);
    return rows;
  }
}

module.exports = ChatRoom;
