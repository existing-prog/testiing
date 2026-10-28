import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { server, createPortfolioServer } from './server.js';
import { normalizeSiteUrl } from './render.js';
let base;
let production, publicBase;
before(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  production=createPortfolioServer({siteUrl:'https://portfolio.example'});
  await new Promise(resolve=>production.listen(0,'127.0.0.1',resolve));
  publicBase=`http://127.0.0.1:${production.address().port}`;
});
after(() => Promise.all([server,production].map(instance=>new Promise(resolve=>instance.close(resolve)))));
test('all four routes serve unique, indexable HTML without needing JavaScript', async () => {
  const titles=new Set();
  for (const route of ['/', '/journal', '/simulations', '/publications']) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type'), /text\/html/);
    const html = await response.text();
    assert.match(html, /id="main"/);
    assert.match(html, /src="\/app.js"/);
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
    const title=html.match(/<title>(.*?)<\/title>/)[1];
    assert.ok(!titles.has(title));titles.add(title);
    assert.match(html, /name="description"/);
    assert.doesNotMatch(html,/PAGE_CONTENT|Loading the research journal|Loading curriculum vitae/);
    if(route==='/')assert.match(html,/Lockheed Martin Space/);
    if(route==='/journal'){assert.match(html,/id="jacobi-geometry"/);assert.match(html,/class="katex"/);assert.match(html,/srcset=/);assert.match(html,/loading="lazy"/);}
    if(route==='/publications'){assert.match(html,/Titan Aerogravity Assist/);assert.match(html,/PDF · not yet available/);}
  }
});
test('production SEO uses the configured origin, correct schemas and all four sitemap URLs', async()=>{
  const html=await(await fetch(publicBase+'/publications')).text();
  assert.match(html,/<link rel="canonical" href="https:\/\/portfolio.example\/publications">/);
  assert.match(html,/property="og:image" content="https:\/\/portfolio.example\/assets\/social-card\.png\?v=[a-f0-9]{12}"/);
  assert.match(html,/name="twitter:image:alt"/);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(schema['@graph'].filter(node=>node['@type']==='ScholarlyArticle').length,3);
  const sitemap=await(await fetch(publicBase+'/sitemap.xml')).text();
  assert.equal((sitemap.match(/<url>/g)||[]).length,4);
  assert.match(sitemap,/<loc>https:\/\/portfolio.example\/publications<\/loc>/);
  assert.match(await(await fetch(publicBase+'/robots.txt')).text(),/Sitemap: https:\/\/portfolio.example\/sitemap.xml/);
  assert.doesNotMatch(await(await fetch(base)).text(),/rel="canonical"/);
  assert.equal((await fetch(base+'/sitemap.xml')).status,503);
  assert.throws(()=>normalizeSiteUrl('https://example.com/a-path'));
});
test('compression, cache revalidation, HEAD and redirects preserve HTTP semantics',async()=>{
  const response=await fetch(base+'/journal',{headers:{'Accept-Encoding':'gzip'}});
  assert.equal(response.headers.get('content-encoding'),'gzip');
  const text=await response.text();
  assert.ok(Number(response.headers.get('content-length'))<Buffer.byteLength(text)/2);
  const css=await fetch(base+'/style.css',{headers:{'Accept-Encoding':'br'}});
  assert.equal(css.headers.get('content-encoding'),'br');
  const etag=css.headers.get('etag');
  assert.equal((await fetch(base+'/style.css',{headers:{'If-None-Match':etag}})).status,304);
  const head=await fetch(base+'/publications',{method:'HEAD'});
  assert.equal(head.status,200);assert.equal(await head.text(),'');
  assert.equal((await fetch(base+'/journal/',{redirect:'manual'})).status,308);
  assert.equal((await fetch(base+'/index.html',{redirect:'manual'})).headers.get('location'),'/');
  assert.equal((await fetch(base,{method:'POST'})).status,405);
});
test('application assets are available with correct types', async () => {
  for (const [asset, type] of [['app.js','text/javascript'], ['style.css','text/css'], ['content/research.html','text/html'], ['assets/preview_frames.dat','application/octet-stream'], ['assets/research/equilibrium-points-planar.png','image/png'], ['vendor/plotly-gl3d.min.js','text/javascript']]) {
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
