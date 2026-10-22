import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Keep Next's built-in CSS pipeline in charge of Tailwind and CSS files. */
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
