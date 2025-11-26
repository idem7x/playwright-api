import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 3 : 2,
    reporter: [
        ['html'],
        ['list'],
        ['json', { outputFile: 'test-results/results.json' }]
    ],
    use: {
        baseURL: 'https://gorest.co.in/public/v2'
    },
    projects: [
        {
            name: 'API Tests',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    timeout: 30000,
});
