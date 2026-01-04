"use client"

import { useState } from "react"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { Home, Images } from "lucide-react"
import { ControlPanel } from "@/components/dashboard/ControlPanel"
import { ResultsPanel } from "@/components/dashboard/ResultsPanel"
import type { ThumbnailResult, IndianLanguage, ImageSize, AspectRatio, ThumbnailStyle } from "@/types/thumbnail"
import { searchGrounding, enhancePrompt } from "@/services/geminiService"
import { saveThumbnail } from "@/app/actions/thumbnailActions"
import { uploadToImageKitClient } from "@/services/imagekitClientService"
import { UpgradeModal } from "@/components/UpgradeModal"
import { PLAN_LIMITS } from "@/lib/planUtils"
import type { PlanTier } from "@/lib/planUtils"

interface DashboardClientProps {
  monthlyCount: number
  userPlan: PlanTier
}

export default function DashboardClient({ monthlyCount, userPlan }: DashboardClientProps) {
  const { user } = useUser()

  // State management
  const [loading, setLoading] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ThumbnailResult | null>(null)
  const [referenceImageFiles, setReferenceImageFiles] = useState<File[]>([])
  const [referenceImagePreviews, setReferenceImagePreviews] = useState<string[]>([])
  const [isPanelExpanded, setIsPanelExpanded] = useState(true)

  // Upgrade modal state
  const [upgradeModal, setUpgradeModal] = useState<{
    open: boolean
    feature: string
    requiredPlan: 'plus' | 'pro'
  }>({
    open: false,
    feature: '',
    requiredPlan: 'plus'
  })

  // Form state
  const [headline, setHeadline] = useState('')
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState<IndianLanguage>('Hindi')
  const [size, setSize] = useState<ImageSize>('1K')
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9')
  const [style, setStyle] = useState<ThumbnailStyle>('Cinematic')
  const [useSearch, setUseSearch] = useState(true)
  const [activeTab, setActiveTab] = useState<'setup' | 'content' | 'style'>('setup')

  // Check if feature is locked
  const isLocked = (feature: string, value: string): boolean => {
    const limits = PLAN_LIMITS[userPlan]
    switch (feature) {
      case 'quality':
        return !limits.qualities.includes(value)
      case 'style':
        return !limits.styles.includes(value)
      case 'platform':
        return !limits.platforms.includes(value)
      default:
        return false
    }
  }

  // Handle locked feature click
  const handleLockedClick = (feature: string, requiredPlan: 'plus' | 'pro') => {
    setUpgradeModal({
      open: true,
      feature,
      requiredPlan
    })
  }

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

    // Only allow submission from Style tab
    if (activeTab !== 'style') {
      return
    }

    if (!prompt.trim()) return

    // Check monthly limit before submission
    const limit = PLAN_LIMITS[userPlan].monthlyImages
    if (monthlyCount >= limit) {
      setUpgradeModal({
        open: true,
        feature: `Monthly limit (${limit} ${limit === 1 ? 'image' : 'images'})`,
        requiredPlan: userPlan === 'free' ? 'plus' : 'pro'
      })
      return
    }

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

      // Build FormData for API route (handles large files)
      const formData = new FormData()
      formData.append('headline', headline)
      formData.append('prompt', prompt)
      formData.append('language', language)
      formData.append('size', size)
      formData.append('aspectRatio', aspectRatio)
      formData.append('style', style)
      formData.append('searchContext', searchContext)

      // Append reference image files (if any)
      referenceImageFiles.forEach((file, index) => {
        formData.append(`referenceImage${index}`, file)
      })

      // Call API route instead of Server Action
      const response = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        body: formData, // Multipart upload - no size limit issues
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Generation failed')
      }

      const { imageUrl } = await response.json()

      // Upload to ImageKit from client
      if (!user?.id) {
        throw new Error('User not authenticated')
      }

      const { url: imagekitUrl, fileId: imagekitFileId } = await uploadToImageKitClient(
        imageUrl,
        `thumbnail-${Date.now()}.png`,
        user.id
      )

      // Display ImageKit URL
      setResult({
        imageUrl: imagekitUrl,
        searchContext,
        groundingLinks,
        aspectRatio
      })

      // Save metadata to database (tiny payload ~1KB)
      await saveThumbnail({
        imagekitUrl,
        imagekitFileId,
        headline,
        prompt,
        language,
        size,
        aspectRatio,
        style,
        searchContext,
        groundingLinks,
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

    const remainingSlots = 3 - referenceImageFiles.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    filesToProcess.forEach(file => {
      // Store the File object (lightweight reference)
      setReferenceImageFiles(prev => [...prev, file])

      // Create preview URL for display (lightweight)
      const previewUrl = URL.createObjectURL(file)
      setReferenceImagePreviews(prev => [...prev, previewUrl])
    })

    // Reset input
    e.target.value = ''
  }

  // Handler: Remove Image
  const removeImage = (index: number) => {
    // Revoke object URL to free memory
    URL.revokeObjectURL(referenceImagePreviews[index])

    // Remove from both arrays
    setReferenceImageFiles(prev => prev.filter((_, i) => i !== index))
    setReferenceImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header with Home and Gallery buttons */}
      <div className="absolute top-6 left-0 right-0 z-50 flex items-center justify-between px-6">
        {/* Home Button - Left */}
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full transition-all group shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Home className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium text-white">Home</span>
        </Link>

        {/* View Gallery Button - Center */}
        <Link
          href="/gallery"
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-violet-600 hover:from-orange-600 hover:to-violet-700 rounded-full transition-all group shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Images className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium text-white">View Gallery</span>
        </Link>

        {/* Empty div for flex spacing */}
        <div className="w-[140px]"></div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-24 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        {/* Left Panel: Controls */}
        <div className={isPanelExpanded ? 'lg:col-span-4' : 'lg:col-span-1'}>
          <ControlPanel
            monthlyCount={monthlyCount}
            userPlan={userPlan}
            isLocked={isLocked}
            onLockedClick={handleLockedClick}
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
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            referenceImages={referenceImagePreviews}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            handleEnhance={handleEnhance}
            handleSubmit={handleSubmit}
            enhancing={enhancing}
            loading={loading}
            error={error}
            isPanelExpanded={isPanelExpanded}
            onTogglePanel={() => setIsPanelExpanded(!isPanelExpanded)}
          />
        </div>

        {/* Right Panel: Results */}
        <div className={isPanelExpanded ? 'lg:col-span-8' : 'lg:col-span-11'}>
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

      {/* Upgrade Modal */}
      <UpgradeModal
        open={upgradeModal.open}
        onClose={() => setUpgradeModal({ ...upgradeModal, open: false })}
        feature={upgradeModal.feature}
        currentPlan={userPlan}
        requiredPlan={upgradeModal.requiredPlan}
      />
    </div>
  )
}
