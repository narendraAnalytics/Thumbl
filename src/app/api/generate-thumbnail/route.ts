import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { GoogleGenAI } from '@google/genai'
import { IndianLanguage, ImageSize, AspectRatio, ThumbnailStyle } from '@/types/thumbnail'

// Helper functions copied from geminiService.ts
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables")
  }
  return new GoogleGenAI({ apiKey })
}

const getStyleInstruction = (style: ThumbnailStyle): string => {
  switch (style) {
    case 'Cinematic':
      return 'Cinematic lighting, high-end photography, professional, deep shadows, and high contrast.'
    case 'Cartoon':
      return 'Vibrant, saturated colors, bold outlines, playful and energetic cartoon illustration style.'
    case 'Sketch':
      return 'Hand-drawn charcoal or pencil sketch aesthetic, artistic textures, and creative line work.'
    case '3D Art':
      return 'Modern 3D render, Octane render style, soft plastic or metallic textures, volumetric lighting.'
    case 'Minimalist':
      return 'Flat vector design, clean negative space, simple geometric shapes, and a limited sophisticated color palette.'
    default:
      return 'Professional and modern aesthetic.'
  }
}

const getFontStyle = (style: ThumbnailStyle): string => {
  switch (style) {
    case 'Cinematic':
      return 'Bold, dramatic, movie-poster style font with drop shadows and metallic or gradient effects'
    case 'Cartoon':
      return 'Chunky, playful, thick outlined font with vibrant colors, comic book style'
    case 'Sketch':
      return 'Hand-lettered, artistic font with texture, as if drawn by hand'
    case '3D Art':
      return 'Modern, clean 3D extruded font with glossy finish or neon glow'
    case 'Minimalist':
      return 'Geometric Sans-Serif, thin or medium weight, elegant spacing'
    default:
      return 'Bold, modern Sans-Serif font with high contrast'
  }
}

const getPlatformName = (ratio: AspectRatio): string => {
  if (ratio === '16:9') return 'YouTube Thumbnail / Standard Landscape'
  if (ratio === '1:1') return 'Instagram / LinkedIn Square Post'
  if (ratio === '4:5') return 'LinkedIn / Instagram Portrait Post'
  if (ratio === '9:16') return 'Instagram / Facebook / YouTube Shorts Story/Reel'
  return 'Social Media Post'
}

interface CategoryContext {
  keywords: string
  colorPalette: string
  mood: string
  backgroundStrategy: string
  referenceImageGuidance: string
}

