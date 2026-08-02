/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root so Next doesn't pick up an unrelated lockfile in a
  // parent directory when tracing build output.
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
