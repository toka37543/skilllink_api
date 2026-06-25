const db = require("../lib/db");

class Report {
  static async create(reporter, data, connection = db) {
    const [result] = await connection.execute(
      `INSERT INTO reports (reporter_type, reporter_id, name, email, issue_type, description, attachment_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        reporter.type,
        reporter.id,
        data.name ?? null,
        data.email ?? null,
        data.issue_type ?? null,
        data.description,
        data.attachment_url ?? null
      ]
    );

    return this.findById(result.insertId, connection);
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM reports WHERE id = ? LIMIT 1", [id]);
    return rows[0] ?? null;
  }

  static async listByReporter(reporterType, reporterId, connection = db) {
    const [rows] = await connection.execute(
      "SELECT * FROM reports WHERE reporter_type = ? AND reporter_id = ? ORDER BY id DESC",
      [reporterType, reporterId]
    );

    return rows;
  }
}

module.exports = Report;
