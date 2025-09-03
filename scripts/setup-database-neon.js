require("dotenv").config({ path: ".env.local" });
const { neon } = require("@neondatabase/serverless");

async function setupDatabase() {
  try {
    console.log("🔌 Connecting to Neon database...");

    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable not found");
    }

    const sql = neon(process.env.DATABASE_URL);

    console.log("📋 Creating tables...");

    // Create signups table
    await sql`
      CREATE TABLE IF NOT EXISTS signups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        location VARCHAR(255) NOT NULL,
        media_consent BOOLEAN DEFAULT FALSE,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Signups table created");

    // Create comments table
    await sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("✅ Comments table created");

    // Check if we need sample data
    const signupCount = await sql`SELECT COUNT(*) as count FROM signups`;
    if (parseInt(signupCount[0].count) === 0) {
      console.log("📝 Inserting sample data...");

      await sql`
        INSERT INTO signups (name, email, location, media_consent, latitude, longitude) VALUES
        ('John Doe', 'john.doe@umn.edu', 'Minneapolis, MN', true, 44.9778, -93.2650),
        ('Jane Smith', 'jane.smith@umn.edu', 'Saint Paul, MN', false, 44.9537, -93.0900),
        ('Mike Johnson', 'mike.johnson@umn.edu', 'Duluth, MN', true, 46.7867, -92.1005)
      `;
      console.log("✅ Sample signup data inserted");
    }

    // Test query
    const result = await sql`SELECT COUNT(*) as total FROM signups`;
    console.log(
      `🎉 Database setup complete! Total signups: ${result[0].total}`
    );
  } catch (error) {
    console.error("❌ Database setup failed:", error);
  }
}

setupDatabase();
