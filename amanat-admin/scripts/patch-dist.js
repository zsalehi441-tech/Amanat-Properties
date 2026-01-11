/**
 * Post-build script to patch dist files for media-intake plugin.
 * 
 * This script fixes two issues with the build output:
 * 1. config/plugins.js points to src/ but should point to dist/src/plugins/media-intake
 * 2. The plugin's package.json references .ts files but should reference .js files
 * 
 * Run this script after `strapi build` to ensure the plugin loads correctly.
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');

// Patch 1: Update config/plugins.js to point to dist path
const pluginsConfigPath = path.join(distDir, 'config', 'plugins.js');
if (fs.existsSync(pluginsConfigPath)) {
    let content = fs.readFileSync(pluginsConfigPath, 'utf8');
    // Replace source path with dist path
    content = content.replace(
        /resolve:\s*['"]\.\/src\/plugins\/media-intake['"]/g,
        "resolve: './dist/src/plugins/media-intake'"
    );
    // Also handle commented out resolve
    content = content.replace(
        /\/\/\s*resolve:\s*['"]\.\/src\/plugins\/media-intake['"]/g,
        "resolve: './dist/src/plugins/media-intake'"
    );
    fs.writeFileSync(pluginsConfigPath, content);
    console.log('✓ Patched dist/config/plugins.js');
} else {
    console.warn('⚠ dist/config/plugins.js not found');
}

// Patch 2: Update plugin's package.json to use .js extensions
const pluginPackagePath = path.join(distDir, 'src', 'plugins', 'media-intake', 'package.json');
if (fs.existsSync(pluginPackagePath)) {
    const pkg = {
        name: 'media-intake',
        version: '1.0.0',
        description: 'HQ Media Intake for Amanat',
        strapi: {
            name: 'media-intake',
            description: 'HQ Media Intake for Amanat',
            kind: 'plugin',
            displayName: 'Media Intake'
        },
        exports: {
            './strapi-admin': {
                types: './strapi-admin.js',
                source: './strapi-admin.js',
                import: './strapi-admin.js',
                require: './strapi-admin.js',
                default: './strapi-admin.js'
            },
            './strapi-server': {
                types: './strapi-server.js',
                source: './strapi-server.js',
                import: './strapi-server.js',
                require: './strapi-server.js',
                default: './strapi-server.js'
            },
            './package.json': './package.json'
        },
        dependencies: {},
        devDependencies: {}
    };
    fs.writeFileSync(pluginPackagePath, JSON.stringify(pkg, null, 4));
    console.log('✓ Patched dist/src/plugins/media-intake/package.json');
} else {
    console.warn('⚠ dist/src/plugins/media-intake/package.json not found');
}

console.log('✓ Post-build patching complete');
