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
// Fixed observer chosen to separate Triton's projected plane from the inner moons.
// Ecliptic J2000 azimuth 68°, elevation -50°, screen roll 36°.
// This is a rigid camera rotation, not a change to any orbital inclination.
export function projectPosition([x,y,z]){
 const horizontal=-.9271838545667872*x+.3746065934159119*y;
 const vertical=-(.28696529924198966*x+.710264039540522*y+.6427876096865393*z);
 const depth=.24079247675463136*x+.5959822936169372*y-.766044443118978*z;
 const c=Math.cos(Math.PI/5),s=Math.sin(Math.PI/5);
 return [horizontal*c-vertical*s,horizontal*s+vertical*c,depth];
}

// Radial display transform in 3D before camera projection. Physical propagation
// remains in km; this monotonic transform preserves orbital planes and depth sign.
export function logarithmicPosition(position) {
 const radius=Math.hypot(...position);
 if(radius===0)return [0,0,0];
 const factor=Math.log1p(radius/neptuneRadiusKm)/radius;
 return position.map(value=>value*factor);
}

export const tritonOrbitSeconds=15;
// A fixed physical reference beyond Triton prevents the outer displayed moon
// from being pinned at 1. View framing and planet size are independent of this map.
export const distanceReferenceKm=1_000_000;
export const displayPlanetRadius=.30;
export function displaySemimajorAxis(orbit,power=3){
 const u=Math.max(0,Math.min(1,Math.log(orbit.a/neptuneRadiusKm)/Math.log(distanceReferenceKm/neptuneRadiusKm)));
 // Reserve a readable globe and clearance; power compresses the remaining gap.
 return .38+.62*u**power;
}
export function displayOrbitPosition(orbit,position){
 const factor=displaySemimajorAxis(orbit)/orbit.a;
 return position.map(value=>value*factor);
}

// Gentle logarithmic timing; Triton remains at 15 seconds.
export function displayPeriodSeconds(orbit){
 const reference=Math.min(...moonElements.map(moon=>moon.period));
 return tritonOrbitSeconds*Math.log1p(orbit.period/reference)/Math.log1p(moonElements[0].period/reference);
}
export function displayPositionAtSeconds(orbit,seconds){
 return orbitalPosition(orbit,rad(orbit.M)+2*Math.PI*seconds/displayPeriodSeconds(orbit));
}
