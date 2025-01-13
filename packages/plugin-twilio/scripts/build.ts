import { build } from 'esbuild';
import { glob } from 'glob';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function buildPlugin() {
    console.log('🔍 Finding source files...');
    const entryPoints = await glob('src/**/*.ts', {
        cwd: dirname(__dirname),
        absolute: true,
    });
    console.log(`📁 Found ${entryPoints.length} files to build`);

    try {
        console.log('🚀 Starting build...');
        await build({
            entryPoints,
            outdir: 'dist',
            platform: 'node',
            format: 'esm',
            target: 'node18',
            bundle: true,
            sourcemap: true,
            external: [
                '@elizaos/core',
                'twilio',
                'express',
                '@anthropic-ai/sdk',
                'uuid'
            ],
            logLevel: 'info',
            mainFields: ['module', 'main'],
            banner: {
                js: '// @ts-check\n'
            },
            outExtension: { '.js': '.js' }
        });

        console.log('✅ Build completed successfully');
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

buildPlugin().catch(err => {
    console.error('❌ Unhandled error:', err);
    process.exit(1);
});