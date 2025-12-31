"use client"

import { useState } from "react"
import { DashboardNavbar } from "@/components/dashboard/DashboardNavbar"
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
    <div className="min-h-screen bg-slate-950">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
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
