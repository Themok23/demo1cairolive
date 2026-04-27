import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { auth } from '@/src/lib/auth';

export async function POST(request: Request) {
  /* Require valid admin session */
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    /* Validate MIME type */
    const acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!acceptedMimeTypes.includes(file.type)) {
      return Response.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    /* Max 5 MB */
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return Response.json(
        { error: 'File size exceeds 5 MB limit' },
        { status: 400 }
      );
    }

    /* Derive extension from validated MIME — never trust user filename */
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
    };
    const ext = mimeToExt[file.type] || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${ext}`;

    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    await writeFile(join(uploadsDir, filename), Buffer.from(bytes));

    return Response.json({ url: `/uploads/${filename}`, success: true });
  } catch {

    return Response.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
