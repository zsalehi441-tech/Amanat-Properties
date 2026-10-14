import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'login.html', 'style.css', 'app.js', 'robots.txt', 'sitemap.xml', '_headers', '_redirects']) await copyFile(file, `dist/${file}`);
await cp('assets', 'dist/assets', { recursive: true });
await cp('local', 'dist/local', { recursive: true });
console.log('Amanat marketing and local services built. No System source or data included.');
