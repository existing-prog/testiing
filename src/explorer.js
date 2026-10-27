import { mu, L1, L2, C1, C2, parseBank } from './dynamics.js';
function loadPlotly() {
 return new Promise((resolve,reject)=>{
  const script=document.createElement('script');
  script.src='/vendor/plotly-gl3d.min.js';
  script.onload=resolve;script.onerror=()=>reject(new Error('The 3D renderer could not load.'));
  document.head.append(script);
 });
}
function scene(ranges) {
 const spans=ranges.map(([a,b])=>b-a), largest=Math.max(...spans);
 const result={bgcolor:'#0a1219',uirevision:'keep-camera',aspectmode:'manual',aspectratio:{x:spans[0]/largest,y:spans[1]/largest,z:spans[2]/largest},camera:{eye:{x:1.1,y:-1.8,z:.9},up:{x:0,y:0,z:1}}};
 ['x','y','z'].forEach((axis,i)=>result[axis+'axis']={title:{text:axis},range:ranges[i],color:'#83979e',showbackground:false,showgrid:false,zeroline:false,showspikes:false});
 return result;
}
function meshTrace(mesh) {
 return {type:'mesh3d',...mesh,color:'#cbb4ec',opacity:.38,flatshading:false,lighting:{ambient:.72,diffuse:.65,specular:.08,roughness:.9},lightposition:{x:2,y:1,z:3},hoverinfo:'skip',showlegend:false};
}
function markers(x,text,colors,sizes) {
 return {type:'scatter3d',x,y:x.map(()=>0),z:x.map(()=>0),text,mode:'markers+text',textposition:'top center',textfont:{color:'#e8eee8',size:11},marker:{color:colors,size:sizes},showlegend:false,hovertemplate:'%{text}<br>x = %{x:.6f}<extra></extra>'};
}
export async function initExplorer() {
 const status=document.querySelector('#explorer-status'), slider=document.querySelector('#jacobi'), sweep=document.querySelector('#sweep');
 try {
  const testCanvas=document.createElement('canvas');
  if(!testCanvas.getContext('webgl2') && !testCanvas.getContext('webgl')) throw new Error('This browser does not support WebGL.');
  const [frames]=await Promise.all([(async()=>{
   const response=await fetch('/assets/preview_frames.dat');
   if(!response.ok) throw new Error('The surface data could not load.');
   const stream=response.body.pipeThrough(new DecompressionStream('gzip'));
   return parseBank(await new Response(stream).arrayBuffer());
  })(),loadPlotly()]);
  const plotly=window.Plotly;
  const config={responsive:true,displaylogo:false,modeBarButtonsToRemove:['toImage'],scrollZoom:true};
  const layout=ranges=>({paper_bgcolor:'#0a1219',font:{color:'#e8eee8'},margin:{l:0,r:0,t:0,b:0},showlegend:false,uirevision:'keep-camera',scene:scene(ranges)});
  const circle=Array.from({length:241},(_,i)=>i*2*Math.PI/240);
  const overview=[meshTrace(frames[80].meshes[0]),markers([-mu,1-mu],['Sun','Neptune'],['#edcf8e','#75a8e8'],[8,4]),{type:'scatter3d',x:circle.map(t=>(1-mu)*Math.cos(t)),y:circle.map(t=>(1-mu)*Math.sin(t)),z:circle.map(()=>0),mode:'lines',line:{color:'#71949766',width:2,dash:'dot'},hoverinfo:'skip',showlegend:false}];
  const detail=[meshTrace(frames[80].meshes[1]),markers([1-mu,L1,L2],['Neptune','L₁','L₂'],['#75a8e8','#d2e8a5','#d2e8a5'],[7,3,3])];
  await Promise.all([
   plotly.newPlot('system-plot',overview,layout([[-1.5,1.5],[-1.5,1.5],[-1,1]]),config),
   plotly.newPlot('neptune-plot',detail,layout([[L1-.03,L2+.03],[-.08,.08],[-.08,.08]]),config)
  ]);
  document.querySelector('#c1-value').textContent='C₁ = '+C1.toFixed(8);
  document.querySelector('#c2-value').textContent='C₂ = '+C2.toFixed(8);
  let busy=false,pending=null,playing=false,direction=1,timer;
  function describe(frame) {
   document.querySelector('#jacobi-value').textContent=frame.C.toFixed(8);
   document.querySelector('#l1-status').textContent=frame.C<C1?'Open · Sun and Neptune neighborhoods connect.':'Closed · The inner passage is forbidden.';
   document.querySelector('#l2-status').textContent=frame.C<C2?'Open · Access to the exterior is energetically possible.':'Closed · The outer passage is forbidden.';
  }
  async function update(index) {
   pending=index;
   if(busy) return;
   busy=true;
   try {
    while(pending!==null) {
     const frame=frames[pending]; pending=null;
     await Promise.all(frame.meshes.map((mesh,i)=>plotly.restyle(i?'neptune-plot':'system-plot',Object.fromEntries(Object.entries(mesh).map(([key,array])=>[key,[array]])),[0])));
     describe(frame);
    }
   } catch { stop();status.textContent='The 3D view could not update. Reload to retry, or use the original explorer linked below.'; }
   finally {busy=false;}
  }
  function stop() {playing=false;clearTimeout(timer);sweep.innerHTML='Animate energy sweep <span>▷</span>';}
  async function tick() {
   if(!playing) return;
   let next=Number(slider.value)+direction*2;
   if(next>=160){next=160;direction=-1;}else if(next<=0){next=0;direction=1;}
   slider.value=String(next);await update(next);
   if(playing) timer=setTimeout(tick,180);
  }
  slider.oninput=()=>{stop();update(Number(slider.value));};
  sweep.onclick=()=>{if(playing)stop();else{playing=true;sweep.innerHTML='Pause energy sweep <span>Ⅱ</span>';tick();}};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches)stop();});
  slider.disabled=false;sweep.disabled=false;describe(frames[80]);
  status.textContent='Explorer ready · 161 precomputed surface states · rotate and zoom each view independently.';
  status.dataset.ready='true';
 } catch(error) {
  status.textContent=error.message+' Use the original high-resolution explorer linked below, or consult the journal figures.';
  status.dataset.ready='false';
 }
}
