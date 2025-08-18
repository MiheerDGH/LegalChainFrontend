import type { NextConfig } from "next";
import type { Redirect } from "next/dist/lib/load-custom-routes";

const redirects: Redirect[] = [
  {
    source: "/",
    destination: "/login",
    permanent: false,
  },
];

const nextConfig: NextConfig = {
  async redirects() {
    return redirects;
  },
};

export default nextConfig;
