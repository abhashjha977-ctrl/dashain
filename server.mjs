import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT || 3000);
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

const safePath = (base, requested) => {
  const resolved = normalize(join(base, requested));
  return resolved.startsWith(base) ? resolved : null;
};

const server = createServer(async (req, res) => {
  const clean = decodeURIComponent((req.url || '/').split('?')[0]);
  const requested = clean === '/' ? '/index.html' : clean;
  const candidates = [
    safePath(root, requested),
    safePath(join(root, 'public'), requested)
  ].filter(Boolean);

  let file;
  let filePath;
  for (const candidate of candidates) {
    try { file = await readFile(candidate); filePath = candidate; break; } catch { /* try next candidate */ }
  }

  if (!file) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }

  res.writeHead(200, { 'Content-Type': mime[extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  res.end(file);
});

server.listen(port, '0.0.0.0', () => console.log(`Dashain listening on ${port}`));
