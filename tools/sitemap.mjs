/* Genereert sitemap.xml uit de vaste pagina's + de auto's in occasions.json.
   Draaien met:  node tools/sitemap.mjs                                     */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..');
const SITE = 'https://autobedrijfdeheems.nl';
const vandaag = new Date().toISOString().slice(0, 10);

const vast = [
  ['/', 'weekly', '1.0'],
  ['/occasions', 'daily', '0.9'],
  ['/diensten', 'monthly', '0.8'],
  ['/over', 'monthly', '0.6'],
  ['/contact', 'monthly', '0.9']
];

const autos = JSON.parse(fs.readFileSync(path.join(ROOT, 'occasions.json'), 'utf8'))
  .filter(a => a.status !== 'verkocht')
  .map(a => ['/occasion?id=' + encodeURIComponent(a.id), 'weekly', '0.7']);

const url = ([loc, freq, prio]) =>
  `  <url>\n    <loc>${SITE}${loc.replace(/&/g, '&amp;')}</loc>\n` +
  `    <lastmod>${vandaag}</lastmod>\n    <changefreq>${freq}</changefreq>\n` +
  `    <priority>${prio}</priority>\n  </url>`;

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  [...vast, ...autos].map(url).join('\n') + `\n</urlset>\n`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`sitemap.xml bijgewerkt — ${vast.length + autos.length} pagina's`);
