"use client"

import * as React from "react"
import { Volume2, VolumeX } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface PromoVideoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PromoVideoModal({ open, onOpenChange }: PromoVideoModalProps) {
  const [isMuted, setIsMuted] = React.useState(true)
  const [skipCountdown, setSkipCountdown] = React.useState(3)
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Countdown timer logic
  React.useEffect(() => {
    if (!open) {
      // Reset countdown when modal closes
      setSkipCountdown(3)
      return
    }

    if (skipCountdown > 0) {
      const timer = setInterval(() => {
        setSkipCountdown((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [open, skipCountdown])

  // Toggle sound function
  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Handle skip button click
  const handleSkip = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl sm:max-w-4xl p-0 gap-0 bg-black overflow-hidden"
        showCloseButton={true}
      >
        {/* Visually hidden title for screen readers */}
        <DialogTitle className="sr-only">Promotional Video</DialogTitle>

        {/* Video Container */}
        <div className="relative w-full aspect-video bg-black">
          {/* Video Element */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={(e) => console.error('Promo video error:', e)}
            onLoadedData={() => console.log('Promo video loaded successfully')}
          >
            <source src="/video/ThumblVideo.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Sound Toggle Button (Bottom-Left) */}
          <button
            onClick={toggleSound}
            className="absolute left-4 bottom-4 z-10 flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-violet-600 px-4 py-2 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:brightness-110"
            aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
            <span className="text-sm font-medium">
              {isMuted ? "Unmute" : "Mute"}
            </span>
          </button>

          {/* Skip Button with Countdown (Bottom-Right) */}
          <button
            onClick={handleSkip}
            disabled={skipCountdown > 0}
            className={`absolute right-4 bottom-4 z-10 rounded-full px-4 py-2 text-sm font-medium shadow-lg transition-all ${
              skipCountdown > 0
                ? 'bg-white/20 text-white/60 cursor-not-allowed'
                : 'bg-white text-slate-900 hover:scale-105 hover:shadow-xl hover:brightness-110'
            }`}
            aria-label={skipCountdown > 0 ? `Skip in ${skipCountdown} seconds` : "Skip video"}
          >
            {skipCountdown > 0 ? `Skip in ${skipCountdown}s...` : "Skip"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
