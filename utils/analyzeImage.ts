// utils/analyzeImage.ts
// Updated to use Navigator API and save to database

import { analyzeMuseumImage, MuseumAnalysisResult } from './analyzeImageWithNavigator';
import { ArtBeyondSightAPI } from './api';

export interface AnalyzeImageResult {
  imageUri: string;
  title: string;
  artist: string;
  type: string;
  description: string;
  historicalPrompt?: string; // For museum mode
  immersivePrompt?: string;  // For museum mode
  emotions: string[];
  audioUri: string | null;
  analysisId?: string; // Database ID after saving
}

/**
 * Main function to analyze images based on mode
 * Currently supports: museum, monuments, landscape
 */
export async function analyzeImage(
  imageUri: string,
  mode: 'museum' | 'monuments' | 'landscape'
): Promise<AnalyzeImageResult> {

  console.log(`🎯 Starting ${mode} analysis...`);

  try {
    if (mode === 'museum') {
      return await analyzeMuseumMode(imageUri);
    } else if (mode === 'monuments') {
      return await analyzeMonumentsMode(imageUri);
    } else if (mode === 'landscape') {
      return await analyzeLandscapeMode(imageUri);
    } else {
      throw new Error(`Unsupported mode: ${mode}`);
    }
  } catch (error) {
    console.error(`❌ Analysis failed for ${mode} mode:`, error);
    throw error;
  }
}

/**
 * Museum Mode: Full Navigator AI + Suno integration
 */
async function analyzeMuseumMode(imageUri: string): Promise<AnalyzeImageResult> {
  try {
    console.log('🎨 Museum Mode: Starting Navigator AI analysis...');

    // Step 1: Analyze with Navigator AI and generate music with Suno
    const analysisResult: MuseumAnalysisResult = await analyzeMuseumImage(imageUri);

    // Step 2: Save to database (even if music failed)
    console.log('💾 Saving analysis to database...');
    try {
      const savedData = await ArtBeyondSightAPI.saveMuseumAnalysis(analysisResult);
      console.log('✅ Successfully saved to database with ID:', savedData.id);

      // Step 3: Format for ResultScreen
      const result: AnalyzeImageResult = {
        imageUri: analysisResult.imageUri,
        title: analysisResult.paintingName,
        artist: analysisResult.artist,
        type: analysisResult.genre,
        description: analysisResult.historicalPrompt,
        historicalPrompt: analysisResult.historicalPrompt,
        immersivePrompt: analysisResult.immersivePrompt,
        emotions: extractEmotions(analysisResult.immersivePrompt),
        audioUri: analysisResult.audioUri,
        analysisId: savedData.id,
      };

      console.log('✅ Museum analysis complete and saved!');
      return result;

    } catch (dbError) {
      console.error('❌ Database save failed:', dbError);
      console.log('⚠️  Continuing without database save - data will not be in history');

      // Still return result so user can see analysis even if DB fails
      const result: AnalyzeImageResult = {
        imageUri: analysisResult.imageUri,
        title: analysisResult.paintingName,
        artist: analysisResult.artist,
        type: analysisResult.genre,
        description: analysisResult.historicalPrompt,
        historicalPrompt: analysisResult.historicalPrompt,
        immersivePrompt: analysisResult.immersivePrompt,
        emotions: extractEmotions(analysisResult.immersivePrompt),
        audioUri: analysisResult.audioUri,
        analysisId: undefined, // No DB ID since save failed
      };

      console.log('⚠️  Museum analysis complete but NOT saved to database');
      return result;
    }

  } catch (error) {
    console.error('❌ Museum mode analysis failed:', error);
    throw new Error(`Museum analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Monuments Mode: Placeholder (you can implement similar logic)
 */
async function analyzeMonumentsMode(imageUri: string): Promise<AnalyzeImageResult> {
  console.log('🗿 Monuments Mode: Using fallback analysis...');

  // TODO: Implement monuments-specific analysis
  // For now, return mock data
  return {
    imageUri,
    title: 'Monument Placeholder',
    artist: 'Unknown',
    type: 'Monument',
    description: 'This is a placeholder for monument analysis. Implement Navigator AI analysis for monuments mode.',
    emotions: ['historical', 'grand', 'majestic'],
    audioUri: null,
  };
}

/**
 * Landscape Mode: Placeholder (you can implement similar logic)
 */
async function analyzeLandscapeMode(imageUri: string): Promise<AnalyzeImageResult> {
  console.log('🌄 Landscape Mode: Using fallback analysis...');

  // TODO: Implement landscape-specific analysis
  // For now, return mock data
  return {
    imageUri,
    title: 'Landscape Placeholder',
    artist: 'Nature',
    type: 'Landscape',
    description: 'This is a placeholder for landscape analysis. Implement Navigator AI analysis for landscape mode.',
    emotions: ['peaceful', 'serene', 'natural'],
    audioUri: null,
  };
}

/**
 * Helper: Extract emotion keywords from immersive description
 */
function extractEmotions(immersivePrompt: string): string[] {
  const emotionKeywords = [
    'calm', 'dreamy', 'melancholy', 'energetic', 'mysterious',
    'romantic', 'joyful', 'somber', 'dramatic', 'peaceful',
    'intense', 'serene', 'vibrant', 'haunting', 'ethereal'
  ];

  const text = immersivePrompt.toLowerCase();
  const foundEmotions = emotionKeywords.filter(emotion =>
    text.includes(emotion)
  );

  // Return found emotions or default ones
  return foundEmotions.length > 0
    ? foundEmotions.slice(0, 3)
    : ['artistic', 'expressive', 'captivating'];
}

export default analyzeImage;