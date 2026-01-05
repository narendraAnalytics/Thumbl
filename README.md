# Thumbl - AI-Powered Multilingual Thumbnail Generator

![Thumbl Banner](./public/images/bannerimage.png)

## 🎯 Overview

Thumbl is a cutting-edge AI-powered thumbnail generation platform that creates stunning, professional-quality thumbnails for YouTube, Instagram, LinkedIn, and other social media platforms. Built with Next.js 15 and powered by Google's Gemini AI, Thumbl supports multiple Indian languages and offers advanced customization options for content creators.

## ✨ Features

### 🎨 AI-Powered Generation
- **Advanced AI Models**: Powered by Google Gemini 3 Pro Image Preview for high-quality thumbnail generation
- **Prompt Enhancement**: Automatic prompt optimization using Gemini Pro for better results
- **Smart Search Grounding**: Real-time context enrichment for more relevant thumbnails

### 🌏 Multilingual Support
Generate thumbnails in multiple Indian languages:
- Hindi
- Tamil
- Telugu
- Kannada
- Malayalam
- Bengali
- Marathi
- Gujarati
- Punjabi
- English

### 🎭 Style Options
- **Cinematic**: Hollywood-style dramatic lighting and high contrast
- **Cartoon**: Vibrant colors and playful illustration style
- **Sketch**: Hand-drawn charcoal or pencil aesthetic
- **3D Art**: Modern 3D renders with volumetric lighting
- **Minimalist**: Clean vector design with geometric shapes

### 📐 Platform Support
- **YouTube (16:9)**: Standard landscape thumbnails
- **Instagram Square (1:1)**: Perfect square posts
- **LinkedIn Portrait (4:5)**: Professional vertical posts
- **Stories/Reels (9:16)**: Full-screen vertical content

### 🖼️ Quality Options
- **1K**: Fast generation for quick previews
- **2K**: Balanced quality and speed
- **4K**: Ultra-high resolution for professional use

### 🎯 Smart Features
- **Reference Image Upload**: Upload up to 3 reference images for better context
- **Auto Category Detection**: Automatically detects content type (Film, News, Tech, etc.)
- **Custom Headlines**: Add text overlays in your chosen language
- **Gallery Management**: Save and organize all your creations

### 💎 Pricing Plans
- **Free Plan**: 1 thumbnail/month, basic features
- **Plus Plan**: 5 thumbnails/month, all styles and platforms
- **Pro Plan**: Unlimited thumbnails, all features unlocked

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Modern icon library
- **React Compiler**: Experimental optimizations

### Backend & APIs
- **Google Gemini AI**:
  - `gemini-3-pro-image-preview` for thumbnail generation
  - `gemini-2.0-flash-exp` for prompt enhancement
  - Real-time search grounding for context enrichment
- **Clerk Authentication**: Secure user authentication and plan management
- **Neon Database**: Serverless PostgreSQL for data storage
- **ImageKit.io**: Image CDN and storage optimization

### Database & ORM
- **PostgreSQL** (via Neon): Serverless, auto-scaling database
- **Drizzle ORM**: TypeScript-first ORM for database operations
- **Database Schema**:
  - Users table with Clerk integration
  - Thumbnails table with metadata (language, style, aspect ratio, etc.)
  - Automatic timestamp tracking

### Image Management
- **ImageKit.io**:
  - Client-side direct uploads
  - Automatic image optimization
  - CDN-powered delivery
  - Secure URL signing

## 🏗️ Project Structure

