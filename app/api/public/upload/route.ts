import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { NextRequest } from 'next/server';
import { checkRateLimit } from '@/src/lib/rateLimit';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

function detectMimeFromBytes(buf: Uint8Array): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47 &&
      buf[4] === 0x0D && buf[5] === 0x0A && buf[6] === 0x1A && buf[7] === 0x0A) return 'image/png';
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp';
  return null;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  if (!await checkRateLimit(`upload:${ip}`, 5, 15 * 60 * 1000)) {
    return Response.json(
      { error: 'Too many uploads. Try again in 15 minutes.' },
      { status: 429 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return Response.json(
        { error: 'File size must be under 5 MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buf = new Uint8Array(bytes);

    const detectedMime = detectMimeFromBytes(buf);
    if (!detectedMime || !ACCEPTED_TYPES.includes(detectedMime)) {
      return Response.json(
        { error: 'Only JPG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    const ext = MIME_TO_EXT[detectedMime];
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'pub');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    await writeFile(join(uploadsDir, filename), Buffer.from(buf));

    return Response.json({ url: `/uploads/pub/${filename}`, success: true });
  } catch {
    return Response.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
