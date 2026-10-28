import { hohmann, eccentricAnomaly, lagrangePoints } from './dynamics.js';
// A shared scheduler pauses offscreen/hidden canvases and never spins while paused.
function canvasPlayer(canvas,draw) {
 const ctx=canvas.getContext('2d');
 let playing=false,visible=false,frame=0,last=null,time=0;
 function paint(timestamp) {
  frame=0;
  if(playing&&visible&&!document.hidden&&last!==null)time+=Math.min((timestamp-last)/1000,.08);
  last=timestamp;
  const bounds=canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);
  const width=Math.max(1,Math.round(bounds.width*ratio)),height=Math.max(1,Math.round(bounds.height*ratio));
  if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,bounds.width,bounds.height);
  draw(ctx,bounds.width,bounds.height,time);
  if(playing&&visible&&!document.hidden)frame=requestAnimationFrame(paint);else last=null;
 }
 function render(){if(!frame)frame=requestAnimationFrame(paint);}
 function stop(){if(frame)cancelAnimationFrame(frame);frame=0;last=null;}
 new ResizeObserver(render).observe(canvas);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)render();else stop();}).observe(canvas);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(visible)render();});
 render();
 return {render,setPlaying(value){playing=value;if(value&&visible)render();else{stop();render();}},isPlaying:()=>playing};
}
function dot(ctx,x,y,r,color,label,labelY=-12) {
 ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=14;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 if(label){ctx.font='12px system-ui';ctx.fillStyle='#c9d2ed';ctx.fillText(label,x+12,y+labelY);}
}
function line(ctx,points,color='#8495c45c',dash=[]) {
 ctx.strokeStyle=color;ctx.lineWidth=1;ctx.setLineDash(dash);ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();ctx.setLineDash([]);
}
function circle(ctx,x,y,r,color){ctx.strokeStyle=color;ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();}
function bindToggle(player,button,label) {
 const update=()=>{const playing=player.isPlaying();button.textContent=(playing?'Pause ':'Play ')+label;button.setAttribute('aria-pressed',String(playing));};
 button.onclick=()=>{player.setPlaying(!player.isPlaying());update();};
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event=>{if(event.matches){player.setPlaying(false);update();}});
 update();
}
export function initDemos() {
 const frameCanvas=document.querySelector('#frame-canvas'),select=document.querySelector('#reference-frame');
 const equilibria=lagrangePoints(.1);
 const frame=canvasPlayer(frameCanvas,(ctx,w,h,t)=>{
  const cx=w/2,cy=h/2,scale=Math.min(w,h)*.28,angle=select.value==='rotating'?0:t*.55;
  const project=(x,y)=>[cx+scale*(x*Math.cos(angle)-y*Math.sin(angle)),cy-scale*(x*Math.sin(angle)+y*Math.cos(angle))];
  circle(ctx,cx,cy,scale*.9,'#8394cb2e');circle(ctx,cx,cy,scale*.1,'#8394cb2e');
  const A=project(-.1,0),B=project(.9,0),upper=project(equilibria[3].x,equilibria[3].y),lower=project(equilibria[4].x,equilibria[4].y);
  line(ctx,[A,upper,B,lower,A],'#b5b6ff44',[4,5]);
  dot(ctx,...A,9,'#f2ca87','Primary 1',24);dot(ctx,...B,6,'#8dacf5','Primary 2',24);
  for(const point of equilibria)dot(ctx,...project(point.x,point.y),4,'#d9b2ff',point.label);
  ctx.fillStyle='#d5def1';ctx.font='15px monospace';ctx.fillText('+',cx-4,cy+5);
 });
 select.onchange=()=>{document.querySelector('#frame-label').textContent=select.value==='rotating'?'Co-rotating frame':'Inertial frame';frame.render();};bindToggle(frame,document.querySelector('[data-canvas="frame-canvas"]'),'frame animation');
 const radius=document.querySelector('#transfer-radius');
 const transfer=canvasPlayer(document.querySelector('#transfer-canvas'),(ctx,w,h,t)=>{
  const r=Number(radius.value),{a,e,b}=hohmann(r),scale=Math.min(w,h)*.38/r,cx=w/2,cy=h/2;
  circle(ctx,cx,cy,scale,'#83b4f46b');circle(ctx,cx,cy,scale*r,'#c9b2f56b');
  const path=Array.from({length:101},(_,i)=>{const E=i*Math.PI/100;return[cx+scale*a*(Math.cos(E)-e),cy-scale*b*Math.sin(E)];});
  line(ctx,path,'#d3e8a5',[5,4]);
  dot(ctx,cx,cy,8,'#f2ca87','Primary');
  const E=eccentricAnomaly((t*.48)%Math.PI,e);
  dot(ctx,cx+scale*a*(Math.cos(E)-e),cy-scale*b*Math.sin(E),4,'#f0f3fb');
  dot(ctx,cx+scale,cy,3,'#86b6f5');dot(ctx,cx-scale*r,cy,3,'#d6b4f7');
  ctx.font='12px system-ui';ctx.fillStyle='#bfcbe8';ctx.fillText('BURN 1',cx+scale-20,cy+26);ctx.fillText('BURN 2',cx-scale*r-20,cy+26);
 });
 function updateTransfer(){const r=Number(radius.value),data=hohmann(r);document.querySelector('#transfer-radius-value').textContent=r.toFixed(2);document.querySelector('#transfer-dv').textContent=data.deltaV.toFixed(4);document.querySelector('#transfer-time').textContent=data.periodFraction.toFixed(3);transfer.render();}
 radius.oninput=updateTransfer;updateTransfer();bindToggle(transfer,document.querySelector('[data-canvas="transfer-canvas"]'),'transfer animation');
 const ecc=document.querySelector('#eccentricity'),speed=document.querySelector('#speed');
 let mean=0,previousTime=0;
 const ellipse=canvasPlayer(document.querySelector('#orbit-canvas'),(ctx,w,h,t)=>{
  mean+=(t-previousTime)*Number(speed.value)*.7;previousTime=t;
  const e=Number(ecc.value),a=Math.min(w*.36,h*.34),b=a*Math.sqrt(1-e*e),cx=w/2,cy=h/2,E=eccentricAnomaly(mean%(Math.PI*2),e),fx=cx+a*e,sx=cx+a*Math.cos(E),sy=cy+b*Math.sin(E);
  ctx.strokeStyle='#b4c3e366';ctx.beginPath();ctx.ellipse(cx,cy,a,b,0,0,Math.PI*2);ctx.stroke();line(ctx,[[fx,cy],[sx,sy]],'#d3e8a550',[3,6]);
  dot(ctx,fx,cy,9,'#d3e8a5','Primary');dot(ctx,sx,sy,4,'#f0f3fb','Satellite');
 });
 ecc.oninput=()=>{document.querySelector('#ecc-value').textContent=Number(ecc.value).toFixed(2);ellipse.render();};
 speed.oninput=()=>{document.querySelector('#speed-value').textContent=speed.value+'×';};
 bindToggle(ellipse,document.querySelector('#pause'),'orbit animation');
}
