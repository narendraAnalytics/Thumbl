"use client"

import { PLAN_COLORS, PLAN_ICONS, PLAN_NAMES } from '@/lib/planUtils'
import type { PlanTier } from '@/lib/planUtils'

interface PlanBadgeProps {
  plan: PlanTier
  className?: string
}

export function PlanBadge({ plan, className = '' }: PlanBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${PLAN_COLORS[plan]} text-white shadow-md ${className}`}>
      <span>{PLAN_ICONS[plan]}</span>
      <span>{PLAN_NAMES[plan]}</span>
    </div>
  )
}
