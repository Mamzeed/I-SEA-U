/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false, // หรือ true ถ้าต้องการ redirect แบบถาวร
      },
    ];
  },
};

export default nextConfig;
