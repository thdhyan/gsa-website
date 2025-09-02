# GSA Website - Global Signup & Map

A Next.js website featuring a signup form and interactive map showing member locations worldwide.

## Features

- **Signup Form**: Collects name, email, and location from users
- **Interactive Map**: Displays pins for each signup location using Leaflet
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **API Routes**: RESTful endpoints for managing signups
- **TypeScript**: Full type safety throughout the application

## Pages

- `/` - Home page with navigation and feature overview
- `/signup` - Signup form for new members
- `/map` - Interactive map showing all member locations

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Maps**: React Leaflet with OpenStreetMap
- **Language**: TypeScript
- **Data Storage**: JSON file (easily upgradeable to database)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gsa-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket
2. Import your project to [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Manual Deployment

```bash
npm run build
npm run start
```

## API Endpoints

- `GET /api/signups` - Retrieve all signups
- `POST /api/signups` - Create a new signup

### POST /api/signups Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "location": "New York"
}
```

## Data Structure

Signups are stored in `/data/signups.json` with the following structure:

```json
{
  "id": "1640995200000",
  "name": "John Doe",
  "email": "john@example.com",
  "location": "New York",
  "coordinates": {
    "lat": 40.7128,
    "lng": -74.0060
  },
  "timestamp": "2023-12-31T23:59:59.999Z"
}
```

## Customization

### Adding Real Geocoding

Replace the mock geocoding in `/src/app/api/signups/route.ts` with a real service:

```typescript
// Example using Google Maps Geocoding API
async function geocodeLocation(location: string) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  
  if (data.results?.[0]?.geometry?.location) {
    return {
      lat: data.results[0].geometry.location.lat,
      lng: data.results[0].geometry.location.lng
    };
  }
  
  return null;
}
```

### Database Integration

To use a database instead of JSON file storage:

1. Install your preferred database client (e.g., `@prisma/client`, `mongoose`)
2. Replace the file operations in `/src/app/api/signups/route.ts`
3. Add environment variables for database connection

## Environment Variables

Create a `.env.local` file for sensitive configuration:

```env
# Optional: Google Maps API key for geocoding
GOOGLE_MAPS_API_KEY=your_api_key_here

# Optional: Database connection string
DATABASE_URL=your_database_url_here
```

## License

MIT License - feel free to use this project for your own purposes.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues and questions, please open a GitHub issue.
