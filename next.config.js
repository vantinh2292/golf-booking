/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public'
    // disable: process.env.NODE_ENV === 'development',
    // register: true,
    // scope: '/app',
    // sw: 'service-worker.js',
    //...
})
const nextConfig = {
    // experimental: {
    //     appDir: true,
    // },
    images: {
        domains: ['firebasestorage.googleapis.com'], // Add your domain(s) here
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
        unoptimized: true,
    }
    // trailingSlash: true
    // output: "standalone",
    // webpack: (config, options) => {
    //     config.resolve.modules.push(options.cwd + '/node_modules');
    //     return config;
    //   },
}

module.exports = withPWA(nextConfig)
