export function initMoons() {
 const scene=document.querySelector('.neptune-system'),moons=[...scene.querySelectorAll('.neptune-moon')];
 let frame=0,last=null,time=0,visible=true;
 function render(timestamp) {
  frame=0;
  const active=document.body.classList.contains('ambient-active')&&!document.hidden&&visible;
  if(active&&last!==null)time+=Math.min((timestamp-last)/1000,.08);
  last=active?timestamp:null;
  const size=Math.min(scene.clientWidth/540,scene.clientHeight/500);
  moons.forEach((moon,i)=>{
   const angle=time*[.42,-.28,.18][i]+[.2,2.5,4.5][i],radius=[180,215,245][i]*size;
   const x=Math.cos(angle)*radius,y=Math.sin(angle)*radius*.42;
   moon.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;
   moon.style.zIndex=Math.sin(angle)>0?'3':'1';
  });
  if(active)frame=requestAnimationFrame(render);
 }
 function refresh(){if(!frame)frame=requestAnimationFrame(render);}
 new MutationObserver(refresh).observe(document.body,{attributes:true,attributeFilter:['class']});
 new ResizeObserver(refresh).observe(scene);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();}).observe(scene);
 document.addEventListener('visibilitychange',refresh);refresh();
}
