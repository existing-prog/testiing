import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { mu, L1, L2, C1, C2, potential, gradientX, sliderToC, parseBank } from './src/dynamics.js';

test('Sun–Neptune equilibria satisfy the force balance and critical Jacobi values', () => {
 assert.ok(Math.abs(mu-5.1485534120890236e-5)<1e-12);
 assert.ok(L1<1-mu && L2>1-mu);
 assert.ok(Math.abs(gradientX(L1))<1e-12);
 assert.ok(Math.abs(gradientX(L2))<1e-12);
 assert.ok(C1>C2 && C2>3);
 assert.equal(sliderToC(-1),2.99);
 assert.equal(sliderToC(1),3.02);
 assert.equal(sliderToC(0),(C1+C2)/2);
});
test('all 161 source frames are complete and match the nonlinear energy mapping', async () => {
 const data=gunzipSync(await readFile(new URL('./src/assets/preview_frames.dat',import.meta.url)));
 const buffer=data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength);
 const frames=parseBank(buffer);
 assert.equal(frames.length,161);
 let previous=-Infinity;
 for(const frame of frames) {
  assert.ok(frame.C>previous);previous=frame.C;
  assert.ok(Math.abs(frame.C-sliderToC(frame.slider))<1e-8);
  for(const mesh of frame.meshes) {
   assert.equal(mesh.x.length,mesh.y.length);assert.equal(mesh.x.length,mesh.z.length);
   assert.equal(mesh.i.length,mesh.j.length);assert.equal(mesh.i.length,mesh.k.length);
   for(const key of ['i','j','k']) for(const index of mesh[key]) assert.ok(index<mesh.x.length);
   for(let i=0;i<mesh.x.length;i+=Math.max(1,Math.floor(mesh.x.length/20))) {
    const residual=Math.abs(2*potential(mesh.x[i],mesh.y[i],mesh.z[i])-frame.C);
    assert.ok(residual<1e-6,'sampled vertices satisfy the zero-velocity boundary within preview precision');
   }
  }
 }
 assert.ok(frames[80].C<C1 && frames[80].C>C2,'initial view opens L1 and closes L2');
});
