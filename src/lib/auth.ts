import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import type { NextAuthConfig } from 'next-auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'mokhtar@themok.company';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

if (!ADMIN_PASSWORD && !ADMIN_PASSWORD_HASH) {
  throw new Error(
    'Either ADMIN_PASSWORD or ADMIN_PASSWORD_HASH must be set in environment variables'
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

        // Check against plaintext password first (for development)
        if (ADMIN_PASSWORD) {
          if (password === ADMIN_PASSWORD) {
            return {
              id: '1',
              email: ADMIN_EMAIL,
              name: 'Admin',
            };
          }
        }

        // Check against bcrypt hash
        if (ADMIN_PASSWORD_HASH) {
          const passwordMatch = await compare(
            password,
            ADMIN_PASSWORD_HASH
          );
          if (passwordMatch) {
            return {
              id: '1',
              email: ADMIN_EMAIL,
              name: 'Admin',
            };
          }
        }

        throw new Error('Invalid email or password');
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const { handlers, auth } = NextAuth(authConfig);
export const authOptions = authConfig;
