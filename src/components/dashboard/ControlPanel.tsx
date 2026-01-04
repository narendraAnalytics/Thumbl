"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { IndianLanguage, ImageSize, AspectRatio, ThumbnailStyle } from "@/types/thumbnail"
import type { PlanTier } from "@/lib/planUtils"
import { PLAN_LIMITS } from "@/lib/planUtils"

const LANGUAGES: IndianLanguage[] = ['English', 'Telugu', 'Hindi', 'Tamil', 'Marathi', 'Kannada']
const SIZES: ImageSize[] = ['1K', '2K', '4K']
const STYLES: ThumbnailStyle[] = ['Cinematic', 'Cartoon', 'Sketch', '3D Art', 'Minimalist']

const PLATFORMS: { name: string; ratio: AspectRatio; icon: string }[] = [
  {
    name: 'YouTube',
    ratio: '16:9',
    icon: 'M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z'
  },
  {
    name: 'Instagram Square',
    ratio: '1:1',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
  },
  {
    name: 'LinkedIn',
    ratio: '4:5',
    icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'
  },
  {
    name: 'Instagram Reel',
    ratio: '9:16',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
  }
]

interface ControlPanelProps {
  monthlyCount: number
  userPlan: PlanTier
  isLocked: (feature: string, value: string) => boolean
  onLockedClick: (feature: string, requiredPlan: 'plus' | 'pro') => void
  headline: string
  setHeadline: (value: string) => void
  prompt: string
  setPrompt: (value: string) => void
  language: IndianLanguage
  setLanguage: (value: IndianLanguage) => void
  size: ImageSize
  setSize: (value: ImageSize) => void
  aspectRatio: AspectRatio
  setAspectRatio: (value: AspectRatio) => void
  style: ThumbnailStyle
  setStyle: (value: ThumbnailStyle) => void
  useSearch: boolean
  setUseSearch: (value: boolean) => void
  activeTab: 'setup' | 'content' | 'style'
  setActiveTab: (tab: 'setup' | 'content' | 'style') => void
  referenceImages: string[]
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
  handleEnhance: () => void
  handleSubmit: (e: React.FormEvent) => void
  enhancing: boolean
  loading: boolean
  error: string | null
  isPanelExpanded: boolean
  onTogglePanel: () => void
}

