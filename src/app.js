import { initExplorer } from './explorer.js';
const main = document.querySelector('main');
const orbit = `<div class="orbit-art" aria-hidden="true"><div class="orbit-label top-label">FIG. 01 / THE OUTER SOLAR SYSTEM</div><div class="orbital-ring ring-one"></div><div class="orbital-ring ring-two"></div><div class="orbital-ring ring-three"></div><div class="planet"></div><div class="satellite"></div><div class="crosshair c-one">+</div><div class="crosshair c-two">+</div><div class="orbit-label bottom-label">SUN–NEPTUNE / μ ≈ 5.15 × 10⁻⁵<br><span>ARTISTIC STUDY · NOT TO SCALE</span></div></div>`;
function overview() {
 return `<section class="hero"><div class="hero-copy"><p class="eyebrow"><span></span> SAMANTHA RAMSEY / ASTRODYNAMICS</p><h1>Beyond Neptune.<br>Into the <em>unknown.</em></h1><p class="hero-description">Exploring the dynamics of the outer Solar System.<br>Celestial mechanics, numerical computation,<br class="desktop"> and the structures that shape orbital motion.</p><a class="button" href="/journal">Explore my research <span>↗</span></a><div class="hero-meta"><span>Ph.D. student · University of Tennessee</span><span class="muted">Trans-Neptunian dynamics</span></div></div>${orbit}<div class="hero-bottom"><span>01 — A PERSONAL RESEARCH TRAJECTORY</span><a href="#about">SCROLL TO DISCOVER ↓</a></div></section>
 <section class="about section" id="about"><div><p class="eyebrow">01 / THE PERSON BEHIND THE EQUATIONS</p><h2>Research at the edge<br>of our Solar System.</h2></div><div class="about-copy"><p>I’m Samantha Ramsey, a Ph.D. researcher in Aerospace Engineering at the University of Tennessee. I study the dynamics of trans-Neptunian objects using celestial mechanics, numerical computation, and interactive visualization.</p><p class="muted">My work investigates resonances, transport pathways, and the long-term behavior of small bodies beyond Neptune. Restricted three-body models help reveal the geometry beneath that motion.</p><div class="contact-links"><a class="text-link" href="mailto:samantharamsey@live.com">Email <span>↗</span></a><a class="text-link" href="https://github.com/samantharamsey">GitHub <span>↗</span></a><a class="text-link" href="#cv">Curriculum vitae <span>↓</span></a></div></div></section>
 <section class="section research-themes"><p class="eyebrow">02 / RESEARCH DIRECTIONS</p><div class="cv-grid"><article><span class="tiny">01 / OUTER SOLAR SYSTEM</span><h3>Trans-Neptunian dynamics</h3><p class="muted">Resonances, resonance sticking, chaotic diffusion, and long-term orbital evolution.</p></article><article><span class="tiny">02 / DYNAMICAL SYSTEMS</span><h3>Restricted three-body models</h3><p class="muted">Periodic orbits, invariant manifolds, and the structures that organize orbital transport.</p></article><article><span class="tiny">03 / SCIENTIFIC COMPUTING</span><h3>Interactive visualization</h3><p class="muted">Responsive tools for exploring zero-velocity surfaces and dynamical geometry.</p></article></div></section>
 <section class="section cv" id="cv"><div class="section-heading"><div><p class="eyebrow">03 / CURRICULUM VITAE</p><h2>A trajectory through<br>engineering & discovery.</h2></div><button class="text-link" id="print-cv">Print / save CV <span>↗</span></button></div><div id="cv-content" class="document-content" aria-busy="true"><p class="muted">Loading curriculum vitae…</p></div></section>
 <section class="section" id="publications"><p class="eyebrow">04 / PUBLICATIONS & PRESENTATIONS</p><div id="publications-content" class="document-content" aria-busy="true"><p class="muted">Loading selected work…</p></div></section>
 <section class="section preview"><div><p class="eyebrow">05 / INTERACTIVE RESEARCH</p><h2>The geometry of possibility.</h2><p class="muted">Explore the gateways around Neptune.</p></div><a class="feature-link" href="/simulations"><span class="mini-orbit">◌</span><div><span class="tiny">SUN–NEPTUNE CR3BP</span><h3>Zero-velocity surface explorer</h3><span class="muted">Two 3D views. One changing Jacobi constant.</span></div><span class="lime">↗</span></a></section>`;
}
function journal() {
 return `<section class="page-intro"><p class="eyebrow">THE RESEARCH JOURNAL / OUTER SOLAR SYSTEM DYNAMICS</p><h1>Motion has<br>an underlying <em>geometry.</em></h1><p class="hero-description">From three-body foundations to orbital transport.<br>Derivations, numerical methods, and an evolving research record.</p></section><section class="section journal-section"><div class="journal-toolbar"><span class="tiny">CR3BP FOUNDATIONS / WORKING JOURNAL</span><a class="text-link" href="/simulations">Open the explorer ↗</a></div><div class="research-layout"><nav class="journal-toc" aria-label="Journal chapters"><span class="tiny">IN THIS JOURNAL</span><a href="#research-overview">01 / Research overview</a><a href="#cr3bp-model">02 / Three-body model</a><a href="#governing-equations">03 / Governing equations</a><a href="#jacobi-integral">04 / Jacobi integral</a><a href="#equilibrium-points">05 / Equilibria & geometry</a><a href="#numerical-methods">06 / Numerical verification</a><a href="#tno-connection">07 / Beyond Neptune</a><a href="#research-log">08 / Research log</a></nav><article id="research-content" class="document-content research-document" aria-busy="true"><p class="muted">Loading the research journal…</p></article></div></section>`;
}
function simulations() {
 return `<section class="page-intro"><p class="eyebrow">THE SIMULATION LAB / SUN–NEPTUNE DYNAMICS</p><h1>See the structures.<br>Explore the <em>motion.</em></h1><p class="hero-description">Interactive geometry from the circular restricted three-body problem.<br>Move through energy levels. Discover where passage becomes possible.</p></section>
 <section class="section lab" id="zvs"><div class="lab-heading"><div><p class="eyebrow">RESEARCH EXPLORER / 01</p><h2>Zero-velocity surfaces</h2></div><span class="status"><i></i> SUN–NEPTUNE CR3BP</span></div><p class="explorer-intro muted">Two views of the same Jacobi constant: the full system and the neighborhood around Neptune. Drag to rotate; scroll or pinch to zoom. Surface geometry is a boundary of energetic accessibility, not an orbit.</p><div id="explorer-status" class="research-note" role="status">Loading the 3D explorer and precomputed surface bank…</div><div class="zvs-views"><div><h3>Sun–Neptune system</h3><div id="system-plot" class="zvs-plot" role="img" aria-label="Rotatable three-dimensional zero-velocity surface of the Sun–Neptune system"></div></div><div><h3>Neptune close-up</h3><div id="neptune-plot" class="zvs-plot" role="img" aria-label="Rotatable three-dimensional zero-velocity surface near Neptune and the L1 and L2 gateways"></div></div></div><div class="zvs-controls"><div><label for="jacobi">Jacobi constant <output id="jacobi-value">—</output></label><input id="jacobi" type="range" min="0" max="160" step="1" value="80" disabled><div class="range-endpoints"><span>2.99000000 · Lower C</span><span>3.02000000 · Higher C</span></div></div><button class="button" id="sweep" disabled>Animate energy sweep <span>▷</span></button></div><div class="gateway-grid"><div><span class="tiny">INNER GATEWAY / L₁</span><strong id="c1-value">—</strong><p id="l1-status">Loading…</p></div><div><span class="tiny">OUTER GATEWAY / L₂</span><strong id="c2-value">—</strong><p id="l2-status">Loading…</p></div><div><span class="tiny">THE ACCESSIBILITY CONDITION</span><strong>v² = 2Ω − C ≥ 0</strong><p>A lower C opens more accessible space. An open gateway permits transport; it does not guarantee a transit.</p></div></div><p class="small muted">Uses the source explorer’s 161 precomputed preview frames, with its true Sun–Neptune mass ratio and nonlinear energy spacing. These are coarse preview meshes, not the Python app’s continuously recomputed high-resolution surfaces. Markers are enlarged for visibility.</p><div class="contact-links"><a class="text-link" href="https://tno-dynamics.onrender.com/">Original high-resolution explorer ↗</a><a class="text-link" href="/journal#zero-velocity-regions">Read the derivation ↗</a></div></section>
 <section class="section lab"><div class="lab-heading"><div><p class="eyebrow">FOUNDATIONAL DEMO / 02</p><h2>The elliptical orbit</h2></div><span class="tiny">TWO-BODY REFERENCE</span></div><div class="simulation-layout"><div class="canvas-wrap"><canvas id="orbit-canvas" aria-label="Animated elliptical orbit showing a satellite moving around a central body"></canvas><span class="canvas-caption">TWO-BODY MODEL / NORMALIZED UNITS</span></div><div class="controls"><span class="tiny">MISSION CONTROLS</span><h3>A change in perspective.</h3><p class="muted">Compare the three-body geometry above with a two-body orbit. The satellite moves faster near the central body and slower further away.</p><label for="eccentricity">Eccentricity <output id="ecc-value">0.40</output></label><input id="eccentricity" type="range" min="0" max="0.8" step="0.01" value="0.4"><label for="speed">Playback speed <output id="speed-value">1×</output></label><input id="speed" type="range" min="0.25" max="3" step="0.25" value="1"><button class="button" id="pause">Pause animation <span>Ⅱ</span></button><p class="small muted">Original portfolio demo; not a result from the trans-Neptunian research. Distances and time are normalized.</p></div></div></section>`;
}
const route = location.pathname.replace(/\/$/, '') || '/';
main.innerHTML = route === '/journal' ? journal() : route === '/simulations' ? simulations() : overview();
document.querySelector(`[data-route="${route}"]`)?.setAttribute('aria-current', 'page');
document.querySelector('#print-cv')?.addEventListener('click', () => window.print());
async function loadDocument(name) {
 const target = document.querySelector(`#${name}-content`);
 if (!target) return;
 try {
  const response = await fetch(`/content/${name}.html`);
  if (!response.ok) throw new Error('Content unavailable');
  target.innerHTML = await response.text();
  // Keep chapter links in sync with the source journal's actual section identifiers.
  if (name === 'research') {
   const headings = [...target.querySelectorAll('h2[id]')];
   document.querySelectorAll('.journal-toc a').forEach((link, index) => {
    if (headings[index]) link.href = '#' + headings[index].id;
   });
  }
  if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
 } catch {
  target.innerHTML = '<p class="research-note">This document could not load. Please reload, or <a href="https://samantharamsey.github.io/tno-dynamics/">read the original research site</a>.</p>';
 } finally { target.setAttribute('aria-busy', 'false'); }
}
await Promise.all(['cv', 'publications', 'research'].map(loadDocument));
if (route === '/simulations') initExplorer();
if (route === '/simulations') {
 const canvas = document.querySelector('canvas');
 const ctx = canvas.getContext('2d');
 const ecc = document.querySelector('#eccentricity');
 const speed = document.querySelector('#speed');
 let running = !matchMedia('(prefers-reduced-motion: reduce)').matches;
 let mean = 0, previous;
 const pause = document.querySelector('#pause');
 function updatePause() { pause.innerHTML = running ? 'Pause animation <span>Ⅱ</span>' : 'Play animation <span>▷</span>'; }
 updatePause();
 pause.onclick = () => { running = !running; updatePause(); };
 ecc.oninput = () => document.querySelector('#ecc-value').textContent = Number(ecc.value).toFixed(2);
 speed.oninput = () => document.querySelector('#speed-value').textContent = speed.value + '×';
 function draw(time) {
  const box = canvas.getBoundingClientRect(), dpr = devicePixelRatio || 1;
  if (canvas.width !== Math.round(box.width*dpr) || canvas.height !== Math.round(box.height*dpr)) { canvas.width = Math.round(box.width*dpr); canvas.height = Math.round(box.height*dpr); }
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const w=box.width,h=box.height,a=Math.min(w*.36,h*.36),e=Number(ecc.value),b=a*Math.sqrt(1-e*e);
  if(running && previous !== undefined) mean += Math.min((time-previous)/1000,.1)*Number(speed.value)*.7;
  previous=time;
  let E=mean%(Math.PI*2); for(let i=0;i<8;i++) E-=(E-e*Math.sin(E)-mean%(Math.PI*2))/(1-e*Math.cos(E));
  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle='#ffffff08'; ctx.lineWidth=1;
  for(let x=20;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=20;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  ctx.strokeStyle='#a6b7b950';ctx.beginPath();ctx.ellipse(w/2,h/2,a,b,0,0,Math.PI*2);ctx.stroke();
  const fx=w/2+a*e,fy=h/2,sx=w/2+a*Math.cos(E),sy=h/2+b*Math.sin(E);
  ctx.setLineDash([3,6]);ctx.strokeStyle='#d5ed9c40';ctx.beginPath();ctx.moveTo(fx,fy);ctx.lineTo(sx,sy);ctx.stroke();ctx.setLineDash([]);
  const glow=ctx.createRadialGradient(fx,fy,0,fx,fy,38);glow.addColorStop(0,'#d5ed9c44');glow.addColorStop(1,'#d5ed9c00');ctx.fillStyle=glow;ctx.fillRect(fx-38,fy-38,76,76);
  ctx.fillStyle='#d5ed9c';ctx.beginPath();ctx.arc(fx,fy,9,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#f5f7f3';ctx.beginPath();ctx.arc(sx,sy,4,0,Math.PI*2);ctx.fill();
  ctx.font='10px monospace';ctx.fillStyle='#8a959b';ctx.fillText('PRIMARY',fx+15,fy+4);ctx.fillText('SATELLITE',sx+12,sy-10);
  requestAnimationFrame(draw);
 }
 requestAnimationFrame(draw);
}
