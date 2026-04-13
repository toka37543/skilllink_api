const db = require("../lib/db");
const { serializeJsonFields, stringifyJson } = require("../lib/helpers");

const jsonFields = ["skills", "certificates", "projects", "social_links"];

class UserProfile {
  static async findByUserId(userId, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM user_profiles WHERE user_id = ? LIMIT 1", [userId]);
    return serializeJsonFields(rows[0], jsonFields);
  }

  static async upsert(userId, data, connection = db) {
    await connection.execute(
      `INSERT INTO user_profiles
        (user_id, skills, speciality, certificates, university, projects, github_url, behance_url, linkedin_url, social_links)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        skills = VALUES(skills),
        speciality = VALUES(speciality),
        certificates = VALUES(certificates),
        university = VALUES(university),
        projects = VALUES(projects),
        github_url = VALUES(github_url),
        behance_url = VALUES(behance_url),
        linkedin_url = VALUES(linkedin_url),
        social_links = VALUES(social_links)`,
      [
        userId,
        stringifyJson(data.skills),
        data.speciality ?? null,
        stringifyJson(data.certificates),
        data.university ?? null,
        stringifyJson(data.projects),
        data.github_url ?? null,
        data.behance_url ?? null,
        data.linkedin_url ?? null,
        stringifyJson(data.social_links)
      ]
    );

    return this.findByUserId(userId, connection);
  }
}

module.exports = UserProfile;
