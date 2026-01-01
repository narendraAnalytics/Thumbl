import { getUserThumbnails } from '@/app/actions/thumbnailActions'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ThumbnailGrid from '@/components/gallery/ThumbnailGrid'

export default async function GalleryPage() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) {
    redirect('/sign-in')
  }

  const thumbnails = await getUserThumbnails()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header with Back Button */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full transition-all group shadow-lg hover:shadow-xl hover:scale-105"
        >
          <ArrowLeft className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium text-white">Back to Dashboard</span>
        </Link>
      </div>

      {/* Gallery Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-violet-500 bg-clip-text text-transparent">
          Your Gallery
        </h1>
        <p className="text-slate-600 mb-8">
          {thumbnails.length > 0
            ? `${thumbnails.length} thumbnail${thumbnails.length === 1 ? '' : 's'} created`
            : 'No thumbnails yet'}
        </p>

        {thumbnails.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold text-slate-700 mb-2">No Thumbnails Yet</h2>
            <p className="text-slate-500 mb-6">Create your first thumbnail to see it here!</p>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-violet-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Create Thumbnail
            </Link>
          </div>
        ) : (
          <ThumbnailGrid thumbnails={thumbnails} />
        )}
      </main>
    </div>
  )
}
