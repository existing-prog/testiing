import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('./src/', import.meta.url)));
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' };
export const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const routes = ['/', '/journal', '/simulations'];
  const filename = routes.includes(pathname) ? 'index.html' : pathname.slice(1);
  const target = path.resolve(root, filename);
  if (!target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(target);
    res.writeHead(200, { 'Content-Type': `${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8` });
    res.end(body);
  } catch { res.writeHead(404).end('Not found'); }
});
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Portfolio listening on port ' + (process.env.PORT || 3000)));
}
