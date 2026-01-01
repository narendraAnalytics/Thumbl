import ImageKit from 'imagekit'

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

export interface UploadResult {
  fileId: string
  url: string
  thumbnailUrl: string
  name: string
}

/**
 * Upload base64 image to ImageKit
 * @param base64Data - Base64 encoded image (without data:image/png;base64, prefix)
 * @param filename - Desired filename
 * @param userId - User ID for folder organization
 */
export async function uploadThumbnail(
  base64Data: string,
  filename: string,
  userId: string
): Promise<UploadResult> {
  try {
    // Remove data URL prefix if present
    const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, '')

    const response = await imagekit.upload({
      file: base64Clean,
      fileName: filename,
      folder: `/thumbnails/${userId}`, // Organize by user
      useUniqueFileName: true,
      tags: ['thumbnail', 'ai-generated'],
    })

    return {
      fileId: response.fileId,
      url: response.url,
      thumbnailUrl: response.thumbnailUrl || response.url,
      name: response.name,
    }
  } catch (error) {
    console.error('ImageKit upload error:', error)
    throw new Error('Failed to upload image to ImageKit')
  }
}

/**
 * Delete image from ImageKit
 */
export async function deleteThumbnail(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId)
  } catch (error) {
    console.error('ImageKit delete error:', error)
    throw new Error('Failed to delete image from ImageKit')
  }
}
