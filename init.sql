-- Create database if not exists
CREATE DATABASE IF NOT EXISTS skill_link_db;

USE skill_link_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(190) NOT NULL,
    last_name VARCHAR(190) NOT NULL,
    emial VARCHAR(190) NOT NULL UNIQUE,
    country_code VARCHAR(10) NULL,
    phone_number VARCHAR(50) NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- COLUMN_NAME DATA_TYPE (FLAGS) 
-- FLAGS: PRIMARY, UNIQUE, NOT_NULL, AUTO_INCREMENT, DEFAULT 'default_value'
-- CURRENT_TIMESTAMP the default value is the current timestamp

