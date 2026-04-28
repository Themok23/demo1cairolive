import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { NextRequest } from 'next/server';

const ipHits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_UPLOADS = 5;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);
  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_UPLOADS) return false;
  entry.count += 1;
  return true;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  if (!checkRate(ip)) {
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

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return Response.json(
        { error: 'Only JPG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return Response.json(
        { error: 'File size must be under 5 MB.' },
        { status: 400 }
      );
    }

    const ext = MIME_TO_EXT[file.type] ?? 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;

    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'pub');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    await writeFile(join(uploadsDir, filename), Buffer.from(bytes));

    return Response.json({ url: `/uploads/pub/${filename}`, success: true });
  } catch {
    return Response.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
