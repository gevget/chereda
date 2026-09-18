import {defineConfig,devices} from 'playwright/test';
import {existsSync} from 'node:fs';
const localChrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
export default defineConfig({testDir:'./tests/e2e',timeout:30000,expect:{timeout:8000},use:{baseURL:'http://127.0.0.1:3000',...devices['Desktop Chrome'],launchOptions:existsSync(localChrome)?{executablePath:localChrome}:undefined},reporter:'list',webServer:{command:'pnpm dev',url:'http://127.0.0.1:3000',reuseExistingServer:true,timeout:120000}});
