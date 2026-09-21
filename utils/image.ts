export type CoverImageErrorReason = 'invalid-type' | 'too-large' | 'compression-failed'

export class CoverImageError extends Error {
  constructor(public readonly reason: CoverImageErrorReason) {
    super(reason)
    this.name = 'CoverImageError'
  }
}

export const ACCEPTED_COVER_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'] as const
export const MAX_ORIGINAL_FILE_SIZE_BYTES = 5 * 1024 * 1024
export const MAX_OUTPUT_WIDTH = 960
export const MAX_OUTPUT_HEIGHT = 640
export const MAX_OUTPUT_BASE64_BYTES = 350 * 1024

const QUALITY_STEPS = [0.8, 0.6, 0.4]
const DIMENSION_SCALE_STEPS = [1, 0.75, 0.5]

export function isAcceptedCoverImageType(file: File): boolean {
  return (ACCEPTED_COVER_IMAGE_TYPES as readonly string[]).includes(file.type)
}

export function isCoverImageWithinSizeLimit(file: File): boolean {
  return file.size <= MAX_ORIGINAL_FILE_SIZE_BYTES
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new CoverImageError('compression-failed'))
    image.src = src
  })
}

async function decodeImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file)
    } catch (error) {
      void error
    }
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    return await loadImageElement(objectUrl)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function getSourceDimensions(image: ImageBitmap | HTMLImageElement): { width: number; height: number } {
  if (image instanceof HTMLImageElement) {
    return { width: image.naturalWidth, height: image.naturalHeight }
  }
  return { width: image.width, height: image.height }
}

function computeOutputDimensions(
  sourceWidth: number,
  sourceHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const scale = Math.min(1, maxWidth / sourceWidth, maxHeight / sourceHeight)
  return {
    width: Math.max(1, Math.round(sourceWidth * scale)),
    height: Math.max(1, Math.round(sourceHeight * scale)),
  }
}

function drawToCanvas(
  image: ImageBitmap | HTMLImageElement,
  width: number,
  height: number,
  fillWhiteBackground: boolean,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) throw new CoverImageError('compression-failed')

  if (fillWhiteBackground) {
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
  }

  context.drawImage(image, 0, 0, width, height)
  return canvas
}

function estimateBase64Bytes(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
  return Math.ceil((base64.length * 3) / 4)
}

export async function processCoverImage(file: File): Promise<string> {
  if (!isAcceptedCoverImageType(file)) {
    throw new CoverImageError('invalid-type')
  }
  if (!isCoverImageWithinSizeLimit(file)) {
    throw new CoverImageError('too-large')
  }

  const image = await decodeImage(file)

  try {
    const { width: sourceWidth, height: sourceHeight } = getSourceDimensions(image)
    const fillWhiteBackground = file.type === 'image/png'

    for (const dimensionScale of DIMENSION_SCALE_STEPS) {
      const { width, height } = computeOutputDimensions(
        sourceWidth,
        sourceHeight,
        MAX_OUTPUT_WIDTH * dimensionScale,
        MAX_OUTPUT_HEIGHT * dimensionScale,
      )
      const canvas = drawToCanvas(image, width, height, fillWhiteBackground)

      for (const quality of QUALITY_STEPS) {
        const dataUrl = canvas.toDataURL('image/jpeg', quality)
        if (estimateBase64Bytes(dataUrl) <= MAX_OUTPUT_BASE64_BYTES) {
          return dataUrl
        }
      }
    }

    throw new CoverImageError('compression-failed')
  } finally {
    if (image instanceof ImageBitmap) {
      image.close()
    }
  }
}
