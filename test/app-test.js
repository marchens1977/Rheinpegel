// Automatische Prüfung der Rheinpegel-App.
// Start:  cd test && npm install && npm test
// Startet einen kleinen lokalen Webserver, öffnet die App in einem unsichtbaren
// Browser (Handy-Größe) und ersetzt Pegelonline durch Beispieldaten.
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };

let fehler = 0;
function pruefe(ok, text) {
  console.log((ok ? '  OK    ' : '  FEHLER ') + text);
  if (!ok) fehler++;
}

// --- Beispieldaten ---
const STATIONEN = [
  { uuid: 'koeln', shortname: 'KÖLN', km: 688, latitude: 50.94, longitude: 6.96, water: { shortname: 'RHEIN' } },
  { uuid: 'bonn', shortname: 'BONN', km: 654.8, latitude: 50.74, longitude: 7.11, water: { shortname: 'RHEIN' } },
  { uuid: 'mosel', shortname: 'TRIER', km: 1, latitude: 49.75, longitude: 6.63, water: { shortname: 'MOSEL' } }
];
function messwerte() {
  const out = []; const jetzt = Date.now();
  for (let h = 7 * 24; h >= 0; h -= 1) out.push({ timestamp: new Date(jetzt - h * 3600e3).toISOString(), value: 300 + Math.round(20 * Math.sin(h / 10)) });
  return out;
}
function vorhersage() {
  const out = []; const jetzt = Date.now();
  for (let h = 1; h <= 4 * 24; h += 3) out.push({ timestamp: new Date(jetzt + h * 3600e3).toISOString(), value: 310 + h });
  return out;
}

function server() {
  return new Promise(resolve => {
    const s = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]).replace(/^\/Rheinpegel/, '');
      if (p === '/' || p === '') p = '/index.html';
      const datei = path.join(ROOT, p);
      if (!datei.startsWith(ROOT) || !fs.existsSync(datei)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(datei)] || 'application/octet-stream' });
      res.end(fs.readFileSync(datei));
    });
    s.listen(0, () => resolve(s));
  });
}

(async () => {
  // 1) Dateien prüfen
  console.log('Dateien:');
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.webmanifest'), 'utf8'));
  pruefe(manifest.name === 'Rheinpegel', 'Manifest hat den Namen "Rheinpegel"');
  pruefe(manifest.display === 'standalone', 'Manifest: App öffnet ohne Browser-Leiste');
  for (const icon of manifest.icons) pruefe(fs.existsSync(path.join(ROOT, icon.src)), 'Symbol vorhanden: ' + icon.src);
  pruefe(manifest.icons.some(i => i.sizes === '192x192') && manifest.icons.some(i => i.sizes === '512x512'), 'Symbole in 192 und 512 Pixel (nötig für Android)');
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  pruefe(html.includes('chart.js@4.4.1'), 'Chart.js ist fest auf 4.4.1');
  pruefe(!/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/.test(html), 'Zoom ist erlaubt');
  pruefe(/#002D72/i.test(html) && /#FF5910/i.test(html), 'Farben Blau (#002D72) und Orange (#FF5910) verwendet');

  // 2) App im Browser prüfen
  const srv = await server();
  const basis = `http://localhost:${srv.address().port}/Rheinpegel/`;
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const jsFehler = [];
  page.on('pageerror', e => jsFehler.push(e.message));

  const chartLokal = path.join(__dirname, 'node_modules', 'chart.js', 'dist', 'chart.umd.js');
  await context.route('https://cdn.jsdelivr.net/**', route => fs.existsSync(chartLokal)
    ? route.fulfill({ contentType: 'text/javascript', body: fs.readFileSync(chartLokal) })
    : route.fulfill({ contentType: 'text/javascript', body: 'window.Chart = function(){ this.destroy = function(){}; };' }));
  await context.route('https://pegelonline.wsv.de/**', route => {
    const u = route.request().url();
    if (u.includes('stations.json')) return route.fulfill({ json: STATIONEN });
    if (u.includes('/W/measurements.json')) return route.fulfill({ json: messwerte() });
    if (u.includes('/W/forecast.json')) return route.fulfill({ json: vorhersage() });
    return route.fulfill({ status: 404, body: '' });
  });

  console.log('App im Browser:');
  await page.goto(basis);
  await page.waitForFunction(() => document.querySelectorAll('#stationSelect option').length > 1);
  const optionen = await page.$$eval('#stationSelect option', o => o.map(x => x.textContent));
  pruefe(optionen.length === 3, 'Nur Rhein-Stationen in der Liste (2 + Auswahlzeile)');
  pruefe(optionen[1].startsWith('BONN'), 'Liste alphabetisch sortiert');

  await page.selectOption('#stationSelect', 'koeln');
  await page.waitForSelector('#dataCard', { state: 'visible' });
  pruefe((await page.textContent('#stationName')) === 'KÖLN', 'Stationsname wird angezeigt');
  pruefe(/\d+ cm/.test(await page.textContent('#currentLevel')), 'Aktueller Wasserstand wird angezeigt');
  pruefe(await page.$$eval('.forecast-val', e => e.length) > 0, 'Vorhersage-Zeilen werden angezeigt');
  pruefe(await page.$$eval('.current-row', e => e.length) === 1, 'Zeile "Aktuell" vorhanden');
  if (fs.existsSync(chartLokal)) pruefe(await page.evaluate(() => !!(window.Chart && Chart.getChart('levelChart'))), 'Diagramm wurde gezeichnet');

  const farbe = await page.$eval('header', e => getComputedStyle(e).backgroundColor);
  pruefe(farbe === 'rgb(0, 45, 114)', 'Kopfzeile ist Mets-Blau');
  const knopf = await page.$eval('#btnLocation', e => getComputedStyle(e).backgroundColor);
  pruefe(knopf === 'rgb(255, 89, 16)', 'GPS-Knopf ist Mets-Orange');

  // Lieblings-Pegel merken
  const page2 = await context.newPage();
  await page2.goto(basis);
  await page2.waitForSelector('#dataCard', { state: 'visible' });
  pruefe((await page2.textContent('#stationName')) === 'KÖLN', 'Zuletzt gewählter Pegel wird beim Öffnen direkt angezeigt');
  await page2.close();

  // Installierbarkeit
  const sw = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.ready;
    return !!reg.active;
  });
  pruefe(sw, 'Service Worker (Offline-Helfer) ist aktiv');
  const manifestLink = await page.$eval('link[rel=manifest]', e => e.href);
  pruefe(manifestLink.endsWith('manifest.webmanifest'), 'Manifest ist in der Seite verlinkt');

  // Offline-Start
  await context.setOffline(true);
  await page.reload();
  pruefe((await page.textContent('h1')).includes('Rhein'), 'App startet auch ohne Internet (aus dem Speicher)');
  await context.setOffline(false);

  pruefe(jsFehler.length === 0, 'Keine JavaScript-Fehler' + (jsFehler.length ? ': ' + jsFehler.join(' | ') : ''));

  if (process.argv.includes('--bild')) {
    fs.mkdirSync(path.join(__dirname, 'screenshots'), { recursive: true });
    await page.goto(basis);
    await page.waitForSelector('#dataCard', { state: 'visible' });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(__dirname, 'screenshots', 'app.png'), fullPage: true });
    console.log('Bild gespeichert: test/screenshots/app.png');
  }

  await browser.close();
  srv.close();
  console.log(fehler === 0 ? '\nAlle Prüfungen bestanden.' : `\n${fehler} Prüfung(en) fehlgeschlagen.`);
  process.exit(fehler === 0 ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
