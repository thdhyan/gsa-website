-- Create signups table
CREATE TABLE IF NOT EXISTS signups (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  location VARCHAR(500) NOT NULL,
  media_consent BOOLEAN DEFAULT FALSE,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_signups_timestamp ON signups(timestamp);
CREATE INDEX IF NOT EXISTS idx_signups_location ON signups(location);

-- Insert sample data
INSERT INTO signups (id, name, email, location, media_consent, lat, lng, timestamp) VALUES 
('1725321600000', 'John Doe', 'john@example.com', 'New York', TRUE, 40.7128, -74.0060, '2024-09-02T16:00:00.000Z'),
('1725325200000', 'Jane Smith', 'jane@example.com', 'London', FALSE, 51.5074, -0.1278, '2024-09-02T17:00:00.000Z'),
('1725328800000', 'Akira Tanaka', 'akira@example.com', 'Tokyo', TRUE, 35.6762, 139.6503, '2024-09-02T18:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
