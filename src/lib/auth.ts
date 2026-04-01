import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mokhtar@themok.company';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!ADMIN_PASSWORD_HASH) {
  console.warn(
    'ADMIN_PASSWORD_HASH is not set. Admin login will not work until a bcrypt hash is configured.'
  );
}

const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        if (email !== ADMIN_EMAIL) {
          throw new Error('Invalid email or password');
        }

        if (!ADMIN_PASSWORD_HASH) {
          throw new Error('Admin authentication is not configured');
        }

        const match = await compare(password, ADMIN_PASSWORD_HASH);
        if (!match) {
          throw new Error('Invalid email or password');
        }

        return { id: '1', email: ADMIN_EMAIL, name: 'Admin' };
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

export const { handlers, auth } = NextAuth(authConfig);
export const authOptions = authConfig;
