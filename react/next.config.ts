import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    bundlePagesRouterDependencies: true,

    //devIndicators: false,

    poweredByHeader: false,
    allowedDevOrigins: ["localhost"],
};

export default nextConfig;
