const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Cross-Origin-Opener-Policy",
                        value: "same-origin-allow-popups",
                    },
                    {
                        key: "Cross-Origin-Embedder-Policy",
                        value: "unsafe-none",
                    },
                ],
            },
        ];
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            "firebase/compat/auth$": path.resolve(__dirname, "node_modules/firebase/compat/auth/dist/esm/index.esm.js"),
            "@firebase/auth-compat$": path.resolve(__dirname, "node_modules/@firebase/auth-compat/dist/index.esm2017.js"),
            "@firebase/auth$": path.resolve(__dirname, "node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/index.js"),
            "@firebase/auth/internal$": path.resolve(__dirname, "node_modules/firebase/node_modules/@firebase/auth/dist/esm2017/internal.js"),
        };

        return config;
    },
};

module.exports = nextConfig
