export type IndianLanguage = 'Telugu' | 'Hindi' | 'Tamil' | 'Marathi';

export type ImageSize = '1K' | '2K' | '4K';

export type AspectRatio = '16:9' | '1:1' | '4:5' | '9:16';

export type ThumbnailStyle = 'Cinematic' | 'Cartoon' | 'Sketch' | '3D Art' | 'Minimalist';

export interface ThumbnailRequest {
  headline: string;
  prompt: string;
  language: IndianLanguage;
  size: ImageSize;
  aspectRatio: AspectRatio;
  style: ThumbnailStyle;
  referenceImages?: string[]; // array of base64 strings
  useGoogleSearch: boolean;
}

export interface ThumbnailResult {
  imageUrl: string;
  searchContext?: string;
  groundingLinks?: { title: string; uri: string }[];
  aspectRatio: AspectRatio;
}

export interface AppState {
  isGenerating: boolean;
  result: ThumbnailResult | null;
  error: string | null;
}
