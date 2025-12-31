
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { IndianLanguage, ImageSize, AspectRatio, ThumbnailStyle, ThumbnailResult } from "../types";

export const searchGrounding = async (query: string): Promise<{ text: string; links: { title: string; uri: string }[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Get the latest information and trending facts about: ${query}. Summarize it briefly for a content creator context.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
    .filter(Boolean) || [];

  return {
    text: response.text || "",
    links: links as { title: string; uri: string }[],
  };
};

export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a professional image prompt engineer. Expand the following simple idea into a vivid, descriptive, and highly detailed image generation prompt. Focus on lighting, textures, composition, and mood. Keep it under 60 words. 
    User Idea: "${originalPrompt}"`,
  });
  return response.text || originalPrompt;
};

const getStyleInstruction = (style: ThumbnailStyle): string => {
  switch (style) {
    case 'Cinematic':
      return 'Cinematic lighting, high-end photography, professional, deep shadows, and high contrast.';
    case 'Cartoon':
      return 'Vibrant, saturated colors, bold outlines, playful and energetic cartoon illustration style.';
    case 'Sketch':
      return 'Hand-drawn charcoal or pencil sketch aesthetic, artistic textures, and creative line work.';
    case '3D Art':
      return 'Modern 3D render, Octane render style, soft plastic or metallic textures, volumetric lighting.';
    case 'Minimalist':
      return 'Flat vector design, clean negative space, simple geometric shapes, and a limited sophisticated color palette.';
    default:
      return 'Professional and modern aesthetic.';
  }
};

const getPlatformName = (ratio: AspectRatio): string => {
  if (ratio === '16:9') return 'YouTube Thumbnail';
  if (ratio === '3:4') return 'LinkedIn Post (Portrait)';
  if (ratio === '9:16') return 'Instagram/Facebook Story/Reel';
  return 'Social Media Post';
};

export const generateThumbnail = async (
  headline: string,
  prompt: string, 
  language: IndianLanguage, 
  size: ImageSize, 
  aspectRatio: AspectRatio,
  style: ThumbnailStyle,
  referenceImages?: string[],
  searchInfo?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const platform = getPlatformName(aspectRatio);
  const styleInstruction = getStyleInstruction(style);

  const headlineInstruction = headline.trim() 
    ? `PRIMARY TEXT OVERLAY: Write "${headline}" exactly as provided in ${language} language characters.`
    : `PRIMARY TEXT OVERLAY: Generate a highly viral, catchy, and short headline in ${language} characters based on the context of the visual prompt.`;

  const systemPrompt = `Create a professional ${platform} (${aspectRatio} aspect ratio). 
  ARTISTIC STYLE: ${styleInstruction}
  ${headlineInstruction}
  
  CRITICAL COMPOSITION RULES:
  1. NO TRUNCATION: Ensure the entire subject (people, characters, or key objects) is fully visible within the frame. 
  2. DO NOT cut off heads, faces, hair, or limbs. The subject must be contained entirely within the image boundaries.
  3. SPACING: Provide enough padding around the main subject so it looks natural and not cramped.
  4. VISIBILITY: The ${language} text must be the central focus, using bold, thick, stylized typography that is extremely readable against the background.
  5. LAYOUT: Place the headline strategically. Ensure it doesn't cover faces or key focal points.
  6. SAFE ZONES: For YouTube, keep the bottom right clear for timestamps. For vertical formats, keep important content away from extreme edges.
  
  CONTEXT FROM SEARCH: ${searchInfo || 'None'}.
  VISUAL DESCRIPTION: ${prompt}.
  The typography style must perfectly match the chosen ${style} aesthetic and be beautifully integrated.`;

  const parts: any[] = [{ text: systemPrompt }];
  
  if (referenceImages && referenceImages.length > 0) {
    referenceImages.forEach(imgData => {
      parts.push({
        inlineData: {
          data: imgData.split(',')[1],
          mimeType: 'image/jpeg',
        },
      });
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: size,
      }
    },
  });

  let imageUrl = "";
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) throw new Error("No image was generated by the model.");
  return imageUrl;
};
