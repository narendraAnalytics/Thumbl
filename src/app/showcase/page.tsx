import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function ShowcasePage() {
  // Static showcase images data
  const showcaseImages = [
    {
      src: '/gallery/reporterbannerimage.png',
      title: 'News Report Thumbnail',
      language: 'Tamil',
      category: 'News & Media'
    },
    {
      src: '/gallery/reviewfilm.png',
      title: 'Film Review Thumbnail',
      language: 'Kannada',
      category: 'Entertainment'
    },
    {
      src: '/gallery/cricketAnalyst.png',
      title: 'Cricket Analysis Thumbnail',
      language: 'English',
      category: 'Sports'
    },
    {
      src: '/gallery/yoga.png',
      title: 'Yoga & Fitness Thumbnail',
      language: 'Hindi',
      category: 'Health & Fitness'
    },
    {
      src: '/gallery/linkediNpoat.png',
      title: 'LinkedIn Post Thumbnail',
      language: 'English',
      category: 'Social Media'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header with Back Button */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-violet-600 hover:from-orange-600 hover:to-violet-700 rounded-full transition-all group shadow-lg hover:shadow-xl hover:scale-105"
        >
          <ArrowLeft className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
          <span className="text-sm font-medium text-white">Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-violet-500 bg-clip-text text-transparent">
            Showcase Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover stunning AI-generated thumbnails in multiple languages
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {showcaseImages.map((image, index) => (
            <div
              key={index}
              className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-white"
            >
              {/* Image Container */}
              <div className="aspect-video relative bg-gray-100">
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index < 2}
                />

                {/* Language Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-full uppercase tracking-wide shadow-lg">
                  {image.language}
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {image.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {image.category}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-violet-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Ready to create your own?
              </h2>
            </div>
            <p className="text-gray-600 mb-8">
              Join thousands of creators making stunning thumbnails with AI
            </p>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-violet-600 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
