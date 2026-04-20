const db = require("../lib/db");
const { serializeJsonFields, stringifyJson } = require("../lib/helpers");

const jsonFields = ["skills", "certificates", "languages", "projects", "social_links"];

const profileFields = [
  "skills",
  "speciality",
  "certificates",
  "university",
  "college",
  "study_years",
  "date_of_birth",
  "address",
  "languages",
  "brief",
  "projects",
  "github_url",
  "behance_url",
  "linkedin_url",
  "social_links",
  "profile_picture_url"
];

class UserProfile {
  static async findByUserId(userId, connection = db) {
    const [rows] = await connection.execute("SELECT * FROM user_profiles WHERE user_id = ? LIMIT 1", [userId]);
    return serializeJsonFields(rows[0], jsonFields);
  }

  static async upsert(userId, data, connection = db) {
    const current = await this.findByUserId(userId, connection);
    const merged = profileFields.reduce((values, field) => {
      values[field] = Object.prototype.hasOwnProperty.call(data, field)
        ? data[field]
        : current?.[field] ?? null;
      return values;
    }, {});

    await connection.execute(
      `INSERT INTO user_profiles
        (user_id, skills, speciality, certificates, university, college, study_years, date_of_birth, address, languages, brief, projects, github_url, behance_url, linkedin_url, social_links, profile_picture_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        skills = VALUES(skills),
        speciality = VALUES(speciality),
        certificates = VALUES(certificates),
        university = VALUES(university),
        college = VALUES(college),
        study_years = VALUES(study_years),
        date_of_birth = VALUES(date_of_birth),
        address = VALUES(address),
        languages = VALUES(languages),
        brief = VALUES(brief),
        projects = VALUES(projects),
        github_url = VALUES(github_url),
        behance_url = VALUES(behance_url),
        linkedin_url = VALUES(linkedin_url),
        social_links = VALUES(social_links),
        profile_picture_url = VALUES(profile_picture_url)`,
      [
        userId,
        stringifyJson(merged.skills),
        merged.speciality,
        stringifyJson(merged.certificates),
        merged.university,
        merged.college,
        merged.study_years,
        merged.date_of_birth,
        merged.address,
        stringifyJson(merged.languages),
        merged.brief,
        stringifyJson(merged.projects),
        merged.github_url,
        merged.behance_url,
        merged.linkedin_url,
        stringifyJson(merged.social_links),
        merged.profile_picture_url
      ]
    );

    return this.findByUserId(userId, connection);
  }

  static async updateProfilePicture(userId, profilePictureUrl, connection = db) {
    return this.upsert(userId, { profile_picture_url: profilePictureUrl }, connection);
  }
}

module.exports = UserProfile;
