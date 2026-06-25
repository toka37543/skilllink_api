const db = require("../lib/db");
const { serializeJsonFields, stringifyJson } = require("../lib/helpers");

const jsonFields = ["languages"];

class Client {
  static async create(data, connection = db) {
    const [result] = await connection.execute(
      "INSERT INTO clients (username, email, password) VALUES (?, ?, ?)",
      [
        data.username,
        data.email,
        data.password
      ]
    );

    return this.findById(result.insertId, connection);
  }

  static async findById(id, connection = db) {
    const [rows] = await connection.execute(
      `SELECT
        id,
        username,
        first_name,
        last_name,
        email,
        country_code,
        phone_number,
        phone_verified_at,
        location,
        languages,
        about,
        company_name,
        industry,
        website,
        company_details AS company_description,
        profile_picture_url,
        created_at,
        updated_at
      FROM clients
      WHERE id = ? LIMIT 1`,
      [id]
    );

    return serializeJsonFields(rows[0], jsonFields);
  }

  static async findByEmail(email, connection = db) {
    const [rows] = await connection.execute(
      `SELECT
        id,
        username,
        first_name,
        last_name,
        email,
        country_code,
        phone_number,
        phone_verified_at,
        location,
        languages,
        about,
        company_name,
        industry,
        website,
        company_details AS company_description,
        profile_picture_url,
        password,
        created_at,
        updated_at
      FROM clients
      WHERE email = ? LIMIT 1`,
      [email]
    );

    return serializeJsonFields(rows[0], jsonFields);
  }

  static async updatePassword(email, password, connection = db) {
    await connection.execute("UPDATE clients SET password = ? WHERE email = ?", [password, email]);
  }

  static async updateProfile(id, data, connection = db) {
    const current = await this.findById(id, connection);

    await connection.execute(
      `UPDATE clients
       SET username = ?, first_name = ?, last_name = ?, location = ?, languages = ?, about = ?, company_name = ?, industry = ?, website = ?, company_details = ?
       WHERE id = ?`,
      [
        data.username ?? current?.username,
        data.first_name ?? current?.first_name ?? null,
        data.last_name ?? current?.last_name ?? null,
        data.location ?? current?.location ?? null,
        stringifyJson(data.languages ?? current?.languages ?? null),
        data.about ?? current?.about ?? null,
        data.company_name ?? current?.company_name ?? null,
        data.industry ?? current?.industry ?? null,
        data.website ?? current?.website ?? null,
        data.company_description ?? current?.company_description ?? null,
        id
      ]
    );

    return this.findById(id, connection);
  }

  static async updatePhone(id, data, connection = db) {
    await connection.execute(
      "UPDATE clients SET country_code = ?, phone_number = ?, phone_verified_at = CURRENT_TIMESTAMP WHERE id = ?",
      [data.country_code, data.phone_number, id]
    );

    return this.findById(id, connection);
  }

  static async updateProfilePicture(id, profilePictureUrl, connection = db) {
    await connection.execute(
      "UPDATE clients SET profile_picture_url = ? WHERE id = ?",
      [profilePictureUrl, id]
    );

    return this.findById(id, connection);
  }
}

module.exports = Client;
