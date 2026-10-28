import { eccentricAnomaly } from './dynamics.js';
// Factual elements transcribed from CelestiaContent/data/solarsys.ssc and minormoons.ssc.
// Common Ecliptic J2000 frame, epoch JD 2447763.5 (1989-08-25).
// Triton uses the file's documented elliptical fallback, not its custom precessing orbit.
export const moonEpochJD=2447763.5;
export const neptuneRadiusKm=24622;
export const moonElements=[
 {name:'Triton',a:354759,e:.000016,i:130.909204,node:213.174202,peri:278.113474,M:349.996104,period:5.8768541},
 {name:'Proteus',a:117647,e:.00053,i:28.908433,node:48.083589,peri:81.195458,M:34.162384,period:1.12231477},
 {name:'Larissa',a:73548.26,e:.001393,i:28.693900,node:48.446761,peri:109.167352,M:310.958996,period:.55465332},
 {name:'Galatea',a:61952.57,e:.00022,i:28.482346,node:48.730913,peri:94.040655,M:346.601960,period:.42874431},
];
const rad=degrees=>degrees*Math.PI/180;
export function orbitalPosition(orbit,mean) {
 const E=eccentricAnomaly(mean,orbit.e),x=orbit.a*(Math.cos(E)-orbit.e),y=orbit.a*Math.sqrt(1-orbit.e**2)*Math.sin(E);
 const w=rad(orbit.peri),i=rad(orbit.i),O=rad(orbit.node);
 const u=x*Math.cos(w)-y*Math.sin(w),v=x*Math.sin(w)+y*Math.cos(w);
 return [u*Math.cos(O)-v*Math.cos(i)*Math.sin(O),u*Math.sin(O)+v*Math.cos(i)*Math.cos(O),v*Math.sin(i)];
}
export function positionAtDay(orbit,days){return orbitalPosition(orbit,rad(orbit.M)+2*Math.PI*days/orbit.period);}
// Fixed observer: Ecliptic J2000 viewed after a 60-degree rotation about x.
export function projectPosition([x,y,z]){const c=Math.cos(Math.PI/3),s=Math.sin(Math.PI/3);return [x,-(y*c-z*s),y*s+z*c];}

// Radial display transform in 3D before camera projection. Physical propagation
// remains in km; this monotonic transform preserves orbital planes and depth sign.
export function logarithmicPosition(position) {
 const radius=Math.hypot(...position);
 if(radius===0)return [0,0,0];
 const factor=Math.log1p(radius/neptuneRadiusKm)/radius;
 return position.map(value=>value*factor);
}

export const tritonOrbitSeconds=15;
// Scale each semimajor axis with a cubed logarithm, retaining its eccentricity and plane.
export function displayOrbitPosition(orbit,position){
 const factor=Math.log1p(orbit.a/neptuneRadiusKm)**3/orbit.a;
 return position.map(value=>value*factor);
}

// Cube the logarithmic period ratio using the shortest period as the reference;
// Triton remains the 15-second anchor. These are display periods, not real-time ratios.
export function displayPeriodSeconds(orbit){
 const reference=Math.min(...moonElements.map(moon=>moon.period));
 return tritonOrbitSeconds*(Math.log1p(orbit.period/reference)/Math.log1p(moonElements[0].period/reference))**3;
}
export function displayPositionAtSeconds(orbit,seconds){
 return orbitalPosition(orbit,rad(orbit.M)+2*Math.PI*seconds/displayPeriodSeconds(orbit));
}
