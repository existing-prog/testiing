import {cp,mkdir,readFile,readdir,rm,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pages,renderPage} from '../render.js';
const project=fileURLToPath(new URL('../',import.meta.url));
export async function buildStatic({siteUrl=process.env.PUBLIC_SITE_URL||'https://existing-prog.github.io/testiing/',outDir=path.join(project,'dist')}={}) {
 const url=new URL(siteUrl);
 if(!['https:','http:'].includes(url.protocol)||url.username||url.password||url.search||url.hash)throw new Error('PUBLIC_SITE_URL must be the public website URL without query or fragment.');
 const prefix=url.pathname.replace(/\/$/,'');
 const base=url.origin+prefix;
 // Only this dedicated generated directory is replaced; source and repository files stay intact.
 if(path.resolve(outDir)===path.resolve(project))throw new Error('Output must not replace the repository root.');
 await rm(outDir,{recursive:true,force:true});await mkdir(outDir,{recursive:true});
 for(const name of await readdir(path.join(project,'src'))){
  if(['assets','vendor'].includes(name)||(/\.(css|js)$/.test(name)&&name!=='views.js'))await cp(path.join(project,'src',name),path.join(outDir,name),{recursive:true});
 }
 const rendered=new Map();
 const hash=createHash('sha256');
 for(const route of Object.keys(pages)){const html=await renderPage(route,base);rendered.set(route,html);hash.update(html);}
 const sourceNames=(await readdir(path.join(project,'src'))).filter(name=>/\.(js|css)$/.test(name)&&name!=='views.js').sort();
 for(const name of sourceNames)hash.update(await readFile(path.join(project,'src',name)));
 const version=hash.digest('hex').slice(0,12);
 const manifest=Object.fromEntries(sourceNames.map(name=>[name,name.replace(/\.(js|css)$/,`.${version}.$1`)]));
 for(const name of sourceNames){
  let content=await readFile(path.join(project,'src',name),'utf8');
  if(name.endsWith('.js'))content=content.replace(/(['"])(\.\/[^'"?#]+\.js)\1/g,(match,quote,specifier)=>manifest[specifier.slice(2)]?`${quote}./${manifest[specifier.slice(2)]}${quote}`:match);
  await writeFile(path.join(outDir,manifest[name]),content);await rm(path.join(outDir,name));
 }
 await writeFile(path.join(outDir,'build-manifest.json'),JSON.stringify(manifest));
 function local(value){
  if(!value.startsWith('/')||value.startsWith('//'))return value;
  const match=value.match(/^([^?#]*)(.*)$/),route=match[1],suffix=match[2];
  return prefix+(manifest[route.slice(1)]?'/'+manifest[route.slice(1)]:(pages[route]&&route!=='/'?route+'/':route))+suffix;
 }
 for(const route of Object.keys(pages)){
  let html=rendered.get(route);
  html=html.replace(/\b(href|src)="([^"]*)"/g,(_,attr,value)=>`${attr}="${local(value)}"`);
  html=html.replace(/\bsrcset="([^"]*)"/g,(_,value)=>`srcset="${value.split(',').map(item=>item.trim().replace(/^\S+/,local)).join(', ')}"`);
  if(route!=='/')html=html.replaceAll(base+route+'"',base+route+'/"');
  const folder=path.join(outDir,route.slice(1));await mkdir(folder,{recursive:true});await writeFile(path.join(folder,'index.html'),html);
 }
 await writeFile(path.join(outDir,'.nojekyll'),'');
 await writeFile(path.join(outDir,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
 await writeFile(path.join(outDir,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pages).map(route=>`<url><loc>${base}${route==='/'?'/':route+'/'}</loc></url>`).join('')}</urlset>`);
 await writeFile(path.join(outDir,'404.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Page not found | Samantha Ramsey</title><body style="background:#070717;color:#f1f2fc;font:20px system-ui;padding:10vw"><h1>Page not found</h1><p><a style="color:#d4d0ff" href="${prefix}/">Return to Samantha Ramsey’s portfolio</a></p></body></html>`);
 return outDir;
}
if(process.argv[1]===fileURLToPath(import.meta.url))console.log('Static site built in '+await buildStatic());
