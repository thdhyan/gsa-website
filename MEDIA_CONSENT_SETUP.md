# Setting up Media Consent in Neon Database

## Quick Setup in Neon Console

Since you already have the Neon database configured, you need to add the `media_consent` column to your existing table. 

### Option 1: Add Column to Existing Table

If you already have a `signups` table, run this in your Neon SQL Editor:

```sql
-- Add media consent column to existing table
ALTER TABLE signups ADD COLUMN media_consent BOOLEAN DEFAULT FALSE;
```

### Option 2: Create New Table (if needed)

If you need to create the table from scratch, run this in your Neon SQL Editor:

```sql
-- Create signups table with media consent
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

## How to Access Neon SQL Editor

1. Go to [Neon Console](https://console.neon.tech/)
2. Select your project
3. Go to "SQL Editor" in the sidebar
4. Paste and run the SQL commands above

## What's New

The signup form now includes:

✅ **Media Consent Checkbox**: Users can opt-in to being photographed/recorded during events
✅ **Professional Wording**: Clear explanation of how media will be used
✅ **Optional Field**: Consent defaults to `false` if not checked
✅ **Database Storage**: `media_consent` column stores the user's choice
✅ **Form Styling**: Matches the existing dark theme design

## Testing

After setting up the database:

1. **Deploy to Vercel**: `git add . && git commit -m "Add media consent" && git push`
2. **Test locally**: `npm run dev` and visit `http://localhost:3000/signup`
3. **Check form**: You should see the new media consent checkbox
4. **Submit test**: Try submitting with and without consent checked
5. **Verify storage**: Check your Neon database to see the `media_consent` values

## Privacy Compliance

The media consent feature helps with:

- **GDPR Compliance**: Explicit consent for media usage
- **Event Documentation**: Clear record of who consents to photography
- **University Requirements**: Meeting institutional privacy standards
- **Professional Events**: Proper consent for promotional materials

The consent text explains that participation is voluntary and can be withdrawn at any time, which is important for privacy compliance.
