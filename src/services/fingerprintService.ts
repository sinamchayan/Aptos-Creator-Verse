import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

export interface FingerprintResult {
  fingerprint: string;
  confidence: number;
  contentType: 'image' | 'audio' | 'text';
  features: number[];
  timestamp: string;
}

class FingerprintService {
  private imageClassifier: any = null;
  private textClassifier: any = null;

  async initializeImageFingerprinting() {
    if (!this.imageClassifier) {
      console.log('Initializing image fingerprinting model...');
      this.imageClassifier = await pipeline(
        'image-classification',
        'onnx-community/mobilenetv4_conv_small.e2400_r224_in1k',
        { device: 'webgpu' }
      );
    }
    return this.imageClassifier;
  }

  async initializeTextFingerprinting() {
    if (!this.textClassifier) {
      console.log('Initializing text fingerprinting model...');
      this.textClassifier = await pipeline(
        'feature-extraction',
        'mixedbread-ai/mxbai-embed-xsmall-v1',
        { device: 'webgpu' }
      );
    }
    return this.textClassifier;
  }

  async generateImageFingerprint(imageFile: File): Promise<FingerprintResult> {
    try {
      const classifier = await this.initializeImageFingerprinting();
      
      // Create image URL for processing
      const imageUrl = URL.createObjectURL(imageFile);
      
      // Generate classification features
      const result = await classifier(imageUrl);
      
      // Clean up URL
      URL.revokeObjectURL(imageUrl);
      
      // Extract features and create fingerprint
      const features = result.slice(0, 10).map((r: any) => r.score);
      const fingerprint = this.createFingerprint(features, 'image');
      
      return {
        fingerprint,
        confidence: result[0]?.score || 0.8,
        contentType: 'image',
        features,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating image fingerprint:', error);
      throw new Error('Failed to generate image fingerprint');
    }
  }

  async generateTextFingerprint(text: string): Promise<FingerprintResult> {
    try {
      const extractor = await this.initializeTextFingerprinting();
      
      // Generate embeddings
      const embeddings = await extractor(text, { pooling: 'mean', normalize: true });
      const features = embeddings.tolist()[0].slice(0, 20);
      
      const fingerprint = this.createFingerprint(features, 'text');
      
      return {
        fingerprint,
        confidence: 0.95,
        contentType: 'text',
        features,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating text fingerprint:', error);
      throw new Error('Failed to generate text fingerprint');
    }
  }

  async generateAudioFingerprint(audioFile: File): Promise<FingerprintResult> {
    // For audio, we'll create a hash-based fingerprint as a placeholder
    // In a real implementation, you'd use audio processing models
    try {
      const arrayBuffer = await audioFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Simple hash-based fingerprint for audio
      let hash = 0;
      for (let i = 0; i < Math.min(uint8Array.length, 10000); i++) {
        hash = ((hash << 5) - hash + uint8Array[i]) & 0xffffffff;
      }
      
      const features = [hash / 0xffffffff, audioFile.size / 1000000, audioFile.lastModified / 1000000000];
      const fingerprint = this.createFingerprint(features, 'audio');
      
      return {
        fingerprint,
        confidence: 0.85,
        contentType: 'audio',
        features,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating audio fingerprint:', error);
      throw new Error('Failed to generate audio fingerprint');
    }
  }

  private createFingerprint(features: number[], contentType: string): string {
    // Create a deterministic fingerprint from features
    const featureString = features.map(f => f.toFixed(6)).join('');
    const hash = this.simpleHash(contentType + featureString);
    
    // Convert to a readable fingerprint format
    return `${contentType.toUpperCase()}_${hash.toString(16).toUpperCase().slice(0, 16)}`;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Utility method to check if two fingerprints are similar
  async compareFingerprints(fp1: FingerprintResult, fp2: FingerprintResult): Promise<number> {
    if (fp1.contentType !== fp2.contentType) return 0;
    
    // Calculate cosine similarity between feature vectors
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    const minLength = Math.min(fp1.features.length, fp2.features.length);
    
    for (let i = 0; i < minLength; i++) {
      dotProduct += fp1.features[i] * fp2.features[i];
      norm1 += fp1.features[i] * fp1.features[i];
      norm2 += fp2.features[i] * fp2.features[i];
    }
    
    if (norm1 === 0 || norm2 === 0) return 0;
    
    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }
}

export const fingerprintService = new FingerprintService();