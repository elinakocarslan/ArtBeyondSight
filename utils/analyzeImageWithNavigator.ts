// utils/analyzeImageWithNavigator.ts

import * as FileSystem from 'expo-file-system';

// ============= TYPE DEFINITIONS =============
interface ChatCompletionResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
  }>;
}

interface SunoTask {
  taskId: string;
  status: 'PENDING' | 'GENERATING' | 'SUCCESS' | 'FAILED';
  audioUrl?: string;
}

export interface MuseumAnalysisResult {
  paintingName: string;
  artist: string;
  genre: string;
  historicalPrompt: string; // max 500 chars
  immersivePrompt: string;  // max 400 chars
  audioUri: string | null;
  imageUri: string;
}

// ============= API CONFIGURATION =============
const NAVIGATOR_API_KEY = 'sk-SwCA-nMn6Z1Zz1F0UXDzgQ'; // Your Navigator API Key
const SUNO_API_KEY = 'e53be8225ca6b0c63cdec7a7d4091d59'; // Your Suno API Key

// const NAVIGATOR_API_KEY = process.env.NAVIGATOR_API_KEY;
// const SUNO_API_KEY = process.env.SUNO_API_KEY;

const NAVIGATOR_BASE_URL = 'https://api.ai.it.ufl.edu/v1/';
const SUNO_BASE_URL = 'https://api.sunoapi.org';
const MODEL = 'mistral-small-3.1';

// ============= HELPER: Convert Image to Base64 =============
const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw error;
  }
};


// ============= STEP 1: Analyze Artwork with Navigator AI =============
async function analyzeArtworkWithNavigator(imageUri: string): Promise<{
  paintingName: string;
  artist: string;
  genre: string;
  historicalPrompt: string;
  immersivePrompt: string;
}> {
  try {
    console.log('🎨 Step 1: Converting image to base64...');
    const base64Image = await convertImageToBase64(imageUri);
    const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;

    // PROMPT 1: Get painting metadata (name, artist, genre)
    console.log('🎨 Step 2: Getting painting metadata...');
    const metadataPrompt = `Analyze this artwork and provide ONLY the following information in this EXACT JSON format (no additional text):
{
  "paintingName": "exact title of the painting",
  "artist": "full name of the artist",
  "genre": "art movement or genre (e.g., Impressionism, Renaissance, Modern Art)"
}`;

    const metadataResponse = await fetch(NAVIGATOR_BASE_URL + 'chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NAVIGATOR_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: metadataPrompt },
              { type: 'image_url', image_url: { url: imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!metadataResponse.ok) {
      throw new Error('Failed to get painting metadata');
    }

    const metadataData: ChatCompletionResponse = await metadataResponse.json();
    const metadataContent = metadataData.choices[0]?.message?.content || '';
    
    // Parse JSON from response
    let metadata;
    try {
      metadata = JSON.parse(metadataContent);
    } catch {
      // If not valid JSON, try to extract from text
      metadata = {
        paintingName: 'Unknown Artwork',
        artist: 'Unknown Artist',
        genre: 'Unknown Genre'
      };
    }

    // PROMPT 2: Historical/Descriptive Analysis (500 chars)
    console.log('🎨 Step 3: Getting historical description...');
    const historicalPrompt = `Provide a historical and descriptive analysis of this artwork. Include:
- Historical context and period
- Artistic significance
- What the image depicts
- Cultural importance

IMPORTANT: Your response must be EXACTLY 500 characters or less. Be concise and informative, like a museum description.`;

    const historicalResponse = await fetch(NAVIGATOR_BASE_URL + 'chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NAVIGATOR_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: historicalPrompt },
              { type: 'image_url', image_url: { url: imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!historicalResponse.ok) {
      throw new Error('Failed to get historical description');
    }

    const historicalData: ChatCompletionResponse = await historicalResponse.json();
    let historicalDescription = historicalData.choices[0]?.message?.content || '';
    
    // Ensure 500 char limit
    if (historicalDescription.length > 500) {
      historicalDescription = historicalDescription.substring(0, 497) + '...';
    }

    // PROMPT 3: Immersive/Emotional Description (400 chars)
    console.log('🎨 Step 4: Getting immersive description...');
    const immersivePrompt = `Describe this artwork in a poetic, immersive way that captures:
- Color palette and lighting (be specific)
- Atmosphere and mood
- Emotions evoked
- Sensory details

Write in present tense, as if describing a living moment. Make it vivid and evocative.

IMPORTANT: Your response must be EXACTLY 400 characters or less. Focus on sensory details and emotional weight.`;

    const immersiveResponse = await fetch(NAVIGATOR_BASE_URL + 'chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NAVIGATOR_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: immersivePrompt },
              { type: 'image_url', image_url: { url: imageDataUrl } },
            ],
          },
        ],
      }),
    });

    if (!immersiveResponse.ok) {
      throw new Error('Failed to get immersive description');
    }

    const immersiveData: ChatCompletionResponse = await immersiveResponse.json();
    let immersiveDescription = immersiveData.choices[0]?.message?.content || '';
    
    // Ensure 400 char limit
    if (immersiveDescription.length > 400) {
      immersiveDescription = immersiveDescription.substring(0, 397) + '...';
    }

    console.log('✅ Analysis complete:', {
      name: metadata.paintingName,
      artist: metadata.artist,
      genre: metadata.genre,
      historicalLength: historicalDescription.length,
      immersiveLength: immersiveDescription.length
    });

    return {
      paintingName: metadata.paintingName,
      artist: metadata.artist,
      genre: metadata.genre,
      historicalPrompt: historicalDescription,
      immersivePrompt: immersiveDescription,
    };

  } catch (error) {
    console.error('❌ Navigator API analysis error:', error);
    throw new Error(`Failed to analyze artwork: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============= STEP 2: Generate Music with Suno API =============
async function generateMusicWithSuno(prompt: string): Promise<string | null> {
  try {
    console.log('🎵 Step 5: Starting Suno music generation...');
    console.log('Music prompt:', prompt);

    const response = await fetch(`${SUNO_BASE_URL}/api/v1/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUNO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        customMode: false,
        instrumental: true,
        model: 'V4_5',
        callBackUrl: 'https://webhook.site/unique-id',
      }),
    });

    const result = await response.json();
    console.log('Suno API Response:', result);

    if (result.code !== 200) {
      throw new Error(`Suno API Error: ${result.msg}`);
    }

    const taskId = result.data.taskId;
    if (!taskId) {
      throw new Error('No taskId returned from Suno API');
    }

    console.log('✅ Task created with ID:', taskId);

    // Poll for completion
    const audioUrl = await pollSunoTaskStatus(taskId);
    return audioUrl;

  } catch (error) {
    console.error('❌ Suno music generation error:', error);
    return null; // Return null if music generation fails (non-critical)
  }
}

