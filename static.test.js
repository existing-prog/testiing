import {test} from 'node:test';import assert from 'node:assert/strict';import {mkdtemp,readFile,access,rm} from 'node:fs/promises';import {tmpdir} from 'node:os';import path from 'node:path';import {buildStatic} from './scripts/build.mjs';
test('GitHub Pages export renders all routes and resolves assets under the project path',async()=>{
 const temp=await mkdtemp(path.join(tmpdir(),'portfolio-static-'));
 try{
  await buildStatic({siteUrl:'https://existing-prog.github.io/testiing/',outDir:path.join(temp,'site')});
  for(const route of ['','journal','publications','simulations']){
   const html=await readFile(path.join(temp,'site',route,'index.html'),'utf8');
   assert.match(html,/<h1/);assert.doesNotMatch(html,/PAGE_CONTENT|PAGE_METADATA/);
   assert.match(html,/src="\/testiing\/app\.[a-f0-9]{12}\.js"/);
   assert.match(html,new RegExp(`rel="canonical" href="https://existing-prog.github.io/testiing/${route?route+'/':''}"`));
   for(const [,url] of html.matchAll(/(?:href|src)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)){
    assert.ok(url.startsWith('/testiing/'),url);
    const local=url.slice('/testiing/'.length);await access(path.join(temp,'site',local));
   }
  }
  const manifest=JSON.parse(await readFile(path.join(temp,'site','build-manifest.json'),'utf8'));
  assert.match(manifest['moons.js'],/^moons\.[a-f0-9]{12}\.js$/);
  assert.match(await readFile(path.join(temp,'site',manifest['app.js']),'utf8'),new RegExp(manifest['moons.js'].replaceAll('.','\\.')));
  assert.match(await readFile(path.join(temp,'site','sitemap.xml'),'utf8'),/testiing\/publications\//);
  await access(path.join(temp,'site','assets','preview_frames.dat'));
 }finally{await rm(temp,{recursive:true,force:true});}
});
