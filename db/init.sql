-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert admin user with environment variables
-- These will be replaced by docker-compose using envsubst
INSERT INTO users (email, password, first_name, last_name, birth_date, city, postal_code, is_admin) 
VALUES (
    '${ADMIN_EMAIL:-admin@example.com}',
    '${ADMIN_PASSWORD_HASH:-$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iQeO}', -- admin123
    'Admin',
    'User',
    '1990-01-01',
    'Paris',
    '75001',
    true
) ON DUPLICATE KEY UPDATE 
    password = VALUES(password),
    is_admin = VALUES(is_admin); 