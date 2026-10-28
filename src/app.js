const printButton=document.querySelector('#print-cv');
printButton?.addEventListener('click',()=>window.print());
const motion=document.querySelector('#ambient-motion');
motion.hidden=false;
let ambient=false;
function setAmbient(value) {
 ambient=value;document.body.classList.toggle('ambient-active',value);
 motion.setAttribute('aria-pressed',String(value));
 motion.textContent=value?'Pause ambient motion':'Play ambient motion';
}
motion.onclick=()=>setAmbient(!ambient);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches)setAmbient(false);});
// Moons animate by default unless reduced motion is preferred; other demos remain opt-in.
setAmbient(Boolean(document.querySelector('.neptune-system')) && !matchMedia('(prefers-reduced-motion: reduce)').matches);
if(document.querySelector('.neptune-system')) import('./moons.js').then(({initMoons})=>initMoons()).catch(()=>{document.querySelector('.moon-model-note').textContent='Triton · Proteus · Larissa · Galatea — reload to start the animation';});
if(document.querySelector('#paper-search')) {
 const {publications,citation}=await import('./publications.js');
 const search=document.querySelector('#paper-search'),year=document.querySelector('#paper-year'),topic=document.querySelector('#paper-topic');
 function filter() {
  const query=search.value.trim().toLowerCase();let count=0;
  for(const p of publications) {
   const matches=(!query||`${p.title} ${p.authors.join(' ')} ${p.topic} ${p.venue}`.toLowerCase().includes(query))&&(year.value==='all'||String(p.year)===year.value)&&(topic.value==='all'||p.topic===topic.value);
   document.querySelector(`[data-paper="${p.id}"]`).hidden=!matches;if(matches)count++;
  }
  document.querySelector('#paper-count').textContent=`${count} publication${count===1?'':'s'}`;
  document.querySelector('#no-papers').hidden=count!==0;
 }
 document.querySelector('.publication-filters').addEventListener('submit',e=>e.preventDefault());
 search.addEventListener('input',filter);year.addEventListener('change',filter);topic.addEventListener('change',filter);
 document.querySelectorAll('.copy-citation').forEach(button=>button.addEventListener('click',async()=>{
  const p=publications.find(p=>p.id===button.dataset.id),status=button.nextElementSibling;
  try{await navigator.clipboard.writeText(citation(p));status.textContent='Citation copied.';}
  catch{status.textContent='Select the citation above to copy it manually.';}
 }));
}
const load=document.querySelector('#load-explorer');
if(load) load.addEventListener('click',async()=>{
 load.disabled=true;load.textContent='Loading 3D explorer…';
 document.querySelector('.zvs-views').hidden=false;
 try {
  const {initExplorer}=await import('./explorer.js');
  await initExplorer();
  if(document.querySelector('#explorer-status').dataset.ready==='true')load.hidden=true;
  else{load.disabled=false;load.textContent='Retry loading explorer';}
 }catch{document.querySelector('#explorer-status').textContent='The explorer could not load. Please retry or use the original explorer linked below.';load.disabled=false;load.textContent='Retry loading explorer';}
});
const demoSection=document.querySelector('#frames');
if(demoSection) {
 const observer=new IntersectionObserver(async entries=>{
  if(!entries.some(e=>e.isIntersecting))return;
  observer.disconnect();
  try{const {initDemos}=await import('./demos.js');initDemos();}
  catch{document.querySelectorAll('.demo-toggle,#pause').forEach(button=>{button.disabled=true;button.textContent='Animation unavailable — reload to retry';});}
 },{rootMargin:'250px'});
 document.querySelectorAll('.lab canvas').forEach(canvas=>observer.observe(canvas));
}
