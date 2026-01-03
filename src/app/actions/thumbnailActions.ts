'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users, thumbnails } from '@/db/schema'
import { eq, gte, and, count } from 'drizzle-orm'
import type { IndianLanguage, ImageSize, AspectRatio, ThumbnailStyle } from '@/types/thumbnail'
import { getCurrentPlan } from '@/lib/planUtilsServer'

interface SaveThumbnailParams {
  imagekitUrl: string // ImageKit URL (uploaded from client)
  imagekitFileId: string // ImageKit file ID
  headline: string
  prompt: string
  language: IndianLanguage
  size: ImageSize
  aspectRatio: AspectRatio
  style: ThumbnailStyle
  searchContext?: string
  groundingLinks?: { title: string; uri: string }[]
}

export async function saveThumbnail(params: SaveThumbnailParams) {
  const { isAuthenticated, userId } = await auth()
  if (!isAuthenticated || !userId) {
    throw new Error('User not authenticated')
  }

  try {
    // 1. Find or create user in database
    let dbUser = await db.query.users.findFirst({
      where: eq(users.clerkUserId, userId),
    })

    if (!dbUser) {
      const [newUser] = await db
        .insert(users)
        .values({ clerkUserId: userId })
        .returning()
      dbUser = newUser
    }

    // 2. Save thumbnail metadata to database (image already uploaded from client)
    const [thumbnail] = await db
      .insert(thumbnails)
      .values({
        userId: dbUser.id,
        imagekitUrl: params.imagekitUrl,
        imagekitFileId: params.imagekitFileId,
        headline: params.headline || null,
        prompt: params.prompt,
        language: params.language,
        size: params.size,
        aspectRatio: params.aspectRatio,
        style: params.style,
        searchContext: params.searchContext || null,
        groundingLinks: params.groundingLinks || null,
      })
      .returning()

    return {
      success: true,
      thumbnail: {
        id: thumbnail.id,
        imageUrl: params.imagekitUrl,
        createdAt: thumbnail.createdAt,
      },
    }
  } catch (error) {
    console.error('Save thumbnail error:', error)
    throw new Error('Failed to save thumbnail')
  }
}

export async function getUserThumbnails() {
  const { isAuthenticated, userId } = await auth()
  if (!isAuthenticated || !userId) {
    throw new Error('User not authenticated')
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkUserId, userId),
  })

  if (!dbUser) {
    return []
  }

  const userThumbnails = await db.query.thumbnails.findMany({
    where: eq(thumbnails.userId, dbUser.id),
    orderBy: (thumbnails, { desc }) => [desc(thumbnails.createdAt)],
  })

  return userThumbnails
}

export async function getMonthlyImageCount() {
  const { isAuthenticated, userId } = await auth()
  if (!isAuthenticated || !userId) {
    throw new Error('User not authenticated')
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.clerkUserId, userId),
  })

  if (!dbUser) {
    return 0
  }

  // Calculate start of current month (UTC)
  const now = new Date()
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))

  // Query thumbnails created this month
  const result = await db
    .select({ count: count() })
    .from(thumbnails)
    .where(
      and(
        eq(thumbnails.userId, dbUser.id),
        gte(thumbnails.createdAt, startOfMonth)
      )
    )

  return result[0]?.count || 0
}

export async function getUserPlanInfo() {
  const { isAuthenticated } = await auth()
  if (!isAuthenticated) {
    return { plan: 'free' as const, monthlyCount: 0 }
  }

  const monthlyCount = await getMonthlyImageCount()
  const plan = await getCurrentPlan()

  return { plan, monthlyCount }
}
