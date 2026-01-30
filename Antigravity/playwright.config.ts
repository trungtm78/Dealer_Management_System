import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration - Optimized for Speed
 * Cấu hình tối ưu cho UAT nhanh hơn
 */
export default defineConfig({
    testDir: './tests',
    testMatch: '**/*.spec.ts',


    /* Timeout tối ưu cho tốc độ */
    timeout: 30000, // Tổng timeout cho mỗi test
    expect: {
        timeout: 5000, // Timeout cho assertions
    },

    /* Chạy song song để tăng tốc */
    fullyParallel: true,
    workers: 4, // Chạy 4 tests cùng lúc

    /* Retry khi fail */
    retries: 1, // Chỉ retry 1 lần

    /* Reporter */
    reporter: [
        ['list'], // Console output
        ['html', { open: 'never' }], // HTML report
    ],

    /* Cấu hình chung cho tất cả projects */
    use: {
        /* Base URL */
        baseURL: 'http://localhost:3000',

        /* Timeout tối ưu */
        actionTimeout: 5000, // Giảm từ 30s xuống 5s
        navigationTimeout: 10000, // Giảm từ 30s xuống 10s

        /* Screenshot chỉ khi fail */
        screenshot: 'only-on-failure',

        /* Video chỉ khi fail */
        video: 'retain-on-failure',

        /* Trace chỉ khi retry */
        trace: 'on-first-retry',
    },

    /* Cấu hình cho từng browser */
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                // Headless mode để chạy nhanh hơn
                headless: true,
                // Viewport cố định
                viewport: { width: 1280, height: 720 },
            },
        },

        // Uncomment để test trên Firefox/Safari
        // {
        //   name: 'firefox',
        //   use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //   name: 'webkit',
        //   use: { ...devices['Desktop Safari'] },
        // },
    ],

    /* Web Server - tự động start nếu chưa chạy */
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: true,
        timeout: 120000,
    },
});
