import {test} from 'node:test';import assert from 'node:assert/strict';
import {moonElements,orbitalPosition,positionAtDay,projectPosition} from './src/moon-orbits.js';
const distance=p=>Math.hypot(...p);
test('each moon reaches the physical periapsis/apoapsis and repeats after its tabulated period',()=>{
 for(const orbit of moonElements){
  assert.ok(Math.abs(distance(orbitalPosition(orbit,0))-orbit.a*(1-orbit.e))<1e-6);
  assert.ok(Math.abs(distance(orbitalPosition(orbit,Math.PI))-orbit.a*(1+orbit.e))<1e-6);
  const first=positionAtDay(orbit,0),repeat=positionAtDay(orbit,orbit.period);
  assert.ok(distance(first.map((n,i)=>n-repeat[i]))<1e-6);
  assert.ok(Math.abs(distance(projectPosition(first))-distance(first))<1e-6);
 }
 assert.ok(moonElements[2].a/moonElements[1].a>46);
});
test('Triton angular momentum opposes the prograde inner moon without an artificial time reversal',()=>{
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
 const angular=moonElements.map(o=>{const a=positionAtDay(o,0),b=positionAtDay(o,.0001);return cross(a,b.map((n,i)=>n-a[i]));});
 assert.ok(angular[0].reduce((sum,n,i)=>sum+n*angular[1][i],0)<0);
 assert.ok(angular[2].reduce((sum,n,i)=>sum+n*angular[1][i],0)>0);
});