```
thumbl/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API routes
│   │   │   └── generate-thumbnail/  # Thumbnail generation endpoint
│   │   ├── actions/              # Server actions
│   │   ├── dashboard/            # Main dashboard
│   │   ├── gallery/              # User gallery
│   │   └── showcase/             # Public showcase
│   ├── components/               # React components
│   │   ├── dashboard/            # Dashboard components
│   │   ├── gallery/              # Gallery components
│   │   └── ui/                   # Shared UI components
│   ├── db/                       # Database configuration
│   │   └── schema.ts             # Drizzle schema definitions
│   ├── lib/                      # Utility functions
│   │   ├── planUtils.ts          # Plan limits and features
│   │   └── planUtilsServer.ts    # Server-side plan checks
│   ├── services/                 # External service integrations
│   │   ├── geminiService.ts      # Gemini AI integration
│   │   └── imagekitClientService.ts  # ImageKit integration
│   └── types/                    # TypeScript type definitions
├── public/
│   ├── images/                   # Static images
│   └── gallery/                  # Showcase gallery images
├── drizzle/                      # Database migrations
└── next.config.ts                # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm/bun
- PostgreSQL database (Neon recommended)
- API keys for required services

### Environment Variables

Create a `.env.local` file with the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Neon Database
DATABASE_URL=your_neon_postgres_connection_string

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# ImageKit.io
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd thumbl
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up database**
```bash
npm run db:push
# or
npx drizzle-kit push
```

4. **Run development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Users Table
```typescript
{
  id: uuid (primary key)
  clerkUserId: string (unique)
  createdAt: timestamp
}
```

### Thumbnails Table
```typescript
{
  id: uuid (primary key)
  userId: uuid (foreign key)
  imagekitUrl: string
  imagekitFileId: string
  headline: string
  prompt: string
  language: string
  size: string
  aspectRatio: string
  style: string
  searchContext: text
  groundingLinks: jsonb
  createdAt: timestamp
}
```

## 🔐 Authentication & Authorization

Thumbl uses **Clerk** for authentication with plan-based access control:

- **Plan Detection**: Automatic plan tier detection via Clerk metadata
- **Feature Gating**: Server-side validation for plan-specific features
- **Monthly Limits**: Enforced both client-side and server-side
- **Secure Sessions**: JWT-based session management

## 🎨 How It Works

1. **User Input**: User provides a prompt, selects language, style, and platform
2. **Search Grounding** (Optional): Gemini searches the web for relevant context
3. **Prompt Enhancement**: AI optimizes the prompt for better results
4. **Reference Images**: User can upload up to 3 reference images
5. **AI Generation**: Gemini 3 Pro generates the thumbnail with smart category detection
6. **Image Upload**: Generated image is uploaded to ImageKit for CDN delivery
7. **Database Storage**: Metadata is saved to Neon PostgreSQL
8. **Gallery Display**: User can view, download, and manage all thumbnails

## 🌟 Key Features Deep Dive

### Category Detection
Thumbl automatically detects content categories and applies optimized prompts:
- **Film/Movie**: Cinematic lighting, poster aesthetics
- **News/Politics**: Broadcast studio style, professional look
- **Tech/Gadget**: Modern tech aesthetic, LED effects
- **Finance/Business**: Professional, corporate styling
- **Fitness/Health**: High-energy, motivational vibe
- **Gaming**: RGB lighting, competitive aesthetic
- **Cooking/Food**: Appetizing food photography style

### Smart Image Handling
- Reference images are preserved with full detail
- Automatic face and product detection
- Intelligent cropping prevention
- Optimized lighting based on content type

### Text Rendering
- Pixel-perfect text rendering in chosen language
- Automatic font style matching (Cinematic, Cartoon, etc.)
- High contrast for readability
- Smart positioning to avoid covering key elements

## 📦 Build & Deploy

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel
The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<your-repo-url>)

### Environment Setup
Make sure to add all environment variables in your Vercel project settings.

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## 📝 License

This project is proprietary software. All rights reserved.

## 👤 Contact

**Developer**: Narendra Kumar

- **Email**: [narendra.insights@gmail.com](mailto:narendra.insights@gmail.com)
- **LinkedIn**: [nk-analytics](https://www.linkedin.com/in/nk-analytics)

---

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful image generation capabilities
- **Clerk** for seamless authentication
- **Neon** for serverless PostgreSQL
- **ImageKit.io** for optimized image delivery
- **Vercel** for Next.js framework and hosting platform

---

<div align="center">
  <p>Built with ❤️ using Next.js and AI</p>
  <p>© 2025 Thumbl. All rights reserved.</p>
</div>
