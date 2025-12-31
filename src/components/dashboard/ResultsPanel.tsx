"use client"

import type { ThumbnailResult, AspectRatio, ImageSize } from "@/types/thumbnail"

interface ResultsPanelProps {
  result: ThumbnailResult | null
  loading: boolean
  size: ImageSize
  headline: string
  aspectRatio: AspectRatio
  language: string
}

export function ResultsPanel({
  result,
  loading,
  size,
  headline,
  aspectRatio,
  language,
}: ResultsPanelProps) {
  // Empty State
  if (!result && !loading) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center min-h-[600px]">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl rotate-3 flex items-center justify-center mb-6 border border-indigo-500/30">
          <svg className="w-10 h-10 text-indigo-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Creative Canvas</h3>
        <p className="text-slate-400 max-w-sm text-sm">
          Your AI-generated content will appear here
        </p>
      </div>
    )
  }

  // Loading State
  if (loading) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[600px]">
        <div className="relative">
          <div className="w-28 h-28 border-[5px] border-indigo-600/10 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-18 h-18 border-[5px] border-purple-600/10 border-t-purple-400 rounded-full animate-spin-reverse"></div>
          </div>
        </div>
        <div className="mt-10 space-y-3 text-center">
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            Generating Magic...
          </h3>
          <p className="text-slate-400 text-xs font-semibold max-w-xs mx-auto">
            {headline.trim() ? `"${headline.slice(0, 20)}${headline.length > 20 ? '...' : ''}"` : 'AI-Generating Headline'}
            <br />
            <span className="text-slate-500">{aspectRatio} • {language}</span>
          </p>
        </div>
        <style jsx>{`
          @keyframes spin-reverse {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          .animate-spin-reverse {
            animation: spin-reverse 2s linear infinite;
          }
        `}</style>
      </div>
    )
  }

  // Result Display
  if (!result) return null

  return (
    <div className="space-y-4">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header with Download */}
        <div className="p-3 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className={`px-2 py-0.5 text-[10px] font-black rounded text-white uppercase tracking-tighter ${
              result.aspectRatio === '16:9' ? 'bg-red-600' :
              result.aspectRatio === '3:4' ? 'bg-blue-600' : 'bg-pink-600'
            }`}>
              {result.aspectRatio}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Final Export ({size})
            </span>
          </div>
          <button
            onClick={() => {
              const link = document.createElement('a')
              link.href = result.imageUrl
              link.download = `thumbl-${result.aspectRatio.replace(':', '-')}-${Date.now()}.png`
              link.click()
            }}
            className="px-6 py-2.5 bg-white hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            DOWNLOAD IMAGE
          </button>
        </div>

        {/* Image Display */}
        <div className="p-6 flex justify-center bg-slate-950/50">
          <div className={`rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group transition-all ${
            result.aspectRatio === '16:9' ? 'w-full aspect-video' :
            result.aspectRatio === '3:4' ? 'w-2/3 aspect-[3/4]' : 'w-1/2 aspect-[9/16]'
          }`}>
            <img
              src={result.imageUrl}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              alt="Generated Thumbnail"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>

      {/* Topic Intelligence Section */}
      {(result.searchContext || (result.groundingLinks && result.groundingLinks.length > 0)) && (
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-2xl p-5 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Topic Intelligence
          </h3>

          {result.searchContext && (
            <div className="mb-6 text-slate-300 text-sm leading-relaxed p-5 bg-slate-800/40 rounded-2xl border border-slate-700/30 font-medium italic">
              "{result.searchContext}"
            </div>
          )}

          {result.groundingLinks && result.groundingLinks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.groundingLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.uri}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/10 transition-colors">
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-slate-400 group-hover:text-white truncate">
                    {link.title}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
