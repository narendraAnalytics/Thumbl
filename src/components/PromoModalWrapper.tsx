"use client"

import * as React from "react"
import { PromoVideoModal } from "@/components/PromoVideoModal"

export function PromoModalWrapper() {
  const [showPromoModal, setShowPromoModal] = React.useState(false)

  // Simplified: Always show modal (for development/testing)
  React.useEffect(() => {
    // Show modal after a short delay
    const timer = setTimeout(() => {
      setShowPromoModal(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Handle modal close
  const handleModalClose = (open: boolean) => {
    setShowPromoModal(open)
  }

  return <PromoVideoModal open={showPromoModal} onOpenChange={handleModalClose} />
}
