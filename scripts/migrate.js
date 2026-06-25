require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const database = process.env.DB_NAME || "skill_link_db";
const databaseIdentifier = `\`${database.replace(/`/g, "``")}\``;

const config = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  // Needed to run the whole init.sql (many statements) in one query.
  multipleStatements: true
};

const accountColumns = [
  {
    table: "users",
    column: "username",
    ddl: "ALTER TABLE users ADD COLUMN username VARCHAR(190) NULL AFTER id",
    backfill: "UPDATE users SET username = CONCAT('user_', id) WHERE username IS NULL OR TRIM(username) = ''",
    notNull: "ALTER TABLE users MODIFY username VARCHAR(190) NOT NULL",
    index: {
      name: "idx_users_username_unique",
      ddl: "CREATE UNIQUE INDEX idx_users_username_unique ON users (username)"
    }
  },
  {
    table: "users",
    column: "first_name",
    ddl: "ALTER TABLE users ADD COLUMN first_name VARCHAR(190) NULL AFTER username"
  },
  {
    table: "users",
    column: "last_name",
    ddl: "ALTER TABLE users ADD COLUMN last_name VARCHAR(190) NULL AFTER first_name"
  },
  {
    table: "users",
    column: "country_code",
    ddl: "ALTER TABLE users ADD COLUMN country_code VARCHAR(10) NULL AFTER email"
  },
  {
    table: "users",
    column: "phone_number",
    ddl: "ALTER TABLE users ADD COLUMN phone_number VARCHAR(50) NULL AFTER country_code"
  },
  {
    table: "users",
    column: "phone_verified_at",
    ddl: "ALTER TABLE users ADD COLUMN phone_verified_at TIMESTAMP NULL AFTER phone_number"
  },
  {
    table: "clients",
    column: "username",
    ddl: "ALTER TABLE clients ADD COLUMN username VARCHAR(190) NULL AFTER id",
    backfill: "UPDATE clients SET username = CONCAT('client_', id) WHERE username IS NULL OR TRIM(username) = ''",
    notNull: "ALTER TABLE clients MODIFY username VARCHAR(190) NOT NULL",
    index: {
      name: "idx_clients_username_unique",
      ddl: "CREATE UNIQUE INDEX idx_clients_username_unique ON clients (username)"
    }
  },
  {
    table: "clients",
    column: "first_name",
    ddl: "ALTER TABLE clients ADD COLUMN first_name VARCHAR(190) NULL AFTER username"
  },
  {
    table: "clients",
    column: "last_name",
    ddl: "ALTER TABLE clients ADD COLUMN last_name VARCHAR(190) NULL AFTER first_name"
  },
  {
    table: "clients",
    column: "country_code",
    ddl: "ALTER TABLE clients ADD COLUMN country_code VARCHAR(10) NULL AFTER email"
  },
  {
    table: "clients",
    column: "phone_number",
    ddl: "ALTER TABLE clients ADD COLUMN phone_number VARCHAR(50) NULL AFTER country_code"
  },
  {
    table: "clients",
    column: "phone_verified_at",
    ddl: "ALTER TABLE clients ADD COLUMN phone_verified_at TIMESTAMP NULL AFTER phone_number"
  },
  {
    table: "clients",
    column: "company_name",
    ddl: "ALTER TABLE clients ADD COLUMN company_name VARCHAR(255) NULL AFTER password"
  },
  {
    table: "clients",
    column: "location",
    ddl: "ALTER TABLE clients ADD COLUMN location VARCHAR(255) NULL AFTER password"
  },
  {
    table: "clients",
    column: "languages",
    ddl: "ALTER TABLE clients ADD COLUMN languages JSON NULL AFTER location"
  },
  {
    table: "clients",
    column: "about",
    ddl: "ALTER TABLE clients ADD COLUMN about TEXT NULL AFTER languages"
  },
  {
    table: "clients",
    column: "profile_picture_url",
    ddl: "ALTER TABLE clients ADD COLUMN profile_picture_url VARCHAR(500) NULL AFTER company_details"
  },
  {
    table: "clients",
    column: "industry",
    ddl: "ALTER TABLE clients ADD COLUMN industry VARCHAR(255) NULL AFTER company_name"
  },
  {
    table: "clients",
    column: "website",
    ddl: "ALTER TABLE clients ADD COLUMN website VARCHAR(255) NULL AFTER industry"
  },
  {
    table: "clients",
    column: "company_details",
    ddl: "ALTER TABLE clients ADD COLUMN company_details TEXT NULL AFTER company_name"
  },
  {
    table: "user_profiles",
    column: "college",
    ddl: "ALTER TABLE user_profiles ADD COLUMN college VARCHAR(255) NULL AFTER university"
  },
  {
    table: "user_profiles",
    column: "study_years",
    ddl: "ALTER TABLE user_profiles ADD COLUMN study_years VARCHAR(50) NULL AFTER college"
  },
  {
    table: "user_profiles",
    column: "date_of_birth",
    ddl: "ALTER TABLE user_profiles ADD COLUMN date_of_birth DATE NULL AFTER study_years"
  },
  {
    table: "user_profiles",
    column: "address",
    ddl: "ALTER TABLE user_profiles ADD COLUMN address TEXT NULL AFTER date_of_birth"
  },
  {
    table: "user_profiles",
    column: "languages",
    ddl: "ALTER TABLE user_profiles ADD COLUMN languages JSON NULL AFTER address"
  },
  {
    table: "user_profiles",
    column: "brief",
    ddl: "ALTER TABLE user_profiles ADD COLUMN brief TEXT NULL AFTER languages"
  },
  {
    table: "user_profiles",
    column: "profile_picture_url",
    ddl: "ALTER TABLE user_profiles ADD COLUMN profile_picture_url VARCHAR(500) NULL AFTER social_links"
  }
];

