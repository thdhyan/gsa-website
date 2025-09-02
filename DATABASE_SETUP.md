# Database Setup Guide

This guide explains how to set up a database for the GSA Website. The application supports multiple database options with automatic fallback to in-memory storage.

## Option 1: Vercel Postgres (Recommended) ⭐

### Setup Steps:

1. **Install the dependency** (already done):
   ```bash
   npm install @vercel/postgres
   ```

2. **Add Vercel Postgres to your project**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Select your project → Storage → Create Database
   - Choose "Postgres" → Create
   - Vercel will automatically add environment variables to your project

3. **Run the database schema**:
   - Go to your Vercel project dashboard
   - Navigate to Storage → Your Database → Query
   - Copy and paste the SQL from `database/schema.sql`
   - Click "Run Query"

4. **Deploy your application**:
   ```bash
   git add .
   git commit -m "Add Vercel Postgres support"
   git push
   ```

### Pricing:
- **Free tier**: 60 hours of compute time per month
- **Pro tier**: $0.50/month for storage + compute usage

---

## Option 2: Supabase (Free & Popular)

### Setup Steps:

1. **Install Supabase client**:
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Create a Supabase project**:
   - Go to [Supabase](https://supabase.com)
   - Create new project
   - Go to Settings → API to get your URL and key

3. **Update environment variables**:
   ```env
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Create the table**:
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL from `database/schema.sql`

5. **Update API route**:
   Replace the database calls in `src/app/api/signups/route.ts` with Supabase client calls.

### Pricing:
- **Free tier**: 500MB database, 50MB file storage
- **Pro tier**: $25/month

---

## Option 3: PlanetScale (MySQL)

### Setup Steps:

1. **Install PlanetScale client**:
   ```bash
   npm install @planetscale/database
   ```

2. **Create PlanetScale database**:
   - Go to [PlanetScale](https://planetscale.com)
   - Create new database
   - Get connection string from Settings

3. **Update environment variables**:
   ```env
   DATABASE_URL=mysql://username:password@host/database?ssl={"rejectUnauthorized":true}
   ```

4. **Create schema** (modify for MySQL syntax):
   ```sql
   CREATE TABLE signups (
     id VARCHAR(50) PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     location VARCHAR(500) NOT NULL,
     lat DECIMAL(10, 8),
     lng DECIMAL(11, 8),
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

### Pricing:
- **Free tier**: 1 database, 1GB storage, 1 billion row reads/month
- **Scaler tier**: $39/month

---

## Option 4: Railway (PostgreSQL)

### Setup Steps:

1. **Create Railway project**:
   - Go to [Railway](https://railway.app)
   - Create new project → Add PostgreSQL

2. **Get connection details**:
   - Copy the DATABASE_URL from Railway dashboard

3. **Update environment variables**:
   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

4. **Run schema**:
   - Use Railway's built-in database interface or connect via psql

### Pricing:
- **Free tier**: $5 credit/month (enough for small projects)
- **Pro tier**: Usage-based pricing

---

## Current Implementation

The current code automatically:

1. **Tries to connect to Vercel Postgres** first
2. **Falls back to in-memory storage** if database is unavailable
3. **Maintains data during the session** but resets on restart (in-memory mode)

### Environment Variables

The app looks for these environment variables (in order of priority):

```env
# Vercel Postgres (auto-populated by Vercel)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=

# Generic database URL (works with most providers)
DATABASE_URL=
```

### Testing Database Connection

To test if your database is working:

1. **Deploy to Vercel** or run locally with database URL
2. **Submit a signup** through the form
3. **Check the map page** - if data persists after refresh, database is working
4. **Check Vercel logs** for any database connection errors

### Migration from In-Memory

If you're currently using in-memory storage and want to preserve data:

1. **Export current data**: Add a GET endpoint to download current signups
2. **Set up database** using one of the options above
3. **Import data**: Use the SQL INSERT statements or API calls

### Troubleshooting

**Common issues:**

- **Database connection timeout**: Check if your hosting provider allows database connections
- **SSL errors**: Add `?ssl=true` or `?sslmode=require` to your DATABASE_URL
- **Permission errors**: Ensure your database user has CREATE and INSERT permissions
- **Vercel cold starts**: First request might be slow while establishing connection

**Monitoring:**

- Check Vercel function logs for database errors
- Monitor database usage in your provider's dashboard
- Set up alerts for connection failures

---

## Recommendation

For most users, **Vercel Postgres** is the best choice because:

✅ **Seamless integration** with Vercel deployment  
✅ **Automatic environment variable setup**  
✅ **Built-in connection pooling**  
✅ **No additional configuration needed**  
✅ **Good free tier for small projects**  

The current implementation will work immediately once you add Vercel Postgres to your project!
