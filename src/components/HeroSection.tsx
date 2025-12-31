"use client"

import * as React from "react"
import { Volume2, VolumeX, MonitorPlay } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [isMuted, setIsMuted] = React.useState(true)
  const [showTooltip, setShowTooltip] = React.useState(true)
  const [showGalleryButton, setShowGalleryButton] = React.useState(false)
  const [isRotating, setIsRotating] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleMonitorPlayClick = () => {
    // Trigger rotation
    setIsRotating(true)

    // Toggle gallery button (on/off)
    setShowGalleryButton(prev => !prev)

    // Reset rotation after animation completes
    setTimeout(() => {
      setIsRotating(false)
    }, 600) // Match rotation duration
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative -mt-16 min-h-screen overflow-hidden pt-16">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        onError={(e) => console.error('Video error:', e)}
        onLoadedData={() => console.log('Video loaded successfully')}
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
      >
        <source src="/video/video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-black/30 via-black/20 to-transparent" />

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute right-4 bottom-16 z-20 animate-fade-in md:right-8 md:bottom-20">
          <div className="rounded-lg bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 px-4 py-2 shadow-lg">
            <p className="text-sm font-medium text-white">
              Click to turn sound on
            </p>
          </div>
        </div>
      )}

      {/* Sound Toggle Button */}
      <button
        onClick={toggleSound}
        className="absolute right-4 bottom-8 z-20 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-violet-600 px-4 py-2 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:brightness-110 md:right-8 md:bottom-12"
        aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" />
        ) : (
          <Volume2 className="h-5 w-5" />
        )}
        <span className="text-sm font-medium">
          Sound {isMuted ? "Off" : "On"}
        </span>
      </button>

      {/* Welcome Button - Bottom Left (Only for Logged In Users) */}
      {isLoaded && user && (
        <div className="absolute left-4 bottom-8 z-20 md:left-8 md:bottom-12 animate-fade-in">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 px-5 py-2.5 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:brightness-110 animate-pulse cursor-pointer"
          >
            <span className="text-sm font-semibold">
              Welcome {user.firstName || user.username || "User"}!
            </span>
          </button>
        </div>
      )}

      {/* MonitorPlay Icon - Bottom Center */}
      <div className="group absolute bottom-8 left-1/2 -translate-x-1/2 z-20 md:bottom-12">
        {/* View Gallery Button - Shows on Click */}
        {showGalleryButton && (
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 z-30 animate-fade-in">
            {/* View Gallery Button */}
            <button className="rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 px-6 py-2.5 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:brightness-110 whitespace-nowrap">
              View Gallery
            </button>

            {/* Arrow pointing down to icon */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <svg
                width="24"
                height="32"
                viewBox="0 0 24 32"
                fill="none"
                className="animate-bounce"
              >
                <defs>
                  <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#f472b6" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 0 L12 24 M12 24 L6 18 M12 24 L18 18"
                  stroke="url(#arrowGradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Hover Tooltip - Only show when gallery button is hidden */}
        {!showGalleryButton && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 scale-95 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 pointer-events-none">
            <div className="rounded-lg bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 px-3 py-1.5 shadow-lg whitespace-nowrap">
              <p className="text-xs font-semibold text-white">
                Click Here
              </p>
            </div>
          </div>
        )}

        {/* MonitorPlay Icon */}
        <MonitorPlay
          onClick={handleMonitorPlayClick}
          className={`h-12 w-12 stroke-cyan-400 cursor-pointer transition-all hover:scale-110 ${
            isRotating ? 'animate-spin' : ''
          }`}
          style={{
            filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.8)) drop-shadow(0 0 40px rgba(167, 139, 250, 0.6))',
            strokeWidth: 1.5
          }}
        />
      </div>
    </section>
  )
}
