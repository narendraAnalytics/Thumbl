"use client"

import * as React from "react"
import { Volume2, VolumeX } from "lucide-react"

export function HeroSection() {
  const [isMuted, setIsMuted] = React.useState(true)
  const [showTooltip, setShowTooltip] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
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
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-transparent" />

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
    </section>
  )
}
