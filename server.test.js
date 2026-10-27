import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { server } from './server.js';
let base;
before(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));
test('all portfolio routes return the application shell', async () => {
  for (const route of ['/', '/journal', '/simulations']) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    const html = await response.text();
    assert.match(html, /id="main"/);
    assert.match(html, /src="\/app.js"/);
  }
});
test('application assets are available with correct types', async () => {
  for (const [asset, type] of [['app.js','text/javascript'], ['style.css','text/css']]) {
    const response = await fetch(`${base}/${asset}`);
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('content-type').startsWith(type));
    assert.ok((await response.text()).length > 100);
  }
});
test('missing files and private project files are not served', async () => {
  for (const route of ['/missing', '/package.json', '/.git/config', '/%2e%2e/server.js']) {
    assert.equal((await fetch(base + route)).status, 404);
  }
});
