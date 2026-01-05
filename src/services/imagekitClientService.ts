/**
 * Client-side ImageKit upload utility
 * Uploads images directly from the browser to ImageKit, bypassing Server Actions
 */

interface ImageKitAuthParams {
  signature: string
  token: string
  expire: number
}

interface UploadResult {
  url: string
  fileId: string
  name: string
  thumbnailUrl: string
}

/**
 * Convert base64 data URL to Blob
 */
function base64ToBlob(base64DataUrl: string): Blob {
  const parts = base64DataUrl.split(',')
  const mimeMatch = parts[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/png'
  const base64 = parts[1]

  const byteCharacters = atob(base64)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512)
    const byteNumbers = new Array(slice.length)

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  return new Blob(byteArrays, { type: mime })
}

/**
 * Upload base64 image directly to ImageKit from client
 */
export async function uploadToImageKitClient(
  base64DataUrl: string,
  filename: string,
  userId: string
): Promise<UploadResult> {
  try {
    // 1. Get authentication parameters from our API
    const authResponse = await fetch('/api/imagekit-auth')
    if (!authResponse.ok) {
      throw new Error('Failed to get authentication parameters')
    }

    const authParams: ImageKitAuthParams = await authResponse.json()

    // 2. Convert base64 to Blob
    const blob = base64ToBlob(base64DataUrl)

    // 3. Prepare FormData for ImageKit upload
    const formData = new FormData()
    formData.append('file', blob, filename)
    formData.append('fileName', filename)
    formData.append('folder', `/thumbnails/${userId}`)
    formData.append('signature', authParams.signature)
    formData.append('token', authParams.token)
    formData.append('expire', authParams.expire.toString())
    formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!)
    formData.append('useUniqueFileName', 'true')
    formData.append('tags', 'thumbnail,ai-generated')

    // 4. Upload directly to ImageKit
    const uploadResponse = await fetch(
      'https://upload.imagekit.io/api/v1/files/upload',
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('ImageKit upload error:', errorText)
      throw new Error('Failed to upload to ImageKit')
    }

    // Safely parse JSON response with error handling
    let result
    try {
      const contentType = uploadResponse.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        result = await uploadResponse.json()
      } else {
        const text = await uploadResponse.text()
        console.error('ImageKit returned non-JSON response:', text)
        throw new Error('ImageKit returned invalid response format')
      }
    } catch (error) {
      console.error('Failed to parse ImageKit response:', error)
      throw new Error('Failed to process ImageKit upload response')
    }

    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name,
      thumbnailUrl: result.thumbnailUrl || result.url,
    }
  } catch (error) {
    console.error('Client upload error:', error)
    throw error
  }
}
