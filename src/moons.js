// A projected, illustrative moon system; angles, radii, and rates are not ephemerides.
export function initMoons() {
 const scene=document.querySelector('.neptune-system'),moons=[...scene.querySelectorAll('.neptune-moon')];
 const back=[...scene.querySelectorAll('.moon-paths-back path')],front=[...scene.querySelectorAll('.moon-paths-front path')],planet=scene.querySelector('.planet');
 const atmosphere=document.createElement('canvas');atmosphere.className='neptune-atmosphere';atmosphere.setAttribute('aria-hidden','true');planet.append(atmosphere);
 const ctx=atmosphere.getContext('2d');
 let frame=0,last=null,time=0,visible=true,layout='';
 const planes=[{tilt:-.65,flatten:.56,radius:180,speed:-.42},{tilt:.16,flatten:.29,radius:215,speed:.28},{tilt:.58,flatten:.72,radius:245,speed:.18}];
 function position(plane,angle,size) {
  const x=Math.cos(angle)*plane.radius*size,y=Math.sin(angle)*plane.radius*size*plane.flatten;
  return [x*Math.cos(plane.tilt)-y*Math.sin(plane.tilt),x*Math.sin(plane.tilt)+y*Math.cos(plane.tilt)];
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
  const active=document.body.classList.contains('ambient-active')&&!document.hidden&&visible;
  if(active&&last!==null)time+=Math.min((timestamp-last)/1000,.08);
  last=active?timestamp:null;
  const size=Math.min(scene.clientWidth/540,scene.clientHeight/500),cx=scene.clientWidth/2,cy=scene.clientHeight*.48;
  const key=`${scene.clientWidth}:${scene.clientHeight}`;
  if(key!==layout){
   layout=key;scene.querySelectorAll('.moon-paths').forEach(svg=>svg.setAttribute('viewBox',`0 0 ${scene.clientWidth} ${scene.clientHeight}`));
   planes.forEach((plane,i)=>{
    for(const [paths,start] of [[front,0],[back,Math.PI]])paths[i].setAttribute('d',Array.from({length:81},(_,n)=>{const [x,y]=position(plane,start+n*Math.PI/80,size);return `${n?'L':'M'} ${cx+x} ${cy+y}`;}).join(' '));
   });
  }
  moons.forEach((moon,i)=>{
   const angle=time*planes[i].speed+[.2,2.5,4.5][i],[x,y]=position(planes[i],angle,size);
   moon.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;
   moon.style.zIndex=Math.sin(angle)>0?'3':'1';
  });
  drawAtmosphere();
  if(active)frame=requestAnimationFrame(render);
 }
 function refresh(){if(!frame)frame=requestAnimationFrame(render);}
 new MutationObserver(refresh).observe(document.body,{attributes:true,attributeFilter:['class']});
 new ResizeObserver(refresh).observe(scene);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();}).observe(scene);
 document.addEventListener('visibilitychange',refresh);refresh();
}
