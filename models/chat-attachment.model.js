const db = require("../lib/db");

class ChatAttachment {
  static async create(chatRoomId, uploader, data, connection = db) {
    const [result] = await connection.execute(
      "INSERT INTO chat_attachments (chat_room_id, uploaded_by_type, uploaded_by_id, file_name, file_url, file_type, purpose) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        chatRoomId,
        uploader.type,
        uploader.id,
        data.file_name,
        data.file_url,
        data.file_type ?? null,
        data.purpose ?? "chat"
      ]
    );

    return this.findById(result.insertId, connection);
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM chat_attachments WHERE id = ? LIMIT 1", [id]);
    return rows[0] ?? null;
  }

  static async listByRoom(chatRoomId, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM chat_attachments WHERE chat_room_id = ? ORDER BY id DESC", [chatRoomId]);
    return rows;
  }
}

module.exports = ChatAttachment;
