const db = require("../lib/db");

class Notification {
  // Create one notification for a recipient. `data.link` is an optional
  // frontend route the bell dropdown can link to (e.g. "/saved").
  static async create(recipient, data, connection = db) {
    const [result] = await connection.execute(
      `INSERT INTO notifications (recipient_type, recipient_id, type, title, body, link)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        recipient.type,
        recipient.id,
        data.type,
        data.title,
        data.body ?? null,
        data.link ?? null
      ]
    );

    return this.findById(result.insertId, connection);
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM notifications WHERE id = ? LIMIT 1", [id]);
    return rows[0] ?? null;
  }

  static async listForRecipient(recipientType, recipientId, connection = db) {
    const [rows] = await connection.execute(
      "SELECT * FROM notifications WHERE recipient_type = ? AND recipient_id = ? ORDER BY id DESC LIMIT 50",
      [recipientType, recipientId]
    );

    return rows;
  }

  static async countUnread(recipientType, recipientId, connection = db) {
    const [rows] = await connection.execute(
      "SELECT COUNT(*) AS count FROM notifications WHERE recipient_type = ? AND recipient_id = ? AND read_at IS NULL",
      [recipientType, recipientId]
    );

    return rows[0].count;
  }

  // Mark a single notification read, but only if it belongs to this recipient.
  static async markRead(id, recipientType, recipientId, connection = db) {
    const [result] = await connection.execute(
      "UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE id = ? AND recipient_type = ? AND recipient_id = ? AND read_at IS NULL",
      [id, recipientType, recipientId]
    );

    return result.affectedRows > 0;
  }
}

module.exports = Notification;
