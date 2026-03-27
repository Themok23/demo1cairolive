import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return new Response('NextAuth route - Configure in app/api/auth/[...nextauth]/auth.ts', {
    status: 501,
  });
}

export async function POST(request: NextRequest) {
  return new Response('NextAuth route - Configure in app/api/auth/[...nextauth]/auth.ts', {
    status: 501,
  });
}
