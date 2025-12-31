# Thumbl - AI-Powered Social Media Thumbnail Generator

**Tagline:** *Viral Thumbnails. Perfect Text. Zero Design Skills.*

---

## 📋 Project Overview

**Thumbl** is an AI-powered application that generates professional, platform-optimized thumbnails for social media. Using Google's Gemini 3 AI (Pro Image + Flash Preview models), it creates stunning visuals with multilingual text overlays tailored for different social platforms.

### Core Technology Stack
- **Framework:** Next.js 15+ (App Router)
- **AI Engine:** Google Gemini 3 (Pro Image + Flash Preview)
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Deployment:** Vercel-ready

---

## ✨ Core Features

### 1. 🎯 Platform Support with Aspect Ratios

| Platform | Aspect Ratio | Format Type | Optimal Use Case |
|----------|--------------|-------------|------------------|
| **YouTube** | 16:9 | Landscape | Video thumbnails, channel banners |
| **LinkedIn** | 3:4 | Portrait | Professional posts, articles |
| **Instagram** | 9:16 | Vertical | Stories, Reels |
| **Facebook** | 9:16 | Vertical | Stories, video posts |

### 2. 🌐 Headline Languages

Support for **4 Indian Languages** to reach diverse audiences:

| Language | Script | Native Name | Use Case |
|----------|--------|-------------|----------|
| **Telugu** | తెలుగు | తెలుగు | Andhra Pradesh, Telangana audiences |
| **Hindi** | देवनागरी | हिंदी | Pan-India, North India |
| **Tamil** | தமிழ் | தமிழ் | Tamil Nadu, Sri Lanka audiences |
| **Marathi** | देवनागरी | मराठी | Maharashtra audiences |

### 3. 🎨 Artistic Styles

Choose from **5 professional design styles:**

| Style | Description | Best For |
|-------|-------------|----------|
| **Cinematic** | Movie-quality visuals with dramatic lighting and depth | Entertainment, storytelling content |
| **Cartoon** | Vibrant, illustrated, playful designs | Fun content, children's content, casual brands |
| **Sketch** | Hand-drawn, artistic, organic look | Creative content, artistic portfolios |
| **3D Art** | Modern 3D rendered graphics | Tech content, modern brands, gaming |
| **Minimalist** | Clean, simple, professional aesthetic | Business content, professional brands |

### 4. 📝 Input Options

#### A. Headline Text (Optional)
- **User-Provided:** Enter your own catchy headline
- **AI-Generated:** Leave blank and let AI create a viral headline
- **Language:** Automatically rendered in selected language
- **Character Limit:** Optimized for platform visibility

#### B. Background Scene Concept
- **Description:** Describe the visual concept/background
- **AI Enhancement:** Click "Enhance with AI" to optimize prompt
- **Context Awareness:** Integrates with search grounding for accuracy
- **Creative Freedom:** From simple to complex descriptions

#### C. Image Quality

| Quality | Resolution | Recommended For | File Size |
|---------|------------|-----------------|-----------|
| **1K** | 1024×576 (16:9) | Quick previews, drafts | Small (~200KB) |
| **2K** | 2048×1152 (16:9) | Social media posting | Medium (~500KB) |
| **4K** | 3840×2160 (16:9) | Professional use, print | Large (~2MB) |

*Note: Resolution adapts based on selected aspect ratio*

#### D. Visual References (Optional)
- **Upload Limit:** Maximum 3 images
- **Purpose:** Guide AI with style/composition references
- **Accepted Formats:** JPG, PNG, WEBP
- **Use Cases:**
  - Upload your portrait for personalized thumbnails
  - Add logo for brand consistency
  - Reference images for style matching

---

## 🤖 AI-Powered Features

### 1. Smart Prompt Enhancement
- **What it does:** AI analyzes and improves your scene description
- **How it works:** Gemini AI enriches prompt with professional details
- **Benefit:** Better, more detailed, professional-looking results
- **Usage:** One-click enhancement button

### 2. Search Grounding (Web Context)
- **What it does:** Fetches real-time web information related to your topic
- **How it works:** AI searches the web and incorporates accurate context
- **Benefit:** More accurate, trending, and relevant visuals
- **Output:** Shows "Topic Intelligence" with source links
- **Toggle:** Can be enabled/disabled

### 3. Multi-Language Text Generation
- **Supported:** Telugu, Hindi, Tamil, Marathi
- **Capability:** AI generates headlines in selected language
- **Font Support:** Uses web fonts for accurate script rendering
- **Quality:** Native-level text generation

### 4. Auto-Headline Generation
- **Trigger:** When headline field is left empty
- **Process:** AI creates catchy, viral-worthy headline
- **Language:** Generated in user-selected language
- **Style:** Optimized for platform and content type

---

## 🔄 User Workflow

### Step-by-Step Process

```
1. Select Platform → Determines aspect ratio (16:9, 3:4, or 9:16)
   ↓
2. Choose Headline Language → Telugu, Hindi, Tamil, or Marathi
   ↓
3. Pick Artistic Style → Cinematic, Cartoon, Sketch, 3D, Minimalist
   ↓
4. Enter Headline (Optional) → AI generates if left blank
   ↓
5. Describe Background Scene → Main visual concept
   ↓
6. Enhance Prompt (Optional) → AI optimizes description
   ↓
7. Set Image Quality → 1K, 2K, or 4K
   ↓
8. Upload References (Optional) → Max 3 images
   ↓
9. Toggle Search Grounding → Enable/disable web context
   ↓
10. Click "Generate" → AI creates thumbnail
    ↓
11. Download Result → High-quality image ready to use
```

---

