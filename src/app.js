const main = document.querySelector('main');
const orbit = `<div class="orbit-art" aria-hidden="true"><div class="orbit-label top-label">FIG. 01 / A CONTINUOUS TRAJECTORY</div><div class="orbital-ring ring-one"></div><div class="orbital-ring ring-two"></div><div class="orbital-ring ring-three"></div><div class="planet"></div><div class="satellite"></div><div class="crosshair c-one">+</div><div class="crosshair c-two">+</div><div class="orbit-label bottom-label">r = a(1 − e²) / (1 + e cos ν)<br><span>NOT TO SCALE · ARTISTIC STUDY</span></div></div>`;
const entries = [
  { category: 'ORBITAL MECHANICS', date: 'ENTRY 001', title: 'The geometry of getting there', text: 'A place for notes on Keplerian orbits, the two-body problem, and the elegant mathematics that describes motion.', tag: 'Foundations', number: '01' },
  { category: 'MISSION DESIGN', date: 'ENTRY 002', title: 'Between two worlds', text: 'Future explorations of transfer trajectories, mission constraints, and finding a path through the solar system.', tag: 'Trajectory design', number: '02' },
  { category: 'NUMERICAL METHODS', date: 'ENTRY 003', title: 'Turning equations into motion', text: 'A space to document numerical propagation, computational experiments, and lessons from simulation.', tag: 'Computation', number: '03' }
];
function overview() {
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow"><span></span> AEROSPACE ENGINEERING / ASTRODYNAMICS</p><h1>Curiosity has<br>no <em>orbit.</em></h1><p class="hero-description">Understanding motion. Exploring possibilities.<br>A journey at the intersection of engineering,<br class="desktop"> mathematics, and the space beyond.</p><a class="button" href="/journal">Explore my research <span>↗</span></a><div class="hero-meta"><span>B.Sc. Aerospace Engineering</span><span class="muted">Driven by the unknown</span></div></div>${orbit}<div class="hero-bottom"><span>01 — PERSONAL FLIGHT LOG</span><a href="#about">SCROLL TO DISCOVER ↓</a></div></section>
  <section class="about section" id="about"><div><p class="eyebrow">01 / THE PERSON BEHIND THE EQUATIONS</p><h2>A little perspective<br>from down here.</h2></div><div class="about-copy"><p>I’m <span class="placeholder">[Your name]</span>, an aerospace engineering graduate with a focus on astrodynamics. I’m fascinated by how we navigate space — and the ideas that help us reach a little further.</p><p class="muted">This is my corner of the universe: a collection of research notes, evolving simulations, and things learned along the way. More of my story will land here soon.</p><a class="text-link" href="#cv">Explore my background <span>↓</span></a></div></section>
  <section class="section cv" id="cv"><div class="section-heading"><div><p class="eyebrow">02 / FLIGHT QUALIFICATIONS</p><h2>Built on foundations.<br>Oriented toward discovery.</h2></div><button class="text-link" id="print-cv">Print / save CV <span>↗</span></button></div><div class="cv-grid"><article><span class="tiny">EDUCATION</span><h3>Bachelor of Science</h3><p>Aerospace Engineering</p><p class="muted">[University name] · [Graduation year]</p><div class="credential">Specialization <span>Astrodynamics</span></div></article><article><span class="tiny">FIELDS OF INTEREST</span><div class="skills"><span>Orbital mechanics</span><span>Trajectory design</span><span>Mission analysis</span><span>Spacecraft dynamics</span></div></article><article><span class="tiny">TECHNICAL TOOLKIT · TO PERSONALIZE</span><div class="skills"><span>Python</span><span>MATLAB</span><span>Numerical methods</span><span>Scientific visualization</span></div><p class="muted small">Sample skills — replace with your own experience.</p></article></div></section>
  <section class="section preview"><div><p class="eyebrow">03 / WORK IN PROGRESS</p><h2>Ideas in motion.</h2><p class="muted">From a page of equations to a moving universe.</p></div><a class="feature-link" href="/simulations"><span class="mini-orbit">◌</span><div><span class="tiny">THE SIMULATION LAB</span><h3>Watch the theory take shape</h3><span class="muted">Experiments, animations & orbital explorations</span></div><span class="lime">↗</span></a></section>`;
}
function journal() {
 return `<section class="page-intro"><p class="eyebrow">THE RESEARCH JOURNAL / FIELD NOTES</p><h1>Small observations.<br><em>Infinite questions.</em></h1><p class="hero-description">A living record of ideas, investigations, and discoveries<br>in astrodynamics. Every trajectory starts with a question.</p></section><section class="section journal-section"><div class="journal-toolbar"><span class="tiny">RESEARCH NOTES</span><span class="muted small">03 entries · Sample journal</span></div><div class="journal-list">${entries.map(e => `<article class="journal-entry"><span class="entry-number">${e.number}</span><div><p class="eyebrow">${e.category} <span class="muted">/ ${e.date}</span></p><h2>${e.title}</h2><p class="muted">${e.text}</p><span class="tag">${e.tag}</span></div><button class="entry-open" data-entry="${e.number}" aria-label="Read ${e.title}">↗</button></article>`).join('')}</div><p class="sample-note">These are placeholder entries. Research findings, references, and figures will be added here.</p></section><dialog id="entry-dialog"><button id="close-dialog" aria-label="Close entry">✕</button><p class="eyebrow" id="dialog-category"></p><h2 id="dialog-title"></h2><p id="dialog-text"></p><p class="muted">Research entry coming soon. This space will hold the full study, methods, results, and references.</p></dialog>`;
}
function simulations() {
 return `<section class="page-intro"><p class="eyebrow">THE SIMULATION LAB / VISUAL EXPLORATIONS</p><h1>Equations.<br>Meet <em>motion.</em></h1><p class="hero-description">A playground for orbital ideas. Interactive studies today,<br>deeper research animations on the horizon.</p></section><section class="section lab"><div class="lab-heading"><div><p class="eyebrow">EXPERIMENT 001</p><h2>The elliptical orbit</h2></div><span class="status"><i></i> INTERACTIVE DEMO</span></div><div class="simulation-layout"><div class="canvas-wrap"><canvas id="orbit-canvas" aria-label="Animated elliptical orbit showing a satellite moving around a central body"></canvas><span class="canvas-caption">TWO-BODY MODEL / NORMALIZED UNITS</span></div><div class="controls"><span class="tiny">MISSION CONTROLS</span><h3>A change in perspective.</h3><p class="muted">Adjust eccentricity to explore the shape of an orbit. The satellite moves faster near the central body and slower further away.</p><label for="eccentricity">Eccentricity <output id="ecc-value">0.40</output></label><input id="eccentricity" type="range" min="0" max="0.8" step="0.01" value="0.4"><label for="speed">Playback speed <output id="speed-value">1×</output></label><input id="speed" type="range" min="0.25" max="3" step="0.25" value="1"><button class="button" id="pause">Pause animation <span>Ⅱ</span></button><p class="small muted">Illustrative Keplerian motion. Distances and time are normalized; this is not a mission planning tool.</p></div></div><div class="upcoming"><span class="tiny">ON THE HORIZON</span><h3>More trajectories to explore.</h3><p class="muted">Transfer orbits, multi-body dynamics, and future research visualizations will live here.</p><span class="tag">Coming soon</span></div></section>`;
}
const route = location.pathname.replace(/\/$/, '') || '/';
main.innerHTML = route === '/journal' ? journal() : route === '/simulations' ? simulations() : overview();
document.querySelector(`[data-route="${route}"]`)?.setAttribute('aria-current', 'page');
document.querySelector('#print-cv')?.addEventListener('click', () => window.print());
document.querySelectorAll('[data-entry]').forEach(button => button.addEventListener('click', () => {
 const entry = entries.find(e => e.number === button.dataset.entry);
 document.querySelector('#dialog-category').textContent = entry.category;
 document.querySelector('#dialog-title').textContent = entry.title;
 document.querySelector('#dialog-text').textContent = entry.text;
 document.querySelector('dialog').showModal();
}));
document.querySelector('#close-dialog')?.addEventListener('click', () => document.querySelector('dialog').close());
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
