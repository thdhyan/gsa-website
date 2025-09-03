# OpenCage Data Geocoding Integration

This project now uses OpenCage Data (https://opencagedata.com/api) for reliable geocoding services.

## Benefits of OpenCage Data

- **Generous Free Tier**: 2,500 requests/day free
- **High Quality Data**: Aggregates multiple data sources
- **Global Coverage**: Comprehensive worldwide location data
- **Simple API**: Clean REST interface with JSON responses

## Environment Variables

To enable full geocoding functionality, add your OpenCage Data API key to your environment:

```bash
OPENCAGE_API_KEY=your_api_key_here
```

Get your free API key at: https://opencagedata.com/users/sign_up

## API Usage

- **Simple Text Input**: Users just type any location
- **Automatic Geocoding**: `/api/geocode-text?address=full_address`
- **No Autocomplete**: Simplified user experience with direct text input

## Fallback System

The system includes multiple fallback layers:

1. **OpenCage Data API**: Primary geocoding service
2. **Comprehensive Mock Database**: Covers major cities worldwide
3. **Default Location**: University of Minnesota (Minneapolis) as final fallback

## API Endpoints

- `GET /api/geocode-text` - Get coordinates from any address text using OpenCage Data
- `GET /api/geocode` - Legacy endpoint for compatibility

## Removed Features

- **Autocomplete**: Removed for simplicity - users directly enter locations
- **Places API**: No longer needed with direct text input approach

## Previous Integrations

This replaces the previous Nominatim and PositionStack integrations for better reliability and data quality.
- `GET /api/geocode-text` - Get coordinates from any address text
