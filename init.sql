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

-- Public profile for users/students
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    skills JSON NULL,
    speciality VARCHAR(190) NULL,
    certificates JSON NULL,
    university VARCHAR(255) NULL,
    projects JSON NULL,
    github_url VARCHAR(255) NULL,
    behance_url VARCHAR(255) NULL,
    linkedin_url VARCHAR(255) NULL,
    social_links JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Jobs posted by clients
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    speciality VARCHAR(190) NOT NULL,
    needed_skills JSON NULL,
    status ENUM('open', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'open',
    accepted_offer_id INT NULL,
    completion_files JSON NULL,
    user_submitted_completion_at TIMESTAMP NULL,
    user_approved_completion_at TIMESTAMP NULL,
    client_approved_completion_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_jobs_speciality_status (speciality, status),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Offers sent by users/students for jobs
CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    user_id INT NOT NULL,
    description TEXT NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    time_to_finish VARCHAR(190) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_offers_job_id (job_id),
    INDEX idx_offers_user_id (user_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Wallets for clients and users
CREATE TABLE IF NOT EXISTS wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_type ENUM('user', 'client') NOT NULL,
    owner_id INT NOT NULL,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    held_balance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_wallet_owner (owner_type, owner_id)
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id INT NOT NULL,
    type ENUM('credit', 'debit', 'hold', 'release', 'refund') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    reference_type VARCHAR(100) NULL,
    reference_id INT NULL,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);

-- Funds held for accepted job offers
CREATE TABLE IF NOT EXISTS job_funds (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    client_wallet_id INT NOT NULL,
    user_wallet_id INT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('held', 'released', 'refunded') NOT NULL DEFAULT 'held',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP NULL,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (client_wallet_id) REFERENCES wallets(id),
    FOREIGN KEY (user_wallet_id) REFERENCES wallets(id)
);

-- Chat rooms created once a client accepts a user offer
CREATE TABLE IF NOT EXISTS chat_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL UNIQUE,
    offer_id INT NOT NULL,
    client_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (offer_id) REFERENCES offers(id),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS chat_tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_room_id INT NOT NULL,
    created_by_type ENUM('user', 'client') NOT NULL,
    created_by_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('todo', 'done') NOT NULL DEFAULT 'todo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id)
);

CREATE TABLE IF NOT EXISTS chat_attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chat_room_id INT NOT NULL,
    uploaded_by_type ENUM('user', 'client') NOT NULL,
    uploaded_by_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NULL,
    purpose ENUM('chat', 'completion') NOT NULL DEFAULT 'chat',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id)
);

-- COLUMN_NAME DATA_TYPE (FLAGS) 
-- FLAGS: PRIMARY, UNIQUE, NOT_NULL, AUTO_INCREMENT, DEFAULT 'default_value'
-- CURRENT_TIMESTAMP the default value is the current timestamp

-- add username field to users table and make first_name and last_name nullable
ALTER TABLE users
ADD COLUMN username VARCHAR(190) NOT NULL UNIQUE AFTER id,
MODIFY COLUMN first_name VARCHAR(190) NULL,
MODIFY COLUMN last_name VARCHAR(190) NULL;
