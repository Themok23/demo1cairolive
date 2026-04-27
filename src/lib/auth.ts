import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mokhtar@themok.company';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
// Fallback for local dev when only the plain password is set in .env.local.
const ADMIN_PASSWORD_PLAIN = process.env.ADMIN_PASSWORD;
// NextAuth v5 prefers AUTH_SECRET; fall back to NEXTAUTH_SECRET (v4 name).
const AUTH_SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

if (!ADMIN_PASSWORD_HASH && !ADMIN_PASSWORD_PLAIN) {
  console.warn(
    '[auth] Neither ADMIN_PASSWORD_HASH nor ADMIN_PASSWORD is set. Admin login will not work.'
  );
}
if (!AUTH_SECRET) {
  console.warn(
    '[auth] No AUTH_SECRET / NEXTAUTH_SECRET set. Sessions will not be securely signed.'
  );
}

const authConfig: NextAuthConfig = {
  // NextAuth v5: provide secret explicitly so it doesn't depend on env naming.
  secret: AUTH_SECRET,
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // In NextAuth v5, returning null from authorize means "invalid credentials".
        // Throwing Error here surfaces as a generic "Configuration" error to the client,
        // which is unhelpful — so we log details server-side and return null.
        try {
          if (!credentials?.email || !credentials?.password) {
            console.warn('[auth] Missing email or password in credentials');
            return null;
          }

          const email = String(credentials.email);
          const password = String(credentials.password);

          if (email !== ADMIN_EMAIL) {
            console.warn(`[auth] Email mismatch. Got: ${email}, expected: ${ADMIN_EMAIL}`);
            return null;
          }

          // Try bcrypt hash first.
          if (ADMIN_PASSWORD_HASH) {
            const match = await compare(password, ADMIN_PASSWORD_HASH);
            if (match) {
              return { id: '1', email: ADMIN_EMAIL, name: 'Admin' };
            }
          }

          // Plaintext fallback — prefer ADMIN_PASSWORD_HASH in production.
          if (ADMIN_PASSWORD_PLAIN) {
            if (process.env.NODE_ENV === 'production') {
              console.warn('[auth] Plain password used in production — set ADMIN_PASSWORD_HASH instead');
            }
            if (password === ADMIN_PASSWORD_PLAIN || password.trim() === ADMIN_PASSWORD_PLAIN.trim()) {
              return { id: '1', email: ADMIN_EMAIL, name: 'Admin' };
            }
            console.warn('[auth] Password mismatch');
            return null;
          }

          console.warn('[auth] No password mechanism configured');
          return null;
        } catch (err) {
          console.error('[auth] Unexpected error in authorize:', err);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
export const authOptions = authConfig;
