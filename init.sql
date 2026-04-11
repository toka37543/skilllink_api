-- Create database if not exists
CREATE DATABASE IF NOT EXISTS skill_link_db;

USE skill_link_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(190) NOT NULL,
    last_name VARCHAR(190) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    country_code VARCHAR(10) NULL,
    phone_number VARCHAR(50) NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create table for clients aka companies/employers
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(190) NOT NULL,
    last_name VARCHAR(190) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    country_code VARCHAR(10) NULL,
    phone_number VARCHAR(50) NULL,
    password VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NULL,
    company_details TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create table for password reset codes
CREATE TABLE IF NOT EXISTS password_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(190) NOT NULL,
    account_type ENUM('user', 'client') NOT NULL,
    code VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_password_codes_email_type (email, account_type),
    INDEX idx_password_codes_expires_at (expires_at)
);

-- COLUMN_NAME DATA_TYPE (FLAGS) 
-- FLAGS: PRIMARY, UNIQUE, NOT_NULL, AUTO_INCREMENT, DEFAULT 'default_value'
-- CURRENT_TIMESTAMP the default value is the current timestamp

