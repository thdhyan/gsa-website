# 🚨 URGENT: Fix Database Connection in Vercel

## Problem

The Vercel deployment is not connecting to your Neon database because the environment variables are not set in Vercel. It's currently using fallback in-memory storage.

## Solution: Set Environment Variables in Vercel Dashboard

### Step 1: Access Vercel Settings

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `gsa-website` project
3. Click on **Settings** tab
4. Navigate to **Environment Variables** section

### Step 2: Add Database URL

Add this exact environment variable:

```
Variable Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_VEupDZF5asc2@ep-snowy-meadow-ado97cvi-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Important Settings:**

- ✅ Check **Production**
- ✅ Check **Preview**
- ✅ Check **Development**

### Step 3: Trigger Redeploy

After adding the environment variable:

1. **Option A**: Go to **Deployments** tab → Click **Redeploy** on latest deployment
2. **Option B**: The deployment was already triggered by the recent git push

### Step 4: Set Up Database Table

Once the environment variable is set, you need to create the database table in Neon:

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Go to **SQL Editor**
4. Run this SQL:

```sql
-- Create the signups table with media consent
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_signups_timestamp ON signups(timestamp);
CREATE INDEX IF NOT EXISTS idx_signups_location ON signups(location);

-- Insert sample data (optional)
INSERT INTO signups (id, name, email, location, media_consent, lat, lng, timestamp) VALUES
('1725321600000', 'John Doe', 'john@example.com', 'New York', TRUE, 40.7128, -74.0060, '2024-09-02T16:00:00.000Z'),
('1725325200000', 'Jane Smith', 'jane@example.com', 'London', FALSE, 51.5074, -0.1278, '2024-09-02T17:00:00.000Z'),
('1725328800000', 'Akira Tanaka', 'akira@example.com', 'Tokyo', TRUE, 35.6762, 139.6503, '2024-09-02T18:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
```

## Verification

After completing the steps above:

1. **Check Vercel Logs**: The database error messages should disappear
2. **Test Signup**: Submit a new signup through your website
3. **Check Neon Database**: Verify the signup appears in your database
4. **Check Map**: New signups should persist and appear on the map

## Expected Result

✅ **Before Fix**: "Database not available, using in-memory storage"  
✅ **After Fix**: No database errors, data persists between requests

## Troubleshooting

If you still see errors after setting the environment variable:

1. **Wait 2-3 minutes** for Vercel to redeploy
2. **Check Environment Variables** are set correctly in Vercel dashboard
3. **Verify Database Table** exists in Neon console
4. **Check Vercel Function Logs** for any new errors

The application will work immediately once the environment variable is properly set!
