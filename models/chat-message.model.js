const db = require("../lib/db");

class ChatMessage {
  static async create(chatRoomId, sender, body, connection = db) {
    const [result] = await connection.execute(
      "INSERT INTO chat_messages (chat_room_id, sender_type, sender_id, body) VALUES (?, ?, ?, ?)",
      [chatRoomId, sender.type, sender.id, body]
    );

    return this.findById(result.insertId, connection);
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM chat_messages WHERE id = ? LIMIT 1", [id]);
    return rows[0] ?? null;
  }

  // Oldest first, so the frontend can render the thread top-to-bottom.
  static async listByRoom(chatRoomId, connection = db) {
    const [rows] = await connection.execute(
      "SELECT * FROM chat_messages WHERE chat_room_id = ? ORDER BY id ASC",
      [chatRoomId]
    );

    return rows;
  }

  // Mark every message the *other* party sent in this room as read.
  static async markRoomReadFor(chatRoomId, reader, connection = db) {
    await connection.execute(
      "UPDATE chat_messages SET read_at = CURRENT_TIMESTAMP WHERE chat_room_id = ? AND sender_type <> ? AND read_at IS NULL",
      [chatRoomId, reader.type]
    );
  }
}

module.exports = ChatMessage;
