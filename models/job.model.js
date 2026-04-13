const db = require("../lib/db");
const { serializeJsonFields, stringifyJson } = require("../lib/helpers");

const jsonFields = ["needed_skills", "completion_files"];

class Job {
  static async create(clientId, data, connection = db) {
    const [result] = await connection.execute(
      "INSERT INTO jobs (client_id, title, description, budget, speciality, needed_skills) VALUES (?, ?, ?, ?, ?, ?)",
      [
        clientId,
        data.title,
        data.description,
        data.budget,
        data.speciality,
        stringifyJson(data.needed_skills)
      ]
    );

    return this.findById(result.insertId, connection);
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM jobs WHERE id = ? LIMIT 1", [id]);
    return serializeJsonFields(rows[0], jsonFields);
  }

  static async listByClient(clientId, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM jobs WHERE client_id = ? ORDER BY id DESC", [clientId]);
    return rows.map((row) => serializeJsonFields(row, jsonFields));
  }

  static async listOpenBySpeciality(speciality, connection = db) {
    const [rows] = await connection.execute(
      "SELECT * FROM jobs WHERE status = 'open' AND speciality = ? ORDER BY id DESC",
      [speciality]
    );

    return rows.map((row) => serializeJsonFields(row, jsonFields));
  }

  static async markOfferAccepted(jobId, offerId, connection = db) {
    await connection.execute(
      "UPDATE jobs SET status = 'in_progress', accepted_offer_id = ? WHERE id = ? AND status = 'open'",
      [offerId, jobId]
    );

    return this.findById(jobId, connection);
  }

  static async submitCompletion(jobId, completionFiles, connection = db) {
    await connection.execute(
      "UPDATE jobs SET completion_files = ?, user_submitted_completion_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'in_progress'",
      [stringifyJson(completionFiles), jobId]
    );

    return this.findById(jobId, connection);
  }

  static async approveCompletion(jobId, approverType, connection = db) {
    const column = approverType === "client" ? "client_approved_completion_at" : "user_approved_completion_at";
    await connection.execute(`UPDATE jobs SET ${column} = CURRENT_TIMESTAMP WHERE id = ? AND status = 'in_progress'`, [jobId]);

    return this.findById(jobId, connection);
  }

  static async markCompleted(jobId, connection = db) {
    await connection.execute(
      "UPDATE jobs SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?",
      [jobId]
    );

    return this.findById(jobId, connection);
  }
}

module.exports = Job;