// New feature tables added after the original init.sql. Each statement is
// idempotent (CREATE TABLE IF NOT EXISTS) so running migrate repeatedly is safe.
const newTables = [
  `CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_room_id INT NOT NULL,
    sender_type ENUM('user', 'client') NOT NULL,
    sender_id INT NOT NULL,
    body TEXT NOT NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_chat_messages_room (chat_room_id),
    FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id)
  )`,
  `CREATE TABLE IF NOT EXISTS saved_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_type ENUM('user', 'client') NOT NULL,
    owner_id INT NOT NULL,
    job_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_saved_job (owner_type, owner_id, job_id),
    INDEX idx_saved_jobs_owner (owner_type, owner_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
  )`,
  `CREATE TABLE IF NOT EXISTS reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_type ENUM('user', 'client') NOT NULL,
    reporter_id INT NOT NULL,
    name VARCHAR(190) NULL,
    email VARCHAR(190) NULL,
    issue_type VARCHAR(100) NULL,
    description TEXT NOT NULL,
    attachment_url VARCHAR(500) NULL,
    status ENUM('open', 'in_review', 'resolved') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_reports_reporter (reporter_type, reporter_id)
  )`,
  `CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_type ENUM('user', 'client') NOT NULL,
    recipient_id INT NOT NULL,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NULL,
    link VARCHAR(255) NULL,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notifications_recipient (recipient_type, recipient_id, read_at)
  )`
];

async function createNewTables(connection) {
  for (const ddl of newTables) {
    await connection.query(ddl);
  }
  console.log("Ensured feature tables (chat_messages, saved_jobs, reports, notifications)");
}

// Older databases created users/clients with first_name/last_name NOT NULL.
// Registration only collects username/email/password (names are filled in later
// via the profile), so make these columns nullable. Idempotent.
async function ensureNullableNameColumns(connection) {
  for (const table of ["users", "clients"]) {
    for (const column of ["first_name", "last_name"]) {
      try {
        await connection.query(`ALTER TABLE ${table} MODIFY ${column} VARCHAR(190) NULL`);
      } catch (err) {
        // Table/column may not exist yet on a brand-new DB; createNewTables/base
        // schema handle that. Safe to ignore.
      }
    }
  }
  console.log("Ensured users/clients name columns are nullable");
}

async function tableExists(connection, table) {
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
    [database, table]
  );

  return rows[0].count > 0;
}

async function columnExists(connection, table, column) {
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [database, table, column]
  );

  return rows[0].count > 0;
}

async function uniqueIndexOnColumnExists(connection, table, column) {
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS count
     FROM INFORMATION_SCHEMA.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ? AND NON_UNIQUE = 0`,
    [database, table, column]
  );

  return rows[0].count > 0;
}

async function migrateAccountColumns(connection) {
  for (const item of accountColumns) {
    const hasTable = await tableExists(connection, item.table);
    if (!hasTable) {
      console.log(`Skipped ${item.table}.${item.column}; table does not exist`);
      continue;
    }

    const hasColumn = await columnExists(connection, item.table, item.column);
    if (!hasColumn) {
      await connection.query(item.ddl);
      console.log(`Added ${item.table}.${item.column}`);
    }

    if (item.backfill) {
      await connection.query(item.backfill);
    }

    if (item.notNull) {
      await connection.query(item.notNull);
    }

    if (item.index) {
      const hasIndex = await uniqueIndexOnColumnExists(connection, item.table, item.column);
      if (!hasIndex) {
        await connection.query(item.index.ddl);
        console.log(`Added index ${item.index.name}`);
      }
    }
  }
}

// Run the full base schema from init.sql (CREATE TABLE IF NOT EXISTS ...). This
// makes `npm run migrate` self-sufficient on a fresh database: it creates every
// base table (clients, jobs, chat_rooms, wallets, ...) before the column patches
// and feature tables below — otherwise foreign keys to those tables fail.
// The `CREATE DATABASE` / `USE` lines are stripped because main() already
// created and selected the configured database (which may differ from init.sql).
async function applyBaseSchema(connection) {
  const initSqlPath = path.join(__dirname, "../init.sql");
  if (!fs.existsSync(initSqlPath)) {
    console.log("Skipped base schema; init.sql not found");
    return;
  }

  const sql = fs.readFileSync(initSqlPath, "utf8")
    .replace(/CREATE\s+DATABASE[^;]*;/gi, "")
    .replace(/USE\s+[^;]*;/gi, "");

  await connection.query(sql);
  console.log("Applied base schema from init.sql");
}

async function main() {
  const connection = await mysql.createConnection(config);

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseIdentifier}`);
    await connection.query(`USE ${databaseIdentifier}`);
    await applyBaseSchema(connection);
    await migrateAccountColumns(connection);
    await createNewTables(connection);
    await ensureNullableNameColumns(connection);
    console.log("Migrations completed");
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
});
