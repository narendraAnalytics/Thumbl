'use server'

import { auth } from '@clerk/nextjs/server'
import { type PlanTier, PLAN_LIMITS } from './planUtils'

export async function getCurrentPlan(): Promise<PlanTier> {
  const { has } = await auth()

  // Check against Clerk plan names (case-sensitive)
  if (has({ plan: 'pro' })) return 'pro'
  if (has({ plan: 'plus' })) return 'plus'
  // Free plan or no subscription defaults to 'free'
  return 'free'
}

export async function checkPlanAccess(feature: string, value: string): Promise<{
  allowed: boolean
  currentPlan: PlanTier
  requiredPlan?: PlanTier
}> {
  const currentPlan = await getCurrentPlan()
  const limits = PLAN_LIMITS[currentPlan]

  let allowed = true
  let requiredPlan: PlanTier | undefined

  switch (feature) {
    case 'quality':
      allowed = limits.qualities.includes(value)
      if (!allowed) requiredPlan = 'plus'
      break
    case 'style':
      allowed = limits.styles.includes(value)
      if (!allowed) requiredPlan = 'plus'
      break
    case 'platform':
      allowed = limits.platforms.includes(value)
      if (!allowed) requiredPlan = 'plus'
      break
    case 'referenceImages':
      allowed = parseInt(value) <= limits.referenceImages
      if (!allowed) requiredPlan = limits.referenceImages < 3 ? 'plus' : 'pro'
      break
  }

  return { allowed, currentPlan, requiredPlan }
}

export async function checkMonthlyLimit(currentCount: number): Promise<{
  allowed: boolean
  limit: number
  remaining: number
  currentPlan: PlanTier
}> {
  const currentPlan = await getCurrentPlan()
  const limit = PLAN_LIMITS[currentPlan].monthlyImages
  const remaining = Math.max(0, limit - currentCount)
  const allowed = currentCount < limit

  return { allowed, limit, remaining, currentPlan }
}
