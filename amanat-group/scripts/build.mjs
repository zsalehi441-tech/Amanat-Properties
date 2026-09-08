import { mkdir, copyFile, cp } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'login.html', 'styles.css', 'experience.css', 'app.js', 'architecture.js', 'robots.txt', 'sitemap.xml', '_headers', '_redirects']) await copyFile(file, `dist/${file}`);
await cp('assets', 'dist/assets', { recursive: true });
console.log('Amanat Group built to dist. No credentials or system data included.');
