import {test} from 'node:test';import assert from 'node:assert/strict';
import {moonElements,orbitalPosition,positionAtDay,projectPosition,logarithmicPosition,neptuneRadiusKm,displayPeriodSeconds,displayPositionAtSeconds,tritonOrbitSeconds,displayOrbitPosition,displaySemimajorAxis,displayPlanetRadius} from './src/moon-orbits.js';
const distance=p=>Math.hypot(...p);
test('each moon reaches the physical periapsis/apoapsis and repeats after its tabulated period',()=>{
 for(const orbit of moonElements){
  assert.ok(Math.abs(distance(orbitalPosition(orbit,0))-orbit.a*(1-orbit.e))<1e-6);
  assert.ok(Math.abs(distance(orbitalPosition(orbit,Math.PI))-orbit.a*(1+orbit.e))<1e-6);
  const first=positionAtDay(orbit,0),repeat=positionAtDay(orbit,orbit.period);
  assert.ok(distance(first.map((n,i)=>n-repeat[i]))<1e-6);
  assert.ok(Math.abs(distance(projectPosition(first))-distance(first))<1e-6);
 }
 assert.deepEqual(moonElements.map(o=>o.name),['Triton','Proteus','Larissa','Galatea']);
 assert.ok(Math.max(...moonElements.map(o=>o.a*(1+o.e)))/Math.min(...moonElements.map(o=>o.a*(1-o.e)))<6);
});
test('Triton angular momentum opposes the prograde inner moon without an artificial time reversal',()=>{
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const angular=moonElements.map(o=>{const a=positionAtDay(o,0),b=positionAtDay(o,.0001);return cross(a,b.map((n,i)=>n-a[i]));});
 assert.ok(angular[0].reduce((sum,n,i)=>sum+n*angular[1][i],0)<0);
 assert.ok(angular[2].reduce((sum,n,i)=>sum+n*angular[1][i],0)>0);
});

test('logarithmic display compresses radii while preserving direction and depth',()=>{
 assert.deepEqual(logarithmicPosition([0,0,0]),[0,0,0]);
 assert.ok(Math.abs(logarithmicPosition([neptuneRadiusKm,0,0])[0]-Math.log(2))<1e-12);
 const a=[1e5,2e5,-3e5],b=a.map(v=>v*10);
 const la=logarithmicPosition(a),lb=logarithmicPosition(b);
 assert.ok(distance(lb)>distance(la)&&distance(lb)/distance(la)<10);
 assert.ok(la[2]<0);
 for(let i=0;i<3;i++)assert.ok(Math.abs(la[i]/distance(la)-a[i]/distance(a))<1e-12);
});

test('normalized powered-log distance and gentle log timing preserve planes, eccentricity and cycles',()=>{
 assert.equal(tritonOrbitSeconds,15);
 assert.equal(displayPeriodSeconds(moonElements[0]),15);
 const fastest=moonElements[3];
 assert.ok(displayPeriodSeconds(fastest)>0);
 for(const orbit of moonElements){
  const seconds=displayPeriodSeconds(orbit);
  const reference=Math.min(...moonElements.map(m=>m.period));
  assert.ok(Math.abs(seconds-15*(Math.log1p(orbit.period/reference)/Math.log1p(moonElements[0].period/reference)))<1e-12);
  const a=positionAtDay(orbit,0),b=displayPositionAtSeconds(orbit,seconds);
  assert.ok(distance(a.map((value,i)=>value-b[i]))<1e-6);
  const peri=distance(displayOrbitPosition(orbit,orbitalPosition(orbit,0)));
  const apo=distance(displayOrbitPosition(orbit,orbitalPosition(orbit,Math.PI)));
  assert.ok(Math.abs(apo/peri-(1+orbit.e)/(1-orbit.e))<1e-12);
  assert.ok(Math.abs((peri+apo)/2-displaySemimajorAxis(orbit))<1e-12);
 }
});

test('larger compression power moves every moon inward without resizing Neptune or the view',()=>{
 for(const orbit of moonElements){
  assert.ok(displaySemimajorAxis(orbit,3)<displaySemimajorAxis(orbit,1));
  assert.ok(displaySemimajorAxis(orbit,3)>displayPlanetRadius);
  assert.ok(displaySemimajorAxis(orbit,3)<1);
 }
 assert.ok(displaySemimajorAxis(moonElements[0],3)<.65);
});

test('the camera visibly separates Triton and the inner-moon plane without changing 3D distances',()=>{
 function majorAxis(orbit){
  let xx=0,xy=0,yy=0;
  for(let n=0;n<360;n++){const [x,y]=projectPosition(orbitalPosition(orbit,n*Math.PI/180));xx+=x*x;xy+=x*y;yy+=y*y;}
  return .5*Math.atan2(2*xy,xx-yy);
 }
 let separation=Math.abs(majorAxis(moonElements[0])-majorAxis(moonElements[1]));
 separation=Math.min(separation,Math.PI-separation);
 assert.ok(separation>30*Math.PI/180);
});
