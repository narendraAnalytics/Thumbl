"use client"

import { Zap, Rocket, Crown } from 'lucide-react'
import { PLAN_NAMES } from '@/lib/planUtils'
import type { PlanTier } from '@/lib/planUtils'

interface PlanBadgeProps {
  plan: PlanTier
  className?: string
}

const PLAN_ICON_COMPONENTS = {
  free: Zap,
  plus: Rocket,
  pro: Crown
}

const PLAN_STYLES = {
  free: {
    container: 'from-slate-400 to-slate-600',
    animation: 'animate-pulse-subtle',
    ring: 'ring-2 ring-slate-300/50',
    shadow: 'shadow-lg shadow-slate-400/30',
    iconBg: 'bg-white/20',
  },
  plus: {
    container: 'from-blue-500 via-purple-500 to-purple-600',
    animation: 'animate-pulse-glow',
    ring: 'ring-2 ring-blue-300/50',
    shadow: 'shadow-lg shadow-purple-500/40',
    iconBg: 'bg-white/20',
  },
  pro: {
    container: 'from-amber-400 via-orange-500 to-orange-600',
    animation: 'animate-shimmer',
    ring: 'ring-2 ring-amber-300/50',
    shadow: 'shadow-lg shadow-orange-500/50',
    iconBg: 'bg-white/20',
  }
}

export function PlanBadge({ plan, className = '' }: PlanBadgeProps) {
  const IconComponent = PLAN_ICON_COMPONENTS[plan]
  const styles = PLAN_STYLES[plan]

  return (
    <div className={`
      group relative inline-flex items-center gap-2
      px-4 py-2 rounded-full text-xs font-bold
      bg-gradient-to-r ${styles.container}
      text-white ${styles.ring} ${styles.shadow}
      transition-all duration-300 hover:scale-105
      ${className}
    `}>
      {/* Animated Icon Container */}
      <div className={`
        ${styles.iconBg} rounded-full p-1
        ${styles.animation}
        transition-transform group-hover:rotate-12
      `}>
        <IconComponent className="w-3.5 h-3.5" />
      </div>

      {/* Plan Name */}
      <span className="tracking-wide">{PLAN_NAMES[plan]}</span>

      {/* Shimmer Effect Overlay (Pro only) */}
      {plan === 'pro' && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slide opacity-0 group-hover:opacity-100" />
      )}
    </div>
  )
}
