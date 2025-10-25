import { ArtBeyondSightAPI, ImageAnalysisData } from './api';

/**
 * Placeholder analyzer for captured/selected images.
 * Returns a mocked recognition result after a short delay.
 * Replace with real API integration (Suno for audio generation + Vision API or custom ML model).
 */
export type AnalysisResult = {
  imageUri: string;
  title: string;
  artist?: string;
  type?: string;
  description: string;
  emotions: string[]; // color-coded tags
  audioUri?: string; // optional preloaded audio fallback
  analysisId?: string; // ID from the database
};

export async function analyzeImage(imageUri: string, mode: 'museum' | 'monuments' | 'landscape'): Promise<AnalysisResult> {
  // Simulate processing time
  await new Promise((res) => setTimeout(res, 1800));

  let mockResult: AnalysisResult;

  // Mock results depending on mode
  if (mode === 'museum') {
    mockResult = {
      imageUri,
      title: 'Starry Night (demo)',
      artist: 'Vincent van Gogh',
      type: 'Post-Impressionism',
      description: 'A swirling night sky above a small town; emotions: wonder and longing.',
      emotions: ['calm', 'dreamy'],
      audioUri: undefined,
    };
  } else if (mode === 'monuments') {
    mockResult = {
      imageUri,
      title: 'Eiffel Tower (demo)',
      artist: 'Gustave Eiffel (engineer)',
      type: 'Monument',
      description: 'A wrought-iron lattice tower in Paris; evokes romance and grandeur.',
      emotions: ['romantic', 'majestic'],
      audioUri: undefined,
    };
  } else {
    // landscape
    mockResult = {
      imageUri,
      title: 'Rolling Hills (demo)',
      type: 'Landscape',
      description: 'A peaceful green panorama; evokes calm and serenity.',
      emotions: ['calm', 'serene'],
      audioUri: undefined,
    };
  }

  // 🔥 NEW: Save analysis results to database
  try {
    const analysisData: ImageAnalysisData = {
      image_name: mockResult.title,
      analysis_type: mode,
      descriptions: [mockResult.description],
      metadata: {
        artist: mockResult.artist,
        type: mockResult.type,
        emotions: mockResult.emotions,
        imageUri: mockResult.imageUri
      }
    };

    const savedAnalysis = await ArtBeyondSightAPI.submitImageAnalysis(analysisData);
    mockResult.analysisId = savedAnalysis.id;
    
    console.log('✅ Analysis saved to database with ID:', savedAnalysis.id);
  } catch (error) {
    console.error('❌ Failed to save analysis to database:', error);
    // Continue without database save - app still works offline
  }

  return mockResult;
}
