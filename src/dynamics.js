// Sun–Neptune parameters and normalized effective potential, as in the source app.
export const mu = 1.0241e26 / (1.9890e30 + 1.0241e26);
export function potential(x, y, z = 0) {
 return (1-mu)/Math.hypot(x+mu,y,z) + mu/Math.hypot(x-1+mu,y,z) + (x*x+y*y)/2;
}
export function gradientX(x) {
 return x-(1-mu)*(x+mu)/Math.abs(x+mu)**3-mu*(x-1+mu)/Math.abs(x-1+mu)**3;
}
function root(low, high) {
 for(let i=0;i<100;i++) {
  const middle=(low+high)/2;
  if(gradientX(middle)>0) high=middle; else low=middle;
 }
 return (low+high)/2;
}
export const L1 = root(0.5,1-mu-1e-8);
export const L2 = root(1-mu+1e-8,1.5);
export const C1 = 2*potential(L1,0);
export const C2 = 2*potential(L2,0);
export function sliderToC(s) {
 const center=(C1+C2)/2, f=(10**(3*Math.abs(s))-1)/999;
 return s<0 ? center-(center-2.99)*f : center+(3.02-center)*f;
}
export function parseBank(buffer) {
 const view=new DataView(buffer);
 if(view.getUint32(0,false)!==0x5a565342 || view.getUint32(4,true)!==1) throw new Error('Invalid surface bank');
 const count=view.getUint32(8,true), frames=[];
 let offset=12;
 for(let n=0;n<count;n++) {
  const slider=view.getFloat32(offset,true), C=view.getFloat64(offset+4,true);
  const counts=[[view.getUint32(offset+12,true),view.getUint32(offset+16,true)],[view.getUint32(offset+20,true),view.getUint32(offset+24,true)]];
  offset+=28;
  const meshes=[];
  for(const [vertices,faces] of counts) {
   const mesh={};
   for(const key of ['x','y','z']) {mesh[key]=new Float32Array(buffer,offset,vertices);offset+=vertices*4;}
   for(const key of ['i','j','k']) {mesh[key]=new Uint16Array(buffer,offset,faces);offset+=faces*2;}
   meshes.push(mesh);offset=(offset+3)&~3;
  }
  frames.push({slider,C,meshes});offset=(offset+3)&~3;
 }
 if(offset!==buffer.byteLength || count!==161) throw new Error('Incomplete surface bank');
 return frames;
}

// Ideal outward Hohmann transfer, normalized to r1 = GM = 1.
export function hohmann(radius) {
 if(!Number.isFinite(radius)||radius<1)throw new RangeError('Outer radius must be at least 1');
 const a=(1+radius)/2,e=(radius-1)/(radius+1);
 return {a,e,b:a*Math.sqrt(1-e*e),deltaV:Math.sqrt(2*radius/(1+radius))-1+Math.sqrt(1/radius)*(1-Math.sqrt(2/(1+radius))),periodFraction:Math.pow(a,1.5)/2};
}
export function eccentricAnomaly(mean,e) {
 let E=mean;
 for(let i=0;i<12;i++)E-=(E-e*Math.sin(E)-mean)/(1-e*Math.cos(E));
 return E;
}

export function lagrangePoints(massRatio) {
 if(!(massRatio>0&&massRatio<=.5))throw new RangeError('Mass ratio must be in (0, 0.5]');
 const force=x=>x-(1-massRatio)*(x+massRatio)/Math.abs(x+massRatio)**3-massRatio*(x-1+massRatio)/Math.abs(x-1+massRatio)**3;
 function solve(low,high){for(let i=0;i<100;i++){const mid=(low+high)/2;if(force(mid)>0)high=mid;else low=mid;}return(low+high)/2;}
 return [
  {label:'L₁',x:solve(-massRatio+1e-8,1-massRatio-1e-8),y:0},
  {label:'L₂',x:solve(1-massRatio+1e-8,3),y:0},
  {label:'L₃',x:solve(-3,-massRatio-1e-8),y:0},
  {label:'L₄',x:.5-massRatio,y:Math.sqrt(3)/2},
  {label:'L₅',x:.5-massRatio,y:-Math.sqrt(3)/2},
 ];
}
