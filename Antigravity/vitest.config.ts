import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    plugins: [],
    esbuild: {
        jsxInject: `import React from 'react'`,
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        exclude: ['**/node_modules/**', '**/dist/**', 'tests/e2e/**', 'tests/login.spec.ts'],
        alias: {
            '@': path.resolve(__dirname, './'),
        },
        hookTimeout: 30000,
        testTimeout: 30000,
    },
});
