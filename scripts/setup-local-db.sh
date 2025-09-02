#!/bin/bash

# Database initialization script for local development
# This script helps set up a local PostgreSQL database for testing

set -e

DB_NAME="gsa_website"
DB_USER="gsa_user"
DB_PASSWORD="gsa_password"

echo "🚀 Setting up local PostgreSQL database for GSA Website..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it first:"
    echo "   Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "   macOS: brew install postgresql"
    echo "   Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready &> /dev/null; then
    echo "❌ PostgreSQL service is not running. Please start it:"
    echo "   Ubuntu/Debian: sudo systemctl start postgresql"
    echo "   macOS: brew services start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is installed and running"

# Create database and user
echo "📝 Creating database and user..."

# Connect as postgres user to create database and user
sudo -u postgres psql << EOF
-- Create user if not exists
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
      CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
   END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

\q
EOF

echo "✅ Database and user created successfully"

# Create tables
echo "📋 Creating tables..."

PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME << EOF
-- Create signups table
CREATE TABLE IF NOT EXISTS signups (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  location VARCHAR(500) NOT NULL,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_signups_timestamp ON signups(timestamp);
CREATE INDEX IF NOT EXISTS idx_signups_location ON signups(location);

-- Insert sample data
INSERT INTO signups (id, name, email, location, lat, lng, timestamp) VALUES 
('1725321600000', 'John Doe', 'john@example.com', 'New York', 40.7128, -74.0060, '2024-09-02T16:00:00.000Z'),
('1725325200000', 'Jane Smith', 'jane@example.com', 'London', 51.5074, -0.1278, '2024-09-02T17:00:00.000Z'),
('1725328800000', 'Akira Tanaka', 'akira@example.com', 'Tokyo', 35.6762, 139.6503, '2024-09-02T18:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

\q
EOF

echo "✅ Tables created and sample data inserted"

# Update environment file
echo "⚙️  Updating .env.local..."

LOCAL_DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

if [ -f .env.local ]; then
    # Update existing DATABASE_URL or add it
    if grep -q "^DATABASE_URL=" .env.local; then
        sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"$LOCAL_DATABASE_URL\"|" .env.local
    else
        echo "" >> .env.local
        echo "# Local PostgreSQL Database" >> .env.local
        echo "DATABASE_URL=\"$LOCAL_DATABASE_URL\"" >> .env.local
    fi
else
    # Create .env.local file
    cat > .env.local << EOF
# Local PostgreSQL Database
DATABASE_URL="$LOCAL_DATABASE_URL"
EOF
fi

echo "✅ Environment variables updated in .env.local"

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "📋 Connection details:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Password: $DB_PASSWORD"
echo "   URL: $LOCAL_DATABASE_URL"
echo ""
echo "🚀 You can now run your application:"
echo "   npm run dev"
echo ""
echo "🔧 To connect manually:"
echo "   PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME"
echo ""
echo "⚠️  Note: This is for local development only."
echo "   For production, use Vercel Postgres or another cloud provider."
