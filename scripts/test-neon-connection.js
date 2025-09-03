const { neon } = require("@neondatabase/serverless");

async function testNeonConnection() {
  try {
    console.log("🔌 Testing Neon database connection...");
    const sql = neon(process.env.DATABASE_URL);

    // Test connection
    const result = await sql(
      "SELECT NOW() as current_time, version() as db_version"
    );
    console.log("✅ Connection successful!");
    console.log("📅 Current time:", result[0].current_time);
    console.log("🗄️ Database version:", result[0].db_version.split(" ")[0]);

    // Check existing tables
    const tables = await sql(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(
      "📋 Existing tables:",
      tables.map((t) => t.table_name)
    );
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  }
}

testNeonConnection();
