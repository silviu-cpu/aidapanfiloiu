import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75, 90],
  },
  // Tailwind 4 rulează direct prin Turbopack, fără PostCSS.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Același compilator Tailwind și pentru verificările făcute cu --webpack.
  webpack(config) {
    config.module.rules.push({
      test: /[\\/]app[\\/]globals\.css$/,
      use: ["@tailwindcss/turbopack"],
    });
    return config;
  },
};

export default nextConfig;
