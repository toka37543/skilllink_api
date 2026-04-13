const db = require("../lib/db");

class Offer {
  static async create(userId, jobId, data, connection = db) {
    const [result] = await connection.execute(
      "INSERT INTO offers (job_id, user_id, description, budget, time_to_finish) VALUES (?, ?, ?, ?, ?)",
      [jobId, userId, data.description, data.budget, data.time_to_finish]
    );

    return this.findById(result.insertId, connection);
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM offers WHERE id = ? LIMIT 1", [id]);
    return rows[0] ?? null;
  }

  static async findByIdWithJob(id, connection = db) {
    const [rows] = await connection.execute(
      `SELECT offers.*, jobs.client_id, jobs.status AS job_status, jobs.budget AS job_budget
       FROM offers
       INNER JOIN jobs ON jobs.id = offers.job_id
       WHERE offers.id = ?
       LIMIT 1`,
      [id]
    );

    return rows[0] ?? null;
  }

  static async listByJob(jobId, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM offers WHERE job_id = ? ORDER BY id DESC", [jobId]);
    return rows;
  }

  static async listByUser(userId, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM offers WHERE user_id = ? ORDER BY id DESC", [userId]);
    return rows;
  }

  static async accept(id, connection = db) {
    await connection.execute("UPDATE offers SET status = 'accepted' WHERE id = ?", [id]);
    return this.findById(id, connection);
  }

  static async rejectPendingForJob(jobId, acceptedOfferId, connection = db) {
    await connection.execute(
      "UPDATE offers SET status = 'rejected' WHERE job_id = ? AND id <> ? AND status = 'pending'",
      [jobId, acceptedOfferId]
    );
  }
}

module.exports = Offer;
