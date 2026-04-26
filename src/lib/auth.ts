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

          console.log(
            `[auth] Auth attempt — password length: ${password.length}, ` +
              `hash configured: ${!!ADMIN_PASSWORD_HASH} (length ${ADMIN_PASSWORD_HASH?.length ?? 0}), ` +
              `plain configured: ${!!ADMIN_PASSWORD_PLAIN} (length ${ADMIN_PASSWORD_PLAIN?.length ?? 0})`
          );

          // Try bcrypt hash first.
          if (ADMIN_PASSWORD_HASH) {
            const match = await compare(password, ADMIN_PASSWORD_HASH);
            if (match) {
              console.log('[auth] Admin signed in via bcrypt hash');
              return { id: '1', email: ADMIN_EMAIL, name: 'Admin' };
            }
            console.warn('[auth] Bcrypt hash mismatch — falling back to plain compare if configured');
          }

          // Plain compare fallback (works in dev even when hash is also set).
          if (ADMIN_PASSWORD_PLAIN) {
            if (password === ADMIN_PASSWORD_PLAIN) {
              console.log('[auth] Admin signed in via plain ADMIN_PASSWORD');
              return { id: '1', email: ADMIN_EMAIL, name: 'Admin' };
            }
            // Trim & retry — defends against trailing whitespace in .env files.
            if (password.trim() === ADMIN_PASSWORD_PLAIN.trim()) {
              console.log('[auth] Admin signed in via plain ADMIN_PASSWORD (after trim)');
              return { id: '1', email: ADMIN_EMAIL, name: 'Admin' };
            }
            console.warn(
              `[auth] Plain mismatch — received "${password.slice(0, 3)}..." (len ${password.length}), expected "${ADMIN_PASSWORD_PLAIN.slice(0, 3)}..." (len ${ADMIN_PASSWORD_PLAIN.length})`
            );
            return null;
          }

          console.error('[auth] No password mechanism configured (no hash, no plain)');
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
