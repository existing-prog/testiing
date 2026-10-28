import {moonElements,displayPlanetRadius,orbitalPosition,projectPosition,displayOrbitPosition,displayPositionAtSeconds} from './moon-orbits.js';
// Two-body propagation of dated elements in one reference frame; not a live ephemeris.
export function initMoons() {
 const scene=document.querySelector('.neptune-system'),moons=[...scene.querySelectorAll('.neptune-moon')];
 const back=[...scene.querySelectorAll('.moon-paths-back path')],front=[...scene.querySelectorAll('.moon-paths-front path')],planet=scene.querySelector('.planet');
 const atmosphere=document.createElement('canvas');atmosphere.className='neptune-atmosphere';atmosphere.setAttribute('aria-hidden','true');planet.append(atmosphere);
 const ctx=atmosphere.getContext('2d');
 scene.dataset.running='true';
 let frame=0,last=null,time=0,visible=true,layout='',pixelsPerLogUnit=1;
 const samples=moonElements.map(orbit=>Array.from({length:361},(_,n)=>projectPosition(displayOrbitPosition(orbit,orbitalPosition(orbit,n*Math.PI/180)))));
 function updateLayout(){
  const key=`${scene.clientWidth}:${scene.clientHeight}`;
  if(key===layout)return;layout=key;
  // Fixed framing: do not fit the compressed outer orbit back to the edge.
  pixelsPerLogUnit=Math.min(scene.clientWidth*.47,scene.clientHeight*.36);
  const cx=scene.clientWidth/2,cy=scene.clientHeight*.46;
  planet.style.top='46%';
  const diameter=Math.max(12,2*displayPlanetRadius*pixelsPerLogUnit);
  planet.style.width=diameter+'px';planet.style.height=diameter+'px';
  scene.querySelectorAll('.moon-paths').forEach(svg=>svg.setAttribute('viewBox',`0 0 ${scene.clientWidth} ${scene.clientHeight}`));
  samples.forEach((points,i)=>{
   for(const [elements,isFront] of [[front,true],[back,false]]){
    let pen=false;
    elements[i].setAttribute('d',points.map(([x,y,z])=>{
     if((z>=0)!==isFront){pen=false;return '';}
     const command=pen?'L':'M';pen=true;return `${command} ${cx+x*pixelsPerLogUnit} ${cy+y*pixelsPerLogUnit}`;
    }).join(' '));
   }
  });
 }
 function drawAtmosphere() {
  const w=planet.clientWidth,h=planet.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
  if(atmosphere.width!==Math.round(w*dpr)||atmosphere.height!==Math.round(h*dpr)){atmosphere.width=Math.round(w*dpr);atmosphere.height=Math.round(h*dpr);}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  // Cloud features move in longitude across a sphere, narrowing and fading at its limbs.
  const clouds=[{longitude:0,latitude:-.2,rx:.23,ry:.10,color:'25,46,82',opacity:.65},{longitude:1.15,latitude:.21,rx:.20,ry:.045,color:'178,206,228',opacity:.48},{longitude:2.7,latitude:-.35,rx:.16,ry:.035,color:'162,192,218',opacity:.38},{longitude:4.3,latitude:.05,rx:.12,ry:.06,color:'32,61,95',opacity:.55}];
  for(const cloud of clouds){
   const longitude=cloud.longitude+time*.48,depth=Math.cos(longitude);
   if(depth<=0)continue;
   const x=w/2+Math.sin(longitude)*Math.cos(cloud.latitude)*w*.46,y=h/2+Math.sin(cloud.latitude)*h*.46;
   const rx=w*cloud.rx*Math.max(.06,depth),ry=h*cloud.ry;
   ctx.save();ctx.translate(x,y);ctx.scale(rx,ry);
   const gradient=ctx.createRadialGradient(0,0,.1,0,0,1);gradient.addColorStop(0,`rgba(${cloud.color},${cloud.opacity*depth})`);gradient.addColorStop(1,`rgba(${cloud.color},0)`);
   ctx.fillStyle=gradient;ctx.beginPath();ctx.arc(0,0,1,0,Math.PI*2);ctx.fill();ctx.restore();
  }
 }
 function render(timestamp) {
  frame=0;
  const active=!document.hidden&&visible;
  if(active&&last!==null){const dt=Math.min((timestamp-last)/1000,.08);time+=dt;}
  last=active?timestamp:null;
  updateLayout();
  moons.forEach((moon,i)=>{
   const [x,y,z]=projectPosition(displayOrbitPosition(moonElements[i],displayPositionAtSeconds(moonElements[i],time)));
   moon.style.top='46%';
   moon.style.transform=`translate(calc(-50% + ${x*pixelsPerLogUnit}px),calc(-50% + ${y*pixelsPerLogUnit}px))`;
   moon.style.zIndex=z>=0?'3':'1';
   moon.hidden=false;
   moon.title=moonElements[i].name;
  });
  drawAtmosphere();
  if(active)frame=requestAnimationFrame(render);
 }
 function refresh(){if(!frame)frame=requestAnimationFrame(render);}
 new ResizeObserver(refresh).observe(scene);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();}).observe(scene);
 document.addEventListener('visibilitychange',refresh);refresh();
}
