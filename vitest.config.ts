import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: 'node',
        include: ['**/*.test.ts', '**/*.spec.ts'],
        exclude: ['**/node_modules/**', '**/dist/**'],
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.test.ts',
                '**/*.spec.ts',
                '**/*.d.ts'
            ]
        }
    },
    resolve: {
        alias: {
            '@': '/src',
            '@lib': '/lib',
            '@models': '/models',
            '@types': '/types',
            '@app': '/app'
        }
    }
});