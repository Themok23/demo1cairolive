import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';

const authConfig = {
  providers: [
    // Add providers here (e.g., Google, GitHub, Email, etc.)
    // Example:
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
} satisfies NextAuthConfig;

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
