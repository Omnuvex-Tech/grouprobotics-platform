/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/ui"],
      images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "40011",
                pathname: "/uploads/**",
            },
        ],
    },
};

export default nextConfig;