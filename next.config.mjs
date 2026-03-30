import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
<<<<<<< HEAD
  },
};

export default withNextIntl(nextConfig);
=======
  },
  experimental: {
    typedRoutes: true,
  },
};

export default withNextIntl(nextConfig);
>>>>>>> 788516360d1fd0481af5e2906da5afbab28c3126