// ============= HELPER: Poll Suno Task Status =============
async function pollSunoTaskStatus(taskId: string): Promise<string | null> {
  const maxAttempts = 60; // 5 minutes max
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      console.log(`🔍 Checking task status (attempt ${attempts + 1}/${maxAttempts})...`);

      const response = await fetch(
        `${SUNO_BASE_URL}/api/v1/generate/record-info?taskId=${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${SUNO_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to check task status');
      }

      const result = await response.json();
      const status = result.data.status;

      console.log('Current status:', status);

      if (status === 'SUCCESS' && result.data.response?.data?.[0]) {
        const audioUrl = result.data.response.data[0].audio_url;
        console.log('✅ Music generation complete! Audio URL:', audioUrl);
        return audioUrl;
      }

      if (status === 'FAILED') {
        console.error('❌ Music generation failed');
        return null;
      }

      // Wait 5 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;

    } catch (error) {
      console.error('❌ Error checking task status:', error);
      return null;
    }
  }

  console.error('❌ Music generation timeout');
  return null;
}

// ============= MAIN EXPORT: Complete Museum Analysis =============
export async function analyzeMuseumImage(imageUri: string): Promise<MuseumAnalysisResult> {
  try {
    console.log('🚀 Starting complete museum image analysis...');
    console.log('Image URI:', imageUri);

    // Step 1-4: Analyze artwork with Navigator AI
    const analysis = await analyzeArtworkWithNavigator(imageUri);

    // Step 5-6: Generate music with Suno API (using immersive prompt)
    const audioUri = await generateMusicWithSuno(analysis.immersivePrompt);

    const result: MuseumAnalysisResult = {
      paintingName: analysis.paintingName,
      artist: analysis.artist,
      genre: analysis.genre,
      historicalPrompt: analysis.historicalPrompt,
      immersivePrompt: analysis.immersivePrompt,
      audioUri: audioUri,
      imageUri: imageUri,
    };

    console.log('🎉 Complete analysis finished!');
    console.log('Result:', {
      ...result,
      audioUri: audioUri ? '✅ Generated' : '❌ Failed'
    });

    return result;

  } catch (error) {
    console.error('❌ Complete analysis failed:', error);
    throw error;
  }
}

// Export default for easy import
export default analyzeMuseumImage;