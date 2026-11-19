// Erzeugt aus icons/icon.svg die PNG-Symbole für die installierbare App.
// Start (im Projektordner): node werkzeuge/icons-erzeugen.js
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const root = path.join(__dirname, '..');
  const svg = fs.readFileSync(path.join(root, 'icons', 'icon.svg'), 'utf8');
  const browser = await chromium.launch();
  for (const size of [180, 192, 512]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await page.setContent(`<html><body style="margin:0">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    const out = path.join(root, 'icons', `icon-${size}.png`);
    await page.screenshot({ path: out, clip: { x: 0, y: 0, width: size, height: size } });
    console.log('geschrieben:', out);
    await page.close();
  }
  await browser.close();
})();
