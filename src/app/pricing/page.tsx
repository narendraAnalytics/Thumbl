import { PricingTable } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PricingPage() {
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

      {/* Pricing Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Choose Your Plan
              </span>
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Start creating stunning thumbnails today. Upgrade or downgrade anytime.
            </p>
          </div>

          {/* Clerk Pricing Table Component */}
          <div className="max-w-6xl mx-auto">
            <PricingTable />
          </div>
        </div>
      </section>
    </div>
  )
}
