import {defineConfig,devices} from 'playwright/test';
import {existsSync} from 'node:fs';
const localChrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const baseURL=process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:3000';
export default defineConfig({testDir:'./tests/e2e',timeout:30000,expect:{timeout:8000},use:{baseURL,...devices['Desktop Chrome'],launchOptions:existsSync(localChrome)?{executablePath:localChrome}:undefined},reporter:'list',webServer:{command:'pnpm dev',url:baseURL,reuseExistingServer:true,timeout:120000}});
