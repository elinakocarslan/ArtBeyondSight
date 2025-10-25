/**
 * API service for communicating with the Art Beyond Sight backend
 */

const API_BASE_URL = 'http://localhost:8000'; // Change for production

export interface ImageAnalysisData {
  id?: string;
  image_name: string;
  analysis_type: string;
  descriptions: string[];
  metadata?: any;
  image_url?: string;
  image_base64?: string;
  created_at?: string;
  updated_at?: string;
}

export class ArtBeyondSightAPI {
  
  /**
   * Submit image analysis results to the backend
   * Call this after your teammate's image processing
   */
  static async submitImageAnalysis(data: ImageAnalysisData): Promise<ImageAnalysisData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/image-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting image analysis:', error);
      throw error;
    }
  }

  /**
   * Get all image analyses, optionally filtered by type
   * Call this to populate lists, galleries, recent items
   */
  static async getAllAnalyses(analysisType?: string, limit: number = 50): Promise<ImageAnalysisData[]> {
    try {
      let url = `${API_BASE_URL}/api/image-analysis?limit=${limit}`;
      if (analysisType) {
        url += `&analysis_type=${analysisType}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analyses:', error);
      throw error;
    }
  }

  /**
   * Get a specific analysis by ID
   * Call this for detailed views
   */
  static async getAnalysisById(id: string): Promise<ImageAnalysisData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/image-analysis/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analysis by ID:', error);
      throw error;
    }
  }

  /**
   * Search for analyses by image name
   * Call this for search functionality
   */
  static async searchAnalysesByName(name: string): Promise<ImageAnalysisData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/image-analysis/search/${encodeURIComponent(name)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching analyses:', error);
      throw error;
    }
  }

  /**
   * Update an existing analysis
   * Call this to modify descriptions or metadata
   */
  static async updateAnalysis(id: string, updateData: Partial<ImageAnalysisData>): Promise<ImageAnalysisData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/image-analysis/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating analysis:', error);
      throw error;
    }
  }

  /**
   * Delete an analysis
   * Call this for cleanup functionality
   */
  static async deleteAnalysis(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/image-analysis/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    }
  }

  /**
   * Health check
   * Call this to verify backend connection
   */
  static async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
}