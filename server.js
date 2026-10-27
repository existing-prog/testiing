import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';
import path from 'node:path';
import { pages, renderPage, normalizeSiteUrl } from './render.js';
const root=path.resolve(fileURLToPath(new URL('./src/',import.meta.url)));
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.dat':'application/octet-stream','.pdf':'application/pdf','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};
const assets=new Map();
function representation(body,type) {
 const bytes=Buffer.isBuffer(body)?body:Buffer.from(body);
 return {body:bytes,etag:'"'+createHash('sha256').update(bytes).digest('base64url').slice(0,22)+'"',type};
}
function send(req,res,asset,cache='no-cache') {
 const headers={'Content-Type':asset.type,'Cache-Control':cache,'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Vary':'Accept-Encoding'};
 // Revalidate all assets so updated files never remain stuck behind a long cache lifetime.
 if(req.headers['if-none-match']?.split(/,\s*/).includes(asset.etag)) {res.writeHead(304,{...headers,ETag:asset.etag}).end();return;}
 let body=asset.body,encoding='';
 const compressible=/^(text\/|application\/(?:xml|ld\+json))/.test(asset.type)||asset.type==='image/svg+xml';
 const accepted=(req.headers['accept-encoding']||'').split(',').map(value=>{const [name,...params]=value.trim().split(';');const q=params.find(p=>p.trim().startsWith('q='));return {name:name.trim(),q:q?Number(q.trim().slice(2)):1};});
 const supports=name=>accepted.some(e=>(e.name===name||e.name==='*')&&e.q>0);
 if(compressible&&body.length>1024) {
  if(supports('br')) {asset.br??=brotliCompressSync(body,{params:{[constants.BROTLI_PARAM_QUALITY]:4}});body=asset.br;encoding='br';}
  else if(supports('gzip')) {asset.gzip??=gzipSync(body);body=asset.gzip;encoding='gzip';}
 }
 headers.ETag='W/'+asset.etag;
 // Accept either our weak validator or the unprefixed validator.
 if(req.headers['if-none-match']?.split(/,\s*/).includes(headers.ETag)){res.writeHead(304,headers).end();return;}
 if(encoding)headers['Content-Encoding']=encoding;
 headers['Content-Length']=body.length;
 res.writeHead(200,headers).end(req.method==='HEAD'?undefined:body);
}
export function createPortfolioServer({siteUrl=process.env.SITE_URL||''}={}) {
 const origin=normalizeSiteUrl(siteUrl);
 return http.createServer(async(req,res)=>{
  try {
   if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'}).end();return;}
   const pathname=new URL(req.url,'http://localhost').pathname;
   const route=pathname.length>1?pathname.replace(/\/+$/,''):pathname;
   if(pathname==='/index.html'){res.writeHead(308,{Location:'/'}).end();return;}
   if(pages[route]) {
    if(pathname!==route){res.writeHead(308,{Location:route}).end();return;}
    return send(req,res,representation(await renderPage(route,origin),'text/html; charset=utf-8'));
   }
   if(pathname==='/robots.txt') return send(req,res,representation(`User-agent: *\nAllow: /\nDisallow: /content/\n${origin?`Sitemap: ${origin}/sitemap.xml\n`:''}`,'text/plain; charset=utf-8'));
   if(pathname==='/sitemap.xml') {
    if(!origin){res.writeHead(503,{'Content-Type':'text/plain; charset=utf-8','X-Robots-Tag':'noindex'}).end('Configure SITE_URL with the public website origin to enable the sitemap.');return;}
    return send(req,res,representation(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pages).map(p=>`<url><loc>${origin}${p}</loc></url>`).join('')}</urlset>`,'application/xml; charset=utf-8'));
   }
   const decoded=decodeURIComponent(pathname);
   if(decoded.split('/').some(segment=>segment.startsWith('.'))||decoded.includes('\0')||decoded.includes('\\')) {res.writeHead(404).end('Not found');return;}
   const target=path.resolve(root,decoded.slice(1));
   if(!target.startsWith(root+path.sep)){res.writeHead(404).end('Not found');return;}
   const info=await stat(target);
   if(!info.isFile())throw new Error('Not a file');
   let asset=assets.get(target);
   if(!asset||asset.mtime!==info.mtimeMs){asset={...representation(await readFile(target),types[path.extname(target)]||'application/octet-stream'),mtime:info.mtimeMs};if(assets.size>128)assets.clear();assets.set(target,asset);}
   if(decoded.startsWith('/content/'))res.setHeader('X-Robots-Tag','noindex');
   send(req,res,asset,'public, max-age=0, must-revalidate');
  } catch(error) {res.writeHead(error instanceof URIError?400:404,{'Content-Type':'text/plain; charset=utf-8'}).end('Not found');}
 });
}
export const server=createPortfolioServer();
if(process.argv[1]===fileURLToPath(import.meta.url))server.listen(Number(process.env.PORT||3000),'0.0.0.0',()=>console.log('Portfolio listening on port '+(process.env.PORT||3000)));
