"use client"

import { SignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()

  const handleClose = () => {
    router.back()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="fixed top-6 right-6 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm shadow-lg transition-all duration-200 hover:scale-110"
        aria-label="Close"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      {/* Existing Clerk SignUp Component */}
      <SignUp />
    </div>
  )
}
