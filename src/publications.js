// Add public paper URLs and uploaded PDF paths here when available.
// Keep absent resources null: the UI must not invent links, DOIs, or downloads.
export const publications = [
  {
    id: 'tno-part-8', year: 2021, type: 'Conference paper',
    title: 'Multiple Observation Opportunities for Trans-Neptunian Objects Part 8',
    authors: ['S. Ramsey', 'C. J. Busic', 'C. Russell', 'J. E. Lyne'],
    venue: 'Astrodynamics Specialist Conference', topic: 'Trans-Neptunian objects',
    summary: 'Conference contribution concerning multiple observation opportunities for trans-Neptunian objects. The full paper and its detailed methods will be linked here when a public version is available.',
    paperUrl: null, pdfUrl: null,
  },
  {
    id: 'tno-part-7', year: 2021, type: 'Conference paper',
    title: 'Multiple Observation Opportunities for Trans-Neptunian Objects Part 7',
    authors: ['A. Kennedy', 'J. Stophel', 'A. Warren', 'S. Wellence', 'S. Ramsey', 'J. E. Lyne'],
    venue: 'Astrodynamics Specialist Conference', topic: 'Trans-Neptunian objects',
    summary: 'Collaborative conference work on observation opportunities in the outer Solar System. Bibliographic details follow the source portfolio; no abstract or paper identifier has been supplied.',
    paperUrl: null, pdfUrl: null,
  },
  {
    id: 'titan-capture', year: 2020, type: 'Conference presentation',
    title: 'Titan Aerogravity Assist for Orbital Capture into Saturn System',
    authors: ['S. Ramsey', 'J. E. Lyne'],
    venue: 'International Planetary Probe Workshop', topic: 'Mission design',
    summary: 'A contribution on using a Titan aerogravity assist for capture into the Saturn system, connected to research on reaching an Enceladus-crossing orbit.',
    paperUrl: null, pdfUrl: null,
  },
];
export const citation = p => `${p.authors.join(', ')} (${p.year}). ${p.title}. ${p.venue}.`;
export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function resource(url, label) {
  if (!url) return `<span class="resource-pending">${label} · not yet available</span>`;
  // Accept local paths and HTTPS public URLs, excluding protocol-relative URLs.
  if (!/^https:\/\//.test(url) && !/^\/(?!\/)/.test(url)) return '';
  return `<a class="text-link" href="${escapeHTML(url)}"${label === 'PDF' ? ' type="application/pdf"' : ''}>${label === 'PDF' ? 'Open PDF' : 'Read paper'} <span aria-hidden="true">→</span></a>`;
}
export function publicationsPage() {
  return `<section class="page-intro"><p class="eyebrow">PUBLICATIONS / PAPERS & PRESENTATIONS</p><h1>Ideas explored.<br>Knowledge <em>shared.</em></h1><p class="hero-description">Conference work in outer Solar System exploration,<br>observation opportunities, and astrodynamics.</p><div class="intro-stats"><span><strong>03</strong> Selected contributions</span><span><strong>02</strong> Research directions</span></div></section>
  <section class="section publications-section"><div class="section-heading"><div><p class="eyebrow">THE RESEARCH LIBRARY</p><h2>Selected work</h2></div><p class="muted">2020—2021 · Conference contributions</p></div>
  <form class="publication-filters" role="search"><label for="paper-search">Find a publication<input id="paper-search" type="search" placeholder="Search title, author, or topic"></label><label for="paper-year">Year<select id="paper-year"><option value="all">All years</option><option>2021</option><option>2020</option></select></label><label for="paper-topic">Research area<select id="paper-topic"><option value="all">All research</option><option>Trans-Neptunian objects</option><option>Mission design</option></select></label></form>
  <p class="filter-count" id="paper-count" role="status">3 publications</p><div class="paper-list">${publications.map(p => `<article class="paper-card" id="${p.id}" data-paper="${p.id}"><div class="paper-year"><span>${p.year}</span><span class="tiny">${p.type}</span></div><div class="paper-body"><p class="eyebrow">${p.topic}</p><h2>${escapeHTML(p.title)}</h2><p class="paper-authors">${p.authors.map(escapeHTML).join(' · ')}</p><p class="paper-venue">${escapeHTML(p.venue)}</p><p class="muted">${escapeHTML(p.summary)}</p><div class="paper-resources">${resource(p.paperUrl, 'Paper link')}${resource(p.pdfUrl, 'PDF')}</div><details><summary>Citation & reference</summary><p class="citation">${escapeHTML(citation(p))}</p><button type="button" class="text-link copy-citation" data-id="${p.id}">Copy citation <span aria-hidden="true">→</span></button><span class="copy-status" role="status"></span></details></div></article>`).join('')}</div><p id="no-papers" hidden>No publications match those filters. Try another search or year.</p>
  <aside class="research-note"><strong>Paper links & PDFs.</strong> Public paper links and author-provided PDFs will appear on each entry when available. The source site does not currently supply them.</aside><div class="research-note"><strong>Research in progress.</strong> Doctoral work examines resonance structure, resonance sticking, chaotic diffusion, periodic solutions, and phase-space transport in the trans-Neptunian region. Future publications will be added as the work develops.</div></section>`;
}
