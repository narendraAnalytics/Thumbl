"use client"

import * as React from "react"
import { Volume2, VolumeX } from "lucide-react"

export function HeroSection() {
  const [isMuted, setIsMuted] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <section className="relative -mt-16 min-h-screen overflow-hidden pt-16">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src="/video/video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-transparent" />

      {/* Sound Toggle Button */}
      <button
        onClick={toggleSound}
        className="absolute right-4 top-20 z-20 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-md transition-all hover:bg-white/20 md:right-8 md:top-24"
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
