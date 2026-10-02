/* Renders each cv/*.html page to a print-quality PDF in assets/pdfs/.
   Run locally with: npm install && npm run pdfs
   Also runs in CI (see .github/workflows/build-pdfs.yml). */
const fs = require('fs');
const path = require('path');
const http = require('http');
const puppeteer = require('puppeteer');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'assets', 'pdfs');
const PORT = 8099;

const MIME = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml' };

const pages = [
  ['full',         'watkins-cv-full'],
  ['academia',     'watkins-cv-teaching-academia'],
  ['quantitative', 'watkins-cv-quantitative'],
  ['gamedev',      'watkins-cv-game-development'],
  ['phd',          'watkins-cv-phd-applications'],
  ['../outreach/indie-email', 'watkins-outreach-email'],
];

function serve(){
  return http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/index.html';
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); return res.end('not found');
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const server = serve();
  await new Promise(r => server.listen(PORT, r));
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  for (const [slug, out] of pages) {
    await page.goto(\`http://localhost:\${PORT}/cv/\${slug}.html\`, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: path.join(OUT, out + '.pdf'),
      printBackground: true,
      preferCSSPageSize: true
    });
    console.log('wrote', out + '.pdf');
  }
  await browser.close();
  server.close();
})();
