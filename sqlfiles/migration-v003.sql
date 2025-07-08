USE user_registration;

-- Add role column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('admin', 'user') DEFAULT 'user';

-- Update existing users to have 'user' role if they don't have one
UPDATE users SET role = 'user' WHERE role IS NULL; 