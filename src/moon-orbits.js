import { eccentricAnomaly } from './dynamics.js';
// Factual elements transcribed from CelestiaContent/data/solarsys.ssc.
// Common Ecliptic J2000 frame, epoch JD 2447763.5 (1989-08-25).
// Triton uses the file's documented elliptical fallback, not its custom precessing orbit.
export const moonEpochJD=2447763.5;
export const neptuneRadiusKm=24622;
export const moonElements=[
 {name:'Triton',a:354759,e:.000016,i:130.909204,node:213.174202,peri:278.113474,M:349.996104,period:5.8768541},
 {name:'Proteus',a:117647,e:.00053,i:28.908433,node:48.083589,peri:81.195458,M:34.162384,period:1.12231477},
 {name:'Nereid',a:5506217.008,e:.753882,i:5.055101,node:319.892917,peri:296.451886,M:36.055860,period:359.396374},
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
