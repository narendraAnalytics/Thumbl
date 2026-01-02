'use client'

import Image from 'next/image'
import { Download, Calendar } from 'lucide-react'

interface Thumbnail {
  id: string
  imagekitUrl: string
  headline: string | null
  prompt: string
  language: string
  aspectRatio: string
  style: string
  createdAt: Date
}

export default function ThumbnailGrid({ thumbnails }: { thumbnails: Thumbnail[] }) {
  const downloadImage = async (url: string, filename: string) => {
    try {
      // Fetch the image as a blob
      const response = await fetch(url)
      const blob = await response.blob()

      // Create object URL from blob
      const blobUrl = URL.createObjectURL(blob)

      // Create and click download link
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      link.click()

      // Clean up object URL
      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Download failed:', error)
      // Fallback: open in new tab if download fails
      window.open(url, '_blank')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {thumbnails.map((thumbnail) => (
        <div
          key={thumbnail.id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-200/40 hover:shadow-2xl transition-all hover:scale-[1.02]"
        >
          {/* Image */}
          <div className="relative aspect-video bg-slate-100">
            <img
              src={thumbnail.imagekitUrl}
              alt={thumbnail.headline || thumbnail.prompt}
              className="w-full h-full object-cover"
            />
            {/* Aspect Ratio Badge */}
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs font-bold rounded">
              {thumbnail.aspectRatio}
            </div>
          </div>

          {/* Metadata */}
          <div className="p-4">
            <h3 className="font-bold text-slate-800 mb-1 line-clamp-1">
              {thumbnail.headline || 'No Headline'}
            </h3>
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {thumbnail.prompt}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(thumbnail.createdAt).toLocaleDateString()}
              </span>
              <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded font-semibold">
                {thumbnail.language}
              </span>
            </div>

            {/* Download Button */}
            <button
              onClick={() =>
                downloadImage(
                  thumbnail.imagekitUrl,
                  `thumbnail-${thumbnail.id}.png`
                )
              }
              className="w-full py-2 px-4 bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold rounded-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
