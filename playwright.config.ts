import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

const storageStatePath = process.env.CITYFLO_STORAGE_STATE;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL: process.env.CITYFLO_BASE_URL || 'https://app.cityflostaging.com',
    ...(storageStatePath && existsSync(storageStatePath) ? { storageState: storageStatePath } : {}),
    trace: 'retain-on-failure',
  },
});
