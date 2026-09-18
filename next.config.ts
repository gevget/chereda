import type { NextConfig } from 'next';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';
const nextConfig: NextConfig = {
  reactStrictMode:true,
  agentRules:false,
  output:isGitHubPages?'export':undefined,
  trailingSlash:true,
  images:{unoptimized:true},
  basePath:isGitHubPages?'/chereda':'',
};
export default nextConfig;
