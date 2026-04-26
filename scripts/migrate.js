require("dotenv").config();

const mysql = require("mysql2/promise");

const database = process.env.DB_NAME || "skill_link_db";
const databaseIdentifier = `\`${database.replace(/`/g, "``")}\``;

const config = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  multipleStatements: false
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

async function main() {
  const connection = await mysql.createConnection(config);

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${databaseIdentifier}`);
    await connection.query(`USE ${databaseIdentifier}`);
    await migrateAccountColumns(connection);
    console.log("Migrations completed");
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
});