export function ControlPanel({
  monthlyCount,
  userPlan,
  isLocked,
  onLockedClick,
  headline,
  setHeadline,
  prompt,
  setPrompt,
  language,
  setLanguage,
  size,
  setSize,
  aspectRatio,
  setAspectRatio,
  style,
  setStyle,
  useSearch,
  setUseSearch,
  activeTab,
  setActiveTab,
  referenceImages,
  handleImageUpload,
  removeImage,
  handleEnhance,
  handleSubmit,
  enhancing,
  loading,
  error,
  isPanelExpanded,
  onTogglePanel,
}: ControlPanelProps) {

  // Check if monthly limit reached
  const monthlyLimit = PLAN_LIMITS[userPlan].monthlyImages
  const isLimitReached = monthlyCount >= monthlyLimit
  const nextPlan = userPlan === 'free' ? 'plus' : 'pro'

  // Form-level submission handler to prevent submission unless on Style tab
  const handleFormSubmit = (e: React.FormEvent) => {
    // Only allow submission when on Style tab
    if (activeTab !== 'style') {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    // Pass through to handleSubmit
    handleSubmit(e)
  }

  // Keyboard handler to prevent Enter key from submitting form in Textarea
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent Ctrl+Enter from submitting unless on Style tab
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && activeTab !== 'style') {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div className="bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 backdrop-blur-md border border-indigo-200/40 rounded-2xl p-5 shadow-2xl transition-all duration-300 ease-in-out">
      {!isPanelExpanded ? (
        // COLLAPSED STATE: Vertical layout with rotated text
        <div className="hidden lg:flex flex-col items-center justify-start gap-4 h-full py-4">
          {/* Vertical "Creator Studio" Text */}
          <div className="flex-1 flex items-center justify-center">
            <h2
              className="text-base font-bold whitespace-nowrap bg-gradient-to-r from-orange-400 to-violet-500 bg-clip-text text-transparent"
              style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
            >
              Creator Studio
            </h2>
          </div>

          {/* Expand Button */}
          <button
            type="button"
            onClick={onTogglePanel}
            aria-label="Show panel"
            title="Show panel"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-500/10 to-violet-600/10 hover:from-orange-500/20 hover:to-violet-600/20 border border-orange-500/30 transition-all hover:scale-110 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 text-orange-500" />
          </button>
        </div>
      ) : (
        // EXPANDED STATE: Normal horizontal header
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold flex items-center gap-2 bg-gradient-to-r from-orange-400 to-violet-500 bg-clip-text text-transparent">
              <span className="w-1 h-5 bg-gradient-to-b from-orange-500 to-violet-600 rounded-full"></span>
              Creator Studio
            </h2>
            {monthlyCount > 0 && (
              <p className="text-xs text-indigo-600 font-semibold">
                {monthlyCount} {monthlyCount === 1 ? 'image' : 'images'} this month
              </p>
            )}
          </div>

          {/* Collapse Button - Desktop Only */}
          <button
            type="button"
            onClick={onTogglePanel}
            aria-label="Hide panel"
            title="Hide panel"
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500/10 to-violet-600/10 hover:from-orange-500/20 hover:to-violet-600/20 border border-orange-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-orange-500" />
          </button>
        </div>
      )}

      {/* Content visible on mobile always, on desktop based on isPanelExpanded */}
      <div className={isPanelExpanded ? '' : 'lg:hidden'}>
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-slate-800/50 rounded-lg mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('setup')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'setup'
              ? 'bg-gradient-to-r from-orange-500 to-violet-600 text-white shadow-lg'
              : 'bg-gradient-to-r from-slate-100 to-indigo-100 text-orange-300 hover:text-orange-200 hover:from-slate-200 hover:to-indigo-200'
          }`}
        >
          Setup
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'content'
              ? 'bg-gradient-to-r from-orange-500 to-violet-600 text-white shadow-lg'
              : 'bg-gradient-to-r from-slate-100 to-indigo-100 text-orange-300 hover:text-orange-200 hover:from-slate-200 hover:to-indigo-200'
          }`}
        >
          Content
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'style'
              ? 'bg-gradient-to-r from-orange-500 to-violet-600 text-white shadow-lg'
              : 'bg-gradient-to-r from-slate-100 to-indigo-100 text-orange-300 hover:text-orange-200 hover:from-slate-200 hover:to-indigo-200'
          }`}
        >
          Style
        </button>
      </div>

      <form onSubmit={handleFormSubmit}>
        {/* Tab Content */}
        <div className="space-y-4">
          {/* Setup Tab */}
          {activeTab === 'setup' && (
            <>
              {/* Platform Selection */}
              <div>
                <label className="block text-xs font-semibold text-orange-400 mb-1.5">
                  Platform Format
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {PLATFORMS.map((p) => {
                    const locked = isLocked('platform', p.ratio)
                    return (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => {
                          if (locked) {
                            onLockedClick(`${p.name} format`, 'plus')
                          } else {
                            setAspectRatio(p.ratio)
                          }
                        }}
                        className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg text-[10px] font-bold border transition-all relative ${
                          aspectRatio === p.ratio && !locked
                            ? 'bg-gradient-to-br from-orange-500 to-violet-600 border-orange-400 text-white shadow-lg'
                            : locked
                            ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-pointer hover:border-slate-400'
                            : 'bg-gradient-to-br from-green-500 to-orange-500 border-green-400 text-white hover:border-green-500 hover:scale-105'
                        }`}
                      >
                        {locked && (
                          <div className="absolute top-1 right-1 bg-slate-700 rounded-full p-0.5">
                            <Lock className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d={p.icon} />
                        </svg>
                        <span className="leading-tight">{p.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Headline Language Selection */}
              <div>
                <label className="block text-xs font-semibold text-orange-400 mb-1.5">
                  Headline Language
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all ${
                        language === lang
                          ? 'bg-gradient-to-r from-orange-500 to-violet-600 border-orange-400 text-white shadow-lg'
                          : 'bg-gradient-to-r from-slate-100 to-purple-100 border-indigo-200 text-orange-300 hover:border-indigo-300 hover:text-orange-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resolution Selection */}
              <div>
                <Label className="text-xs font-semibold text-orange-400 mb-1.5 block">Quality</Label>
                <div className="flex gap-1.5">
                  {SIZES.map((s) => {
                    const locked = isLocked('quality', s)
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          if (locked) {
                            onLockedClick(`${s} quality`, 'plus')
                          } else {
                            setSize(s)
                          }
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all relative ${
                          size === s && !locked
                            ? 'bg-gradient-to-r from-orange-500 to-violet-600 border-orange-400 text-white shadow-lg'
                            : locked
                            ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-pointer hover:border-slate-400'
                            : 'bg-gradient-to-r from-slate-100 to-indigo-100 border-indigo-200 text-orange-300 hover:border-indigo-300 hover:text-orange-200'
                        }`}
                      >
                        {locked && (
                          <Lock className="absolute top-1 right-1 w-3 h-3 text-slate-600" />
                        )}
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <>
              {/* Headline Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <Label className="text-xs font-semibold text-orange-400">Headline (Optional)</Label>
                  <span className="text-[9px] text-violet-400 uppercase tracking-wider font-bold">
                    {language}
                  </span>
                </div>
                <Input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="AI will generate..."
                  className="bg-white border-indigo-200 text-orange-600 placeholder-orange-300/50 h-9 text-sm shadow-sm"
                />
              </div>

              {/* Visual Prompt Input */}
              <div className="relative">
                <div className="flex justify-between items-center mb-1.5">
                  <Label className="text-xs font-semibold text-orange-400">Scene Concept</Label>
                  <button
                    type="button"
                    onClick={handleEnhance}
                    disabled={enhancing || !prompt.trim()}
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                      enhancing
                        ? 'bg-slate-800/50 border-slate-700 text-orange-300/50'
                        : 'bg-orange-500/10 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 active:scale-95'
                    }`}
                  >
                    {enhancing ? (
                      <>
                        <div className="w-2 h-2 border border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                        Optimizing...
                      </>
                    ) : (
                      <>✨ Enhance</>
                    )}
                  </button>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="Describe the visual concept..."
                  className="bg-white border-indigo-200 text-orange-600 placeholder-orange-300/50 h-50 resize-none text-sm shadow-sm"
                />
              </div>

              {/* Search Grounding Toggle */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-indigo-200/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-orange-400">Web Search</div>
                    <div className="text-[8px] text-violet-400 uppercase font-bold tracking-wider">Smart Context</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUseSearch(!useSearch)}
                  aria-label={useSearch ? 'Disable web search' : 'Enable web search'}
                  title={useSearch ? 'Disable web search' : 'Enable web search'}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    useSearch ? 'bg-gradient-to-r from-orange-500 to-violet-600' : 'bg-slate-700'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                    useSearch ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </>
          )}

          {/* Style Tab */}
          {activeTab === 'style' && (
            <>
              {/* Creative Style Selection */}
              <div>
                <label className="block text-xs font-semibold text-orange-400 mb-1.5">
                  Artistic Style
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {STYLES.map((s) => {
                    const locked = isLocked('style', s)
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          if (locked) {
                            onLockedClick(`${s} style`, 'plus')
                          } else {
                            setStyle(s)
                          }
                        }}
                        className={`py-1 px-2.5 rounded-md text-[9px] font-black uppercase tracking-wider border transition-all relative ${
                          style === s && !locked
                            ? 'bg-gradient-to-r from-orange-500 to-violet-600 border-orange-400 text-white shadow-md'
                            : locked
                            ? 'bg-slate-100 border-slate-300 text-slate-400 cursor-pointer hover:border-slate-400'
                            : 'bg-gradient-to-r from-slate-100 to-purple-100 border-indigo-200 text-orange-300 hover:border-indigo-300 hover:text-orange-200'
                        }`}
                      >
                        {locked && (
                          <Lock className="absolute -top-1 -right-1 w-3 h-3 text-slate-600" />
                        )}
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Multiple Image Upload */}
              <div>
                <Label className="text-xs font-semibold text-orange-400 mb-1.5 block">
                  References (Max 3)
                </Label>
                <div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {referenceImages.map((img, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-700 shadow-md">
                        <img src={img} className="w-full h-full object-cover" alt={`Reference ${idx + 1}`} />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          aria-label={`Remove reference image ${idx + 1}`}
                          title={`Remove reference image ${idx + 1}`}
                          className="absolute top-0.5 right-0.5 bg-red-600 text-white p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {referenceImages.length < 3 && (
                      userPlan === 'free' && referenceImages.length >= 1 ? (
                        <button
                          type="button"
                          onClick={() => onLockedClick('Multiple reference images', 'plus')}
                          className="w-full h-full border-2 border-dashed border-slate-300 bg-slate-100/50 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer hover:border-slate-400"
                        >
                          <Lock className="w-4 h-4 text-slate-500 mb-1" />
                          <span className="text-[8px] text-slate-500 font-semibold">Plus Plan</span>
                        </button>
                      ) : (
                        <div className="relative aspect-square">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            aria-label="Upload reference images"
                            title="Upload reference images"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <div className="w-full h-full border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-800/30 rounded-lg flex items-center justify-center transition-all">
                            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Always Visible: Submit + Error */}
        <div className="mt-6 space-y-3">
          {/* Progressive Navigation Button */}
          {activeTab === 'setup' ? (
            // Setup Tab: Next Step → Content
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (isLimitReached) {
                  onLockedClick(`Monthly limit (${monthlyLimit} image${monthlyLimit === 1 ? '' : 's'})`, nextPlan)
                  return
                }
                setActiveTab('content')
              }}
              disabled={isLimitReached}
              className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-sm ${
                isLimitReached
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white drop-shadow-lg active:scale-95'
              }`}
            >
              <span>Next Step</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span>Content</span>
            </button>
          ) : activeTab === 'content' ? (
            // Content Tab: Next Step → Style
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (isLimitReached) {
                  onLockedClick(`Monthly limit (${monthlyLimit} image${monthlyLimit === 1 ? '' : 's'})`, nextPlan)
                  return
                }
                setActiveTab('style')
              }}
              disabled={!prompt || isLimitReached}
              className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-sm ${
                !prompt || isLimitReached
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white drop-shadow-lg active:scale-95'
              }`}
            >
              <span>Next Step</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span>Style</span>
            </button>
          ) : (
            // Style Tab: Generate (final submission)
            <button
              type="submit"
              onClick={(e) => {
                if (isLimitReached) {
                  e.preventDefault()
                  onLockedClick(`Monthly limit (${monthlyLimit} image${monthlyLimit === 1 ? '' : 's'})`, nextPlan)
                  return
                }
              }}
              disabled={loading || !prompt || isLimitReached}
              className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-sm ${
                loading || !prompt || isLimitReached
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white drop-shadow-lg active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate
                </>
              )}
            </button>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}
        </div>
      </form>
      </div>
    </div>
  )
}
