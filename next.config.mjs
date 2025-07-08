/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['ui-avatars.com','lh3.googleusercontent.com'],
    },
  };
  
  export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
};

export default nextConfig;
