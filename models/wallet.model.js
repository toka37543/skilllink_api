const db = require("../lib/db");

class Wallet {
  static async findOrCreate(ownerType, ownerId, connection = db) {
    const [existingRows] = await connection.execute(
      "SELECT * FROM wallets WHERE owner_type = ? AND owner_id = ? LIMIT 1",
      [ownerType, ownerId]
    );

    if (existingRows.length > 0) {
      return existingRows[0];
    }

    await connection.execute(
      "INSERT INTO wallets (owner_type, owner_id, balance, held_balance) VALUES (?, ?, 0, 0)",
      [ownerType, ownerId]
    );

    const [rows] = await connection.execute(
      "SELECT * FROM wallets WHERE owner_type = ? AND owner_id = ? LIMIT 1",
      [ownerType, ownerId]
    );

    return rows[0];
  }

  static async addBalance(ownerType, ownerId, amount, description, connection = db) {
    const wallet = await this.findOrCreate(ownerType, ownerId, connection);

    await connection.execute("UPDATE wallets SET balance = balance + ? WHERE id = ?", [amount, wallet.id]);
    await this.recordTransaction(wallet.id, "credit", amount, "payment", null, description, connection);

    return this.findById(wallet.id, connection);
  }

  static async holdFunds(ownerType, ownerId, amount, referenceType, referenceId, connection = db) {
    const wallet = await this.findOrCreate(ownerType, ownerId, connection);

    if (Number(wallet.balance) < Number(amount)) {
      throw new Error("Insufficient wallet balance");
    }

    await connection.execute(
      "UPDATE wallets SET balance = balance - ?, held_balance = held_balance + ? WHERE id = ?",
      [amount, amount, wallet.id]
    );

    await this.recordTransaction(wallet.id, "hold", amount, referenceType, referenceId, "Funds held for accepted offer", connection);

    return this.findById(wallet.id, connection);
  }

  static async releaseHeldToUser(clientWalletId, userWalletId, amount, referenceType, referenceId, connection = db) {
    const [result] = await connection.execute(
      "UPDATE wallets SET held_balance = held_balance - ? WHERE id = ? AND held_balance >= ?",
      [amount, clientWalletId, amount]
    );

    if (result.affectedRows === 0) {
      throw new Error("Held funds not available");
    }

    await connection.execute("UPDATE wallets SET balance = balance + ? WHERE id = ?", [amount, userWalletId]);

    await this.recordTransaction(clientWalletId, "release", amount, referenceType, referenceId, "Held funds released", connection);
    await this.recordTransaction(userWalletId, "credit", amount, referenceType, referenceId, "Job funds received", connection);
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM wallets WHERE id = ? LIMIT 1", [id]);
    return rows[0] ?? null;
  }

  static async recordTransaction(walletId, type, amount, referenceType, referenceId, description, connection = db) {
    await connection.execute(
      "INSERT INTO wallet_transactions (wallet_id, type, amount, reference_type, reference_id, description) VALUES (?, ?, ?, ?, ?, ?)",
      [walletId, type, amount, referenceType, referenceId, description]
    );
  }
}

module.exports = Wallet;