## 📤 Output Features

### Generated Thumbnail Includes:
- ✅ **High-Resolution Image** - Up to 4K quality
- ✅ **Platform-Optimized Aspect Ratio** - Matches selected platform
- ✅ **Multilingual Text Overlay** - In selected Indian language
- ✅ **Professional Styling** - Based on chosen artistic style
- ✅ **Custom Headline** - User-provided or AI-generated
- ✅ **Scene Composition** - Based on enhanced prompt

### Additional Outputs:
- 📊 **Topic Intelligence** - AI-generated context summary
- 🔗 **Source Attribution** - Web sources used (if grounding enabled)
- 💾 **Download Options** - Direct download with timestamp filename

---

## 🛠️ Technical Specifications

### Frontend Architecture
```typescript
Framework: Next.js 15.x
UI Library: React 19.x
Styling: Tailwind CSS v4
Type System: TypeScript 5.x
State Management: React Hooks (useState, useEffect)
```

### AI Integration
```typescript
AI Provider: Google Gemini AI
Image Model: gemini-3-pro-image-preview (Thumbnail Generation)
Text Model: gemini-3-flash-preview (Enhancement & Search)
Modalities: Text + Image generation
API: @google/genai SDK v1.34.0
```

### Model Usage Breakdown
- **gemini-3-pro-image-preview:** High-quality thumbnail image generation with aspect ratio control
- **gemini-3-flash-preview:** Fast text processing for prompt enhancement and web search grounding

### Image Generation
- **Format:** PNG (base64 encoded)
- **Color Space:** sRGB
- **Quality:** Lossless compression
- **Delivery:** Client-side generation

### Environment Requirements
```bash
Node.js: ≥18.x
npm/pnpm: Latest
API Key: GEMINI_API_KEY (required)
Browser: Modern browsers with ES6+ support
```

---

## 🎯 Use Cases

### Content Creators
- YouTube video thumbnails
- Instagram story covers
- Facebook post visuals
- LinkedIn article headers

### Digital Marketers
- Campaign visuals
- Ad creatives
- Social media posts
- Brand content

### Businesses
- Product launches
- Event promotions
- Announcements
- Branded content

### Regional Content
- Multilingual campaigns
- Localized marketing
- Regional language content
- Cultural-specific visuals

---

## 🚀 Key Differentiators

| Feature | Traditional Design Tools | Thumbl |
|---------|-------------------------|--------|
| **Design Skills Required** | Expert level | None |
| **Time to Create** | 30-60 minutes | 30 seconds |
| **Multilingual Support** | Manual translation | Native AI generation |
| **Platform Optimization** | Manual resizing | Automatic |
| **AI Enhancement** | Not available | Built-in |
| **Cost** | $50-500/month | AI API costs only |

---

## 📊 Feature Roadmap

### Current Features (v1.0)
✅ 4 Platform support (YouTube, LinkedIn, Instagram, Facebook)
✅ 4 Indian languages (Telugu, Hindi, Tamil, Marathi)
✅ 5 Artistic styles
✅ AI prompt enhancement
✅ Search grounding
✅ Multi-image references
✅ 1K/2K/4K quality

### Planned Features (Future)
- [ ] More platforms (Twitter/X, Pinterest, TikTok)
- [ ] More languages (Bengali, Kannada, Malayalam, Gujarati)
- [ ] Custom aspect ratios
- [ ] Template library
- [ ] Batch generation
- [ ] Brand kit integration
- [ ] A/B testing variants
- [ ] Analytics integration

---

## 🔐 Privacy & Security

- **API Keys:** Stored securely, never transmitted to third parties
- **User Images:** Processed client-side, not stored on servers
- **Data Retention:** No persistent storage of user data
- **GDPR Compliant:** Privacy-first approach

---

## 📖 API Reference

### Core Functions

#### `generateThumbnail()`
```typescript
generateThumbnail(
  headline: string,
  prompt: string,
  language: IndianLanguage,
  size: ImageSize,
  aspectRatio: AspectRatio,
  style: ThumbnailStyle,
  referenceImages?: string[],
  searchContext?: string
): Promise<string>
```

#### `enhancePrompt()`
```typescript
enhancePrompt(prompt: string): Promise<string>
```

#### `searchGrounding()`
```typescript
searchGrounding(query: string): Promise<{
  text: string;
  links: Array<{ title: string; uri: string }>;
}>
```

---

## 💡 Tips for Best Results

### 1. Headline Best Practices
- Keep it short (3-7 words)
- Use action words
- Create curiosity
- Be specific

### 2. Scene Description Tips
- Be descriptive but concise
- Include mood/atmosphere
- Mention colors if important
- Specify key elements

### 3. Reference Image Tips
- Use high-quality images
- Ensure good lighting
- Match desired style
- Avoid cluttered backgrounds

### 4. Style Selection Guide
- **Cinematic:** Emotional, storytelling content
- **Cartoon:** Fun, light-hearted content
- **Sketch:** Artistic, creative content
- **3D Art:** Modern, tech content
- **Minimalist:** Professional, clean content

---

## 📞 Support & Documentation

- **GitHub:** [Repository Link]
- **Issues:** [GitHub Issues]
- **Documentation:** This file
- **API Docs:** [Google Gemini AI Docs](https://ai.google.dev/)

---

## 📄 License

[Your License Here]

---

## 🙏 Acknowledgments

- **Google Gemini AI** - AI generation engine
- **Vercel** - Deployment platform
- **Tailwind Labs** - CSS framework
- **Next.js Team** - React framework

---

**Last Updated:** December 2025
**Version:** 1.0.0
**Status:** Production Ready
