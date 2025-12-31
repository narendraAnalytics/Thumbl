"use client"

import { useState } from "react"
import Link from "next/link"
import { Home } from "lucide-react"
import { ControlPanel } from "@/components/dashboard/ControlPanel"
import { ResultsPanel } from "@/components/dashboard/ResultsPanel"
import type { ThumbnailResult, IndianLanguage, ImageSize, AspectRatio, ThumbnailStyle } from "@/types/thumbnail"
import { searchGrounding, enhancePrompt, generateThumbnail } from "@/services/geminiService"

export default function DashboardPage() {
  // State management
  const [loading, setLoading] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ThumbnailResult | null>(null)
  const [referenceImages, setReferenceImages] = useState<string[]>([])

  // Form state
  const [headline, setHeadline] = useState('')
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState<IndianLanguage>('Hindi')
  const [size, setSize] = useState<ImageSize>('1K')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')
  const [style, setStyle] = useState<ThumbnailStyle>('Cinematic')
  const [useSearch, setUseSearch] = useState(true)

  // Handler: Enhance Prompt
  const handleEnhance = async () => {
    if (!prompt.trim() || enhancing) return
    setEnhancing(true)
    setError(null)

    try {
      const betterPrompt = await enhancePrompt(prompt)
      setPrompt(betterPrompt)
    } catch (err: any) {
      console.error('Enhance error:', err)
      setError("Could not enhance prompt. Please try again.")
    } finally {
      setEnhancing(false)
    }
  }

  // Handler: Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)

    try {
      let searchContext = ""
      let groundingLinks: { title: string; uri: string }[] = []

      if (useSearch) {
        const searchRes = await searchGrounding(prompt)
        searchContext = searchRes.text
        groundingLinks = searchRes.links
      }

      const imageUrl = await generateThumbnail(
        headline,
        prompt,
        language,
        size,
        aspectRatio,
        style,
        referenceImages.length > 0 ? referenceImages : undefined,
        searchContext
      )

      setResult({
        imageUrl,
        searchContext,
        groundingLinks,
        aspectRatio
      })
    } catch (err: any) {
      console.error('Generation error:', err)
      setError(err.message || "Failed to generate thumbnail. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handler: Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const remainingSlots = 3 - referenceImages.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    filesToProcess.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setReferenceImages(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })

    // Reset input
    e.target.value = ''
  }

  // Handler: Remove Image
  const removeImage = (index: number) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Home Icon - Top Left */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full transition-all group shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Home className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium text-white">Home</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-4">
          <ControlPanel
            headline={headline}
            setHeadline={setHeadline}
            prompt={prompt}
            setPrompt={setPrompt}
            language={language}
            setLanguage={setLanguage}
            size={size}
            setSize={setSize}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            style={style}
            setStyle={setStyle}
            useSearch={useSearch}
            setUseSearch={setUseSearch}
            referenceImages={referenceImages}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            handleEnhance={handleEnhance}
            handleSubmit={handleSubmit}
            enhancing={enhancing}
            loading={loading}
            error={error}
          />
        </div>

        {/* Right Panel: Results */}
        <div className="lg:col-span-8">
          <ResultsPanel
            result={result}
            loading={loading}
            size={size}
            headline={headline}
            aspectRatio={aspectRatio}
            language={language}
          />
        </div>
      </main>
    </div>
  )
}
