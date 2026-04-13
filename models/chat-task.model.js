const db = require("../lib/db");

class ChatTask {
  static async create(chatRoomId, creator, data, connection = db) {
    const [result] = await connection.execute(
      "INSERT INTO chat_tasks (chat_room_id, created_by_type, created_by_id, title, description) VALUES (?, ?, ?, ?, ?)",
      [chatRoomId, creator.type, creator.id, data.title, data.description ?? null]
    );

    return this.findById(result.insertId, connection);
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM chat_tasks WHERE id = ? LIMIT 1", [id]);
    return rows[0] ?? null;
  }

  static async listByRoom(chatRoomId, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM chat_tasks WHERE chat_room_id = ? ORDER BY id DESC", [chatRoomId]);
    return rows;
  }

  static async updateStatus(id, status, connection = db) {
    await connection.execute("UPDATE chat_tasks SET status = ? WHERE id = ?", [status, id]);
    return this.findById(id, connection);
  }
}

module.exports = ChatTask;
