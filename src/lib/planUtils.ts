export type PlanTier = 'free' | 'plus' | 'pro'

export interface PlanLimits {
  monthlyImages: number
  referenceImages: number
  qualities: string[]
  styles: string[]
  platforms: string[]
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  free: {
    monthlyImages: 1,
    referenceImages: 1,
    qualities: ['1K', '2K'],
    styles: ['Cinematic', 'Cartoon'],
    platforms: ['16:9'] // YouTube
  },
  plus: {
    monthlyImages: 5,
    referenceImages: 3,
    qualities: ['1K', '2K', '4K'],
    styles: ['Cinematic', 'Cartoon', 'Sketch', '3D Art', 'Minimalist'],
    platforms: ['16:9', '1:1', '4:5', '9:16']
  },
  pro: {
    monthlyImages: Infinity,
    referenceImages: Infinity,
    qualities: ['1K', '2K', '4K'],
    styles: ['Cinematic', 'Cartoon', 'Sketch', '3D Art', 'Minimalist'],
    platforms: ['16:9', '1:1', '4:5', '9:16']
  }
}

export const PLAN_COLORS = {
  free: 'from-slate-400 to-slate-600',
  plus: 'from-blue-500 to-purple-600',
  pro: 'from-amber-500 to-orange-600'
}

export const PLAN_ICONS = {
  free: '🆓',
  plus: '⭐',
  pro: '👑'
}

export const PLAN_NAMES = {
  free: 'Free',
  plus: 'Plus',
  pro: 'Pro'
}
