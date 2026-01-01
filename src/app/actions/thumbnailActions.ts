'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { users, thumbnails } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { uploadThumbnail } from '@/services/imagekitService'
import type { IndianLanguage, ImageSize, AspectRatio, ThumbnailStyle } from '@/types/thumbnail'

interface SaveThumbnailParams {
  imageUrl: string // base64 data URL from Gemini
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

    // 2. Upload image to ImageKit
    const filename = `thumbnail-${Date.now()}.png`
    const imagekitResult = await uploadThumbnail(params.imageUrl, filename, userId)

    // 3. Save thumbnail metadata to database
    const [thumbnail] = await db
      .insert(thumbnails)
      .values({
        userId: dbUser.id,
        imagekitUrl: imagekitResult.url,
        imagekitFileId: imagekitResult.fileId,
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
        imageUrl: imagekitResult.url,
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
