import { readFile } from 'node:fs/promises';
import { overview, journal, simulations } from './src/views.js';
import { publicationsPage, publications, escapeHTML } from './src/publications.js';
const root = new URL('./src/', import.meta.url);
export const pages = {
 '/': {title:'Samantha Ramsey | Astrodynamics & Outer Solar System Research', description:'Explore Samantha Ramsey’s research in trans-Neptunian dynamics, aerospace engineering experience, publications, and interactive orbital mechanics demonstrations.'},
 '/journal': {title:'CR3BP Research Journal | Samantha Ramsey', description:'Derivations, reference frames, Jacobi integral, zero-velocity geometry, and numerical verification for Sun–Neptune circular restricted three-body dynamics.'},
 '/simulations': {title:'Interactive Astrodynamics Simulations | Samantha Ramsey', description:'Explore Sun–Neptune zero-velocity surfaces, rotating reference frames, Hohmann transfers, and elliptical orbits with interactive scientific visualizations.'},
 '/publications': {title:'Publications & Conference Papers | Samantha Ramsey', description:'Browse Samantha Ramsey’s conference contributions on trans-Neptunian observation opportunities and Titan aerogravity-assisted Saturn capture, with citations and paper resources.'},
};
export function normalizeSiteUrl(value) {
 if(!value) return '';
 const url=new URL(value);
 if(!['http:','https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname!=='/') throw new Error('SITE_URL must be an HTTP(S) origin, such as https://your-domain.com (no path, credentials, query, or fragment).');
 return url.origin;
}
export function structuredData(route, origin) {
 const person={'@type':'Person',name:'Samantha Ramsey',jobTitle:'Ph.D. student in Aerospace Engineering',affiliation:{'@type':'CollegeOrUniversity',name:'University of Tennessee'},sameAs:['https://github.com/samantharamsey','https://samantharamsey.github.io/tno-dynamics/']};
 const graph=[person,{'@type':route==='/publications'?'CollectionPage':'WebPage',name:pages[route].title,description:pages[route].description,...(origin?{url:origin+(route==='/'?'/':route)}:{}),inLanguage:'en',about:person}];
 if(route==='/publications') for(const p of publications) graph.push({'@type':'ScholarlyArticle',headline:p.title,datePublished:String(p.year),author:p.authors.map(name=>({'@type':'Person',name})),isPartOf:{'@type':'CreativeWork',name:p.venue},...(p.paperUrl?{url:p.paperUrl}:{}),...(p.pdfUrl?{encoding:{'@type':'MediaObject',contentUrl:origin&&p.pdfUrl.startsWith('/')?origin+p.pdfUrl:p.pdfUrl,encodingFormat:'application/pdf'}}:{})});
 return {'@context':'https://schema.org','@graph':graph};
}
async function document(name) { return readFile(new URL(`content/${name}.html`,root),'utf8'); }
export async function renderPage(route, origin='') {
 let body=route==='/journal'?journal():route==='/simulations'?simulations():route==='/publications'?publicationsPage():overview();
 if(route==='/') body=body.replace(/<div id="cv-content"[\s\S]*?<\/div>/,`<div id="cv-content" class="document-content">${await document('cv')}</div>`);
 if(route==='/journal') body=body.replace(/<article id="research-content"[\s\S]*?<\/article>/,`<article id="research-content" class="document-content research-document">${await document('research')}</article>`);
 const meta=pages[route], canonical=origin ? origin+(route==='/'?'/':route) : '';
 const head=`<title>${escapeHTML(meta.title)}</title>
 <meta name="description" content="${escapeHTML(meta.description)}">
 <meta name="robots" content="index,follow,max-image-preview:large">
 <meta name="author" content="Samantha Ramsey">
 <meta name="theme-color" content="#070717">
 <meta property="og:type" content="website">
 <meta property="og:site_name" content="Samantha Ramsey · Orbital">
 <meta property="og:locale" content="en_US">
 <meta property="og:title" content="${escapeHTML(meta.title)}">
 <meta property="og:description" content="${escapeHTML(meta.description)}">
 <meta name="twitter:card" content="summary_large_image">
 <meta name="twitter:title" content="${escapeHTML(meta.title)}">
 <meta name="twitter:description" content="${escapeHTML(meta.description)}">
 ${canonical?`<link rel="canonical" href="${escapeHTML(canonical)}"><meta property="og:url" content="${escapeHTML(canonical)}"><meta property="og:image" content="${origin}/assets/social-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Samantha Ramsey — research beyond Neptune"><meta name="twitter:image" content="${origin}/assets/social-card.png">`:''}
 <script type="application/ld+json">${JSON.stringify(structuredData(route,origin)).replaceAll('<','\\u003c')}</script>
 ${route==='/journal'?'<link rel="stylesheet" href="/vendor/katex/katex.min.css">':''}`;
 let template=await readFile(new URL('index.html',root),'utf8');
 template=template.replace('<!-- PAGE_METADATA -->',head).replace('<!-- PAGE_CONTENT -->',body);
 template=template.replace(`data-route="${route}"`,`data-route="${route}" aria-current="page"`);
 return template;
}
