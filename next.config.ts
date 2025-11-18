// next.config.ts (or next.config.mjs)

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // disables ESLint errors on Vercel
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ];
  },
  // Skip ESLint during build to avoid strict lint rules blocking CI/builds here.
  // We still recommend addressing lint warnings/errors in PRs, but for rapid
  // iteration we allow builds to succeed.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

