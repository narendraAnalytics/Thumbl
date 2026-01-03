"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Lock, Sparkles, Crown, X } from 'lucide-react'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  feature: string
  currentPlan: 'free' | 'plus' | 'pro'
  requiredPlan: 'plus' | 'pro'
}

export function UpgradeModal({ open, onClose, feature, currentPlan, requiredPlan }: UpgradeModalProps) {
  const isPro = requiredPlan === 'pro'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-purple-100">
            {isPro ? <Crown className="h-8 w-8 text-amber-600" /> : <Sparkles className="h-8 w-8 text-purple-600" />}
          </div>
          <DialogTitle className="text-center text-xl font-bold">
            Upgrade to {isPro ? 'Pro' : 'Plus'} Plan
          </DialogTitle>
          <DialogDescription className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              <Lock className="h-3 w-3" />
              {feature} requires {isPro ? 'Pro' : 'Plus'} plan
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
            <h4 className="mb-2 font-semibold text-indigo-900">
              {isPro ? '👑 Pro Plan Benefits:' : '⭐ Plus Plan Benefits:'}
            </h4>
            <ul className="space-y-1 text-sm text-indigo-700">
              {isPro ? (
                <>
                  <li>✨ Unlimited images per month</li>
                  <li>✨ Unlimited reference images</li>
                  <li>✨ All quality options (1K, 2K, 4K)</li>
                  <li>✨ All artistic styles</li>
                  <li>✨ All platform formats</li>
                </>
              ) : (
                <>
                  <li>✨ 5 images per month</li>
                  <li>✨ 3 reference images</li>
                  <li>✨ 4K quality option</li>
                  <li>✨ All artistic styles</li>
                  <li>✨ All platform formats</li>
                </>
              )}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/pricing" onClick={onClose}>
              <Button className="w-full bg-gradient-to-r from-orange-500 to-violet-600 hover:from-orange-600 hover:to-violet-700 text-white font-bold shadow-lg">
                View Pricing Plans
              </Button>
            </Link>
            <Button variant="outline" onClick={onClose} className="w-full">
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
