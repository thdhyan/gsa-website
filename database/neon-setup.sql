-- Neon Database Setup for GSA Website
-- Run these commands in the Neon SQL Editor

-- Create signups table for GSA event registration
CREATE TABLE IF NOT EXISTS signups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255) NOT NULL,
    media_consent BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table for demo functionality
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_signups_email ON signups(email);
CREATE INDEX IF NOT EXISTS idx_signups_created_at ON signups(created_at);
CREATE INDEX IF NOT EXISTS idx_signups_location ON signups(location);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Insert sample data for testing (optional)
INSERT INTO signups (name, email, location, media_consent, latitude, longitude) VALUES
    ('John Doe', 'john.doe@umn.edu', 'Minneapolis, MN', true, 44.9778, -93.2650),
    ('Jane Smith', 'jane.smith@umn.edu', 'Saint Paul, MN', false, 44.9537, -93.0900),
    ('Mike Johnson', 'mike.johnson@umn.edu', 'Duluth, MN', true, 46.7867, -92.1005),
    ('Sarah Wilson', 'sarah.wilson@umn.edu', 'Rochester, MN', true, 44.0121, -92.4802),
    ('David Brown', 'david.brown@umn.edu', 'Bloomington, MN', false, 44.8408, -93.2983)
ON CONFLICT (email) DO NOTHING;

-- Insert sample comments for testing (optional)
INSERT INTO comments (comment) VALUES
    ('Looking forward to the GSA welcome event!'),
    ('Great to see so many CS students joining the community.'),
    ('The database integration is working perfectly!')
ON CONFLICT DO NOTHING;

-- Verify tables were created
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('signups', 'comments')
ORDER BY table_name, ordinal_position;
