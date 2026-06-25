const db = require("../lib/db");
const { serializeJsonFields } = require("../lib/helpers");

// JSON columns on the joined `jobs` row that must be parsed back into arrays.
const jobJsonFields = ["needed_skills", "completion_files"];

class SavedJob {
  // Bookmark a job for an account. Safe to call twice: the UNIQUE key plus
  // INSERT IGNORE means a second save is a no-op instead of an error.
  static async save(ownerType, ownerId, jobId, connection = db) {
    await connection.execute(
      "INSERT IGNORE INTO saved_jobs (owner_type, owner_id, job_id) VALUES (?, ?, ?)",
      [ownerType, ownerId, jobId]
    );

    return this.isSaved(ownerType, ownerId, jobId, connection);
  }

  static async unsave(ownerType, ownerId, jobId, connection = db) {
    await connection.execute(
      "DELETE FROM saved_jobs WHERE owner_type = ? AND owner_id = ? AND job_id = ?",
      [ownerType, ownerId, jobId]
    );
  }

  static async isSaved(ownerType, ownerId, jobId, connection = db) {
    const [rows] = await connection.execute(
      "SELECT id FROM saved_jobs WHERE owner_type = ? AND owner_id = ? AND job_id = ? LIMIT 1",
      [ownerType, ownerId, jobId]
    );

    return rows.length > 0;
  }

  // Return the full job rows the account has saved, newest bookmark first.
  static async listJobsForOwner(ownerType, ownerId, connection = db) {
    const [rows] = await connection.execute(
      `SELECT jobs.*, saved_jobs.created_at AS saved_at
       FROM saved_jobs
       INNER JOIN jobs ON jobs.id = saved_jobs.job_id
       WHERE saved_jobs.owner_type = ? AND saved_jobs.owner_id = ?
       ORDER BY saved_jobs.id DESC`,
      [ownerType, ownerId]
    );

    return rows.map((row) => ({ ...serializeJsonFields(row, jobJsonFields), saved: true }));
  }
}

module.exports = SavedJob;
