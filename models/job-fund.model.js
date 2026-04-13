const db = require("../lib/db");

class JobFund {
  static async createHold(jobId, clientWalletId, amount, connection = db) {
    const [result] = await connection.execute(
      "INSERT INTO job_funds (job_id, client_wallet_id, amount, status) VALUES (?, ?, ?, 'held')",
      [jobId, clientWalletId, amount]
    );

    return this.findById(result.insertId, connection);
  }

  static async findHeldByJobId(jobId, connection = db) {
    const [rows] = await connection.execute(
      "SELECT * FROM job_funds WHERE job_id = ? AND status = 'held' ORDER BY id DESC LIMIT 1",
      [jobId]
    );

    return rows[0] ?? null;
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM job_funds WHERE id = ? LIMIT 1", [id]);
    return rows[0] ?? null;
  }

  static async markReleased(id, userWalletId, connection = db) {
    await connection.execute(
      "UPDATE job_funds SET status = 'released', user_wallet_id = ?, released_at = CURRENT_TIMESTAMP WHERE id = ?",
      [userWalletId, id]
    );

    return this.findById(id, connection);
  }
}

module.exports = JobFund;