const detectCategory = (prompt: string, headline: string): CategoryContext => {
  const combined = `${prompt} ${headline}`.toLowerCase()

  // Film/Movie Review
  if (combined.match(/movie|film|review|cinema|trailer|breakdown/)) {
    return {
      keywords: 'Cinematic atmosphere, movie theater aesthetic, film grain texture. CRITICAL: If user uploaded film poster/banner, preserve it as main background with full detail.',
      colorPalette: 'Rich teals, warm oranges, deep blacks (Hollywood color grade)',
      mood: 'Dramatic, epic, emotionally engaging',
      backgroundStrategy: 'Preserve uploaded film posters/banners with full detail - they are KEY content, not just decoration',
      referenceImageGuidance: 'User uploaded film posters/expressions must be sharp, recognizable, and fully visible. NO cropping of faces or poster details.'
    }
  }

  // News/Politics
  if (combined.match(/news|election|politics|breaking|analysis|debate/)) {
    return {
      keywords: 'Broadcast studio style, serious journalism aesthetic, TV newsroom feel',
      colorPalette: 'Red and blue accent themes, clean whites, professional navy',
      mood: 'Urgent, trustworthy, authoritative',
      backgroundStrategy: 'Clean professional backgrounds. If article screenshot uploaded, integrate it prominently.',
      referenceImageGuidance: 'Uploaded news article images or person photos should be sharp, professional, well-framed'
    }
  }

  // Tech/Gadget
  if (combined.match(/tech|gadget|phone|laptop|review|unboxing|ai|software/)) {
    return {
      keywords: 'Modern tech aesthetic, sleek surfaces, LED glow effects',
      colorPalette: 'Neon blues, electric purples, chrome metallics, matte blacks',
      mood: 'Futuristic, innovative, cutting-edge',
      backgroundStrategy: 'Clean, modern backgrounds with subtle gradients. Focus on uploaded product images.',
      referenceImageGuidance: 'Uploaded product photos are CRITICAL - keep them sharp, centered, well-lit with no truncation'
    }
  }

  // Finance/Business
  if (combined.match(/money|stock|invest|business|entrepreneur|finance|tax/)) {
    return {
      keywords: 'Professional business setting, corporate aesthetic, wealth symbols',
      colorPalette: 'Gold accents, deep green (money), navy blue, white',
      mood: 'Professional, ambitious, success-oriented',
      backgroundStrategy: 'Professional, clean backgrounds. Charts/graphs if uploaded should be clearly visible.',
      referenceImageGuidance: 'Person photos should look professional, confident. Product/chart images sharp and readable.'
    }
  }

  // Fitness/Health
  if (combined.match(/fitness|workout|health|gym|diet|exercise/)) {
    return {
      keywords: 'High-energy fitness aesthetic, athletic vibe, gym environment',
      colorPalette: 'Vibrant reds, energetic oranges, fresh greens',
      mood: 'Motivational, energetic, powerful',
      backgroundStrategy: 'Dynamic, energetic backgrounds. Gym/outdoor settings if uploaded should be vibrant.',
      referenceImageGuidance: 'Uploaded fitness photos: show full body transformations, keep energetic and motivating'
    }
  }

  // Gaming
  if (combined.match(/game|gaming|gameplay|streamer|esports/)) {
    return {
      keywords: 'Gaming aesthetic, RGB lighting, competitive vibe',
      colorPalette: 'Neon greens, electric blues, vibrant purples, RGB gradients',
      mood: 'Exciting, intense, competitive',
      backgroundStrategy: 'Dark, immersive gaming backgrounds with RGB effects. Game screenshots should be vibrant.',
      referenceImageGuidance: 'Streamer faces: expressive, well-lit. Game screenshots: sharp, colorful, recognizable'
    }
  }

  // Cooking/Food
  if (combined.match(/recipe|cooking|food|chef|baking|kitchen/)) {
    return {
      keywords: 'Food photography style, kitchen setting, appetizing presentation',
      colorPalette: 'Warm browns, fresh greens, rich reds, golden yellows',
      mood: 'Appetizing, cozy, inviting',
      backgroundStrategy: 'Warm, inviting kitchen backgrounds. Food photos are hero content - keep detailed.',
      referenceImageGuidance: 'Uploaded food photos: make them look DELICIOUS - sharp focus, appetizing lighting, full dish visible'
    }
  }

  // Default/General
  return {
    keywords: 'Modern, professional aesthetic',
    colorPalette: 'Balanced, visually appealing color scheme',
    mood: 'Engaging and attention-grabbing',
    backgroundStrategy: 'Clean, professional background that supports text readability',
    referenceImageGuidance: 'Uploaded images are important - keep them sharp, well-composed, and fully visible'
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse multipart form data
    const formData = await request.formData()

    // Extract parameters
    const headline = formData.get('headline') as string || ''
    const prompt = formData.get('prompt') as string
    const language = formData.get('language') as IndianLanguage
    const size = formData.get('size') as ImageSize
    const aspectRatio = formData.get('aspectRatio') as AspectRatio
    const style = formData.get('style') as ThumbnailStyle
    const searchContext = formData.get('searchContext') as string || ''

    // Validate required fields
    if (!prompt || !language || !size || !aspectRatio || !style) {
      return NextResponse.json(
        { error: 'Missing required fields: prompt, language, size, aspectRatio, style' },
        { status: 400 }
      )
    }

    // 3. Extract reference image files (if any)
    const referenceFiles: File[] = []
    for (let i = 0; i < 3; i++) {
      const file = formData.get(`referenceImage${i}`) as File | null
      if (file && file.size > 0) {
        referenceFiles.push(file)
      }
    }

    // 4. Convert reference images to base64 (in memory - temporary)
    const referenceBase64: string[] = []
    for (const file of referenceFiles) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')
      referenceBase64.push(base64)
    }

    // 5. Build system prompt using helper functions
    const ai = getAIClient()
    const platform = getPlatformName(aspectRatio)
    const styleInstruction = getStyleInstruction(style)
    const fontStyleInstruction = getFontStyle(style)
    const categoryContext = detectCategory(prompt, headline)

    const headlineInstruction = headline.trim()
      ? `TEXT OVERLAY (CRITICAL): Render the exact text "${headline}" in ${language} language.
       Font Style: ${fontStyleInstruction}.
       Text must be the dominant visual element - large, bold, and perfectly readable.
       NO SPELLING ERRORS. Text must be crisp and sharp.`
      : `TEXT OVERLAY: Generate a highly viral, attention-grabbing headline in ${language} using exactly 3-6 words based on visual context.
       Font Style: ${fontStyleInstruction}.`

    const systemPrompt = `You are an expert YouTube Thumbnail Designer and Social Media Graphics Specialist known for creating high-CTR (Click-Through Rate) images for ${platform}.

Task: Create a professional-quality ${platform} thumbnail (${aspectRatio} aspect ratio, ${size} resolution).

TECHNICAL QUALITY REQUIREMENTS:
- Resolution: Maximum quality for ${size} (1k/2k/4k as specified) - crystal clear, no pixelation
- Render Style: Photorealistic, professional-grade as seen on top YouTube channels
- Sharpness: Tack-sharp focus on all key elements, especially text and uploaded reference images
- Reference Images: If user uploaded images, they are CRITICAL - preserve them clearly, do not truncate faces/products/posters

ARTISTIC STYLE: ${styleInstruction}
${headlineInstruction}

CATEGORY CONTEXT (${categoryContext.mood.toUpperCase()} ${platform.toUpperCase()} THUMBNAIL):
Visual Keywords: ${categoryContext.keywords}
Color Palette: ${categoryContext.colorPalette}
Mood & Tone: ${categoryContext.mood}

BACKGROUND STRATEGY:
${categoryContext.backgroundStrategy}

REFERENCE IMAGE REQUIREMENTS:
${categoryContext.referenceImageGuidance}
${referenceBase64.length > 0 ? `USER PROVIDED ${referenceBase64.length} REFERENCE IMAGE(S) - These are CRITICAL PRIMARY CONTENT. Preserve them clearly, sharply, and completely (no truncation).` : ''}

CRITICAL COMPOSITION RULES:
1. NO TRUNCATION: Ensure the entire subject (people, characters, or key objects) is fully visible within the frame.
2. DO NOT cut off heads, faces, hair, or limbs. The subject must be contained entirely within the image boundaries.
3. SPACING: Provide enough padding around the main subject so it looks natural and not cramped.
4. VISIBILITY: The ${language} text must be the central focus, using bold, thick, stylized typography that is extremely readable against the background.
5. LAYOUT: Place the headline strategically. Ensure it doesn't cover faces or key focal points.
6. SAFE ZONES: For YouTube, keep the bottom right clear for timestamps. For vertical formats, keep important content away from extreme edges.
7. REFERENCE IMAGE HANDLING (CRITICAL):
   - If user uploaded images (faces, expressions, film posters, product shots, news articles), they are PRIMARY content
   - Uploaded faces/people: Keep sharp, centered, well-lit, NO truncation of heads/bodies
   - Uploaded film posters/banners: Preserve detail, use as main background, keep recognizable
   - Uploaded product images: Keep sharp, prominent placement, clean presentation
   - Uploaded news article screenshots: Preserve readability, integrate naturally
   - NEVER crop out important parts of uploaded images - show them completely within safe zones
8. LIGHTING & DEPTH:
   - Use professional lighting appropriate for content type
   - Film/Movie content: Cinematic lighting, preserve background poster/banner detail
   - News content: Clean, bright, trustworthy broadcast-style lighting
   - Tech/Product: Studio lighting with clean backgrounds or subtle gradients
   - For people/faces: Flattering lighting with proper fill and rim lights
9. BACKGROUND STRATEGY (Content-Type Dependent):
   - Film/Movie: Background (posters, banners, scenes) is IMPORTANT - keep detailed and recognizable
   - News: Clean professional backgrounds, integrate article images if provided
   - Tech: Clean, modern backgrounds that don't distract from product
   - General: Ensure background supports text readability without overwhelming it

TEXT RENDERING REQUIREMENTS:
1. SPELLING: Render "${headline}" with ZERO spelling mistakes. Each letter must be pixel-perfect.
2. READABILITY: Text must have extreme contrast against background (use outline, shadow, or contrasting background box if needed)
3. PLACEMENT: Position text in the upper 2/3 of the image for maximum impact
4. SIZE: Text should occupy 30-50% of the canvas for high visibility
5. STYLE CONSISTENCY: Typography must match the ${style} aesthetic perfectly

CONTEXT FROM SEARCH: ${searchContext || 'None'}.
VISUAL DESCRIPTION: ${prompt}.
The final thumbnail must be ready to publish on ${platform} without any editing, matching the quality of top channels.`

    // 6. Build parts array with system prompt and reference images
    const parts: any[] = [{ text: systemPrompt }]

    // Add reference images as inline data
    referenceBase64.forEach(base64 => {
      parts.push({
        inlineData: {
          data: base64,
          mimeType: 'image/jpeg',
        },
      })
    })

    // 7. Call Gemini API with retry logic
    let response
    let lastError
    const maxRetries = 3
    const baseDelay = 2000 // 2 seconds

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: { parts },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio,
              imageSize: size,
            }
          },
        })
        break // Success - exit retry loop
      } catch (error: any) {
        lastError = error
        const isOverloaded = error?.message?.includes('overloaded') || error?.message?.includes('503')

        // Only retry on 503/overload errors
        if (isOverloaded && attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt) // Exponential backoff: 2s, 4s, 8s
          console.log(`API overloaded, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})...`)
          await new Promise(resolve => setTimeout(resolve, delay))
        } else {
          throw error // Not overloaded error or final attempt - rethrow
        }
      }
    }

    if (!response) {
      throw lastError || new Error('Failed after retries')
    }

    // 8. Extract generated image
    let imageUrl = ""
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`
        break
      }
    }

    if (!imageUrl) {
      throw new Error("No image was generated by the model")
    }

    // 9. Return generated image (reference images automatically discarded after response)
    return NextResponse.json({ imageUrl })

  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate thumbnail' },
      { status: 500 }
    )
  }
}
