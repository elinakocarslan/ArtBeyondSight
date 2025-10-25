# Frontend-Backend Integration Guide

## Overview
This guide explains how the frontend (React Native/Expo) connects to the backend (FastAPI + MongoDB) to save image analysis results.

## Architecture Flow

```
User Takes Photo
      ↓
analyzeMuseumImage() in analyzeImageWithNavigator.ts
      ↓
1. Navigator AI analyzes the artwork
2. Suno API generates music
3. ArtBeyondSightAPI.saveMuseumAnalysis() saves to MongoDB
      ↓
FastAPI Backend (/api/image-analysis)
      ↓
MongoDB Database (gallery.artifacts collection)
```

## Setup Instructions

### 1. Start the Backend Server

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt
python main.py
```

The server should start at `http://localhost:8000`

### 2. Configure Frontend API URL

In `utils/api.ts`, update the `API_BASE_URL` if needed:

```typescript
const API_BASE_URL = 'http://localhost:8000'; // For local development
// const API_BASE_URL = 'https://your-deployed-backend.com'; // For production
```

**Important for iOS Simulator/Android Emulator:**
- iOS Simulator: Use `http://localhost:8000`
- Android Emulator: Use `http://10.0.2.2:8000`
- Physical Device: Use your computer's local IP (e.g., `http://192.168.1.100:8000`)

### 3. How It Works

When you call `analyzeMuseumImage(imageUri)`:

1. **Image Analysis** (Navigator AI):
   - Gets painting metadata (name, artist, genre)
   - Generates historical description (500 chars)
   - Generates immersive description (400 chars)

2. **Music Generation** (Suno API):
   - Creates ambient music based on the immersive description
   - Returns audio URL

3. **Database Save** (Automatic):
   - Sends JSON to FastAPI backend
   - Backend saves to MongoDB
   - Returns database ID

## Example Usage

```typescript
import analyzeMuseumImage from './utils/analyzeImageWithNavigator';

const result = await analyzeMuseumImage('file:///path/to/image.jpg');

console.log(result);
// Output:
// {
//   paintingName: "Starry Night",
//   artist: "Vincent van Gogh",
//   genre: "Post-Impressionism",
//   historicalPrompt: "Description...",
//   immersivePrompt: "Poetic description...",
//   audioUri: "https://suno.ai/audio/...",
//   imageUri: "file:///path/to/image.jpg",
//   databaseId: "507f1f77bcf86cd799439011" // MongoDB ObjectId
// }
```

## Data Structure in MongoDB

```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "image_name": "Starry Night",
  "analysis_type": "museum",
  "descriptions": [
    "Historical description (500 chars)",
    "Immersive description (400 chars)"
  ],
  "metadata": {
    "artist": "Vincent van Gogh",
    "genre": "Post-Impressionism",
    "imageUri": "file:///...",
    "audioUri": "https://suno.ai/audio/...",
    "historicalPrompt": "...",
    "immersivePrompt": "...",
    "type": "painting"
  },
  "created_at": ISODate("2025-10-25T12:00:00Z"),
  "updated_at": ISODate("2025-10-25T12:00:00Z")
}
```

## API Endpoints Available

### POST /api/image-analysis
Save new analysis to database

### GET /api/image-analysis
Get all analyses (with optional `analysis_type` filter)

### GET /api/image-analysis/{id}
Get specific analysis by MongoDB ID

### GET /api/image-analysis/search/{name}
Search analyses by painting name

### PUT /api/image-analysis/{id}
Update existing analysis

### DELETE /api/image-analysis/{id}
Delete analysis

## Retrieving Saved Data

```typescript
import { ArtBeyondSightAPI } from './utils/api';

// Get all museum analyses
const analyses = await ArtBeyondSightAPI.getAllAnalyses('museum');

// Get specific analysis
const analysis = await ArtBeyondSightAPI.getAnalysisById(databaseId);

// Search by painting name
const results = await ArtBeyondSightAPI.searchAnalysesByName('Starry Night');
```

## Troubleshooting

### Backend not connecting?
1. Check if backend is running: `curl http://localhost:8000/api/health`
2. Check network connectivity
3. Verify CORS settings in `backend/main.py`

### Database save failing?
1. Check MongoDB connection in backend logs
2. Verify `.env` file has correct `MONGODB_PASSWORD`
3. Check console logs for error details

### No database ID in result?
- Database save is non-critical - if it fails, the analysis still returns
- Check console logs for warning messages
- Verify backend URL in `utils/api.ts`

## Environment Variables

Backend requires `.env` file:
```
MONGODB_PASSWORD=your_mongodb_password
```

## Testing the Integration

```bash
# Test backend is running
curl http://localhost:8000/api/health

# Test database save (from terminal)
curl -X POST http://localhost:8000/api/image-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "image_name": "Test Painting",
    "analysis_type": "museum",
    "descriptions": ["Historical", "Immersive"],
    "metadata": {"artist": "Test Artist"}
  }'
```

## Summary

The integration is now **automatic**! Every time `analyzeMuseumImage()` completes:
- ✅ Analysis results are automatically sent to the backend
- ✅ Backend validates and saves to MongoDB
- ✅ Database ID is added to the result
- ✅ Even if database save fails, analysis still returns (graceful degradation)

No manual database calls needed in your UI components - just use `analyzeMuseumImage()` and the data is saved automatically!
