#!/usr/bin/env node

// Database setup script for Neon PostgreSQL
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  console.log('🚀 Setting up Neon PostgreSQL database...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    process.exit(1);
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('📋 Creating signups table...');
    
    // Create the signups table
    await sql`
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
      )
    `;
    
    console.log('📊 Creating indexes...');
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_signups_timestamp ON signups(timestamp)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_signups_location ON signups(location)`;
    
    console.log('📝 Inserting sample data...');
    
    // Insert sample data
    await sql`
      INSERT INTO signups (id, name, email, location, media_consent, lat, lng, timestamp) VALUES 
      ('1725321600000', 'John Doe', 'john@example.com', 'New York', TRUE, 40.7128, -74.0060, '2024-09-02T16:00:00.000Z'),
      ('1725325200000', 'Jane Smith', 'jane@example.com', 'London', FALSE, 51.5074, -0.1278, '2024-09-02T17:00:00.000Z'),
      ('1725328800000', 'Akira Tanaka', 'akira@example.com', 'Tokyo', TRUE, 35.6762, 139.6503, '2024-09-02T18:00:00.000Z')
      ON CONFLICT (id) DO NOTHING
    `;
    
    console.log('🔍 Verifying setup...');
    
    // Verify the setup
    const result = await sql`SELECT COUNT(*) as count FROM signups`;
    const count = result[0].count;
    
    console.log(`✅ Database setup complete! Found ${count} records in signups table.`);
    console.log('🎉 Your Neon database is ready to use!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
