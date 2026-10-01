import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
    }

    const fileName = file.name.toLowerCase()
    const fileType = file.type.toLowerCase()

    // Validate image format - explicitly supports AVIF, WEBP, PNG, JPG/JPEG
    const isValidMime = ALLOWED_MIME_TYPES.includes(fileType)
    const isValidExt = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext))

    if (!isValidMime && !isValidExt) {
      return NextResponse.json(
        {
          error:
            'Invalid file format. Accepted image formats: JPG, PNG, WEBP, and AVIF.',
        },
        { status: 400 }
      )
    }

    // Validate maximum file size (5 MB)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 5 MB limit.`,
        },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    // Determine extension safely
    const extMatch = fileName.match(/\.(jpg|jpeg|png|webp|avif)$/i)
    const ext = extMatch
      ? extMatch[0].toLowerCase()
      : fileType === 'image/avif'
      ? '.avif'
      : fileType === 'image/webp'
      ? '.webp'
      : fileType === 'image/png'
      ? '.png'
      : '.jpg'

    const rawName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
    const safeBaseName = rawName || 'poster'
    const uniqueFilename = `${Date.now()}-${safeBaseName}${ext}`
    const filePath = path.join(uploadsDir, uniqueFilename)

    await fs.writeFile(filePath, buffer)

    const fileUrl = `/uploads/${uniqueFilename}`
    return NextResponse.json({ url: fileUrl, filename: file.name })
  } catch (error) {
    console.error('Poster upload failed:', error)
    return NextResponse.json(
      { error: 'Failed to process and save poster image upload.' },
      { status: 500 }
    )
  }
}
