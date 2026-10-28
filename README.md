# Samantha Ramsey — Academic Portfolio

A space-themed aerospace engineering portfolio adapted from [Samantha Ramsey’s TNO Dynamics site](https://samantharamsey.github.io/tno-dynamics/): full CV, publications library, research journal, and interactive astrodynamics demonstrations.

## Run locally

Requires Node.js 22 or later. No dependency installation, credentials, database, or build step is required.

```sh
npm run dev
```

Open `http://localhost:3000` in a browser. `PORT` overrides the port. Stop with Ctrl+C.

```sh
npm test
```

Nine tests cover server-rendered content, page metadata and structured data, sitemap/robots behavior, compression, conditional caching, HTTP methods and redirects, scientific equilibrium and surface checks, and educational transfer equations.

## Pages

- `/`: biography, research directions and methodology, full printable CV, and links to the journal and publications.
- `/journal`: eight research chapters, locally rendered mathematics, responsive figures, and direct chapter anchors.
- `/simulations`: opt-in 3D Sun–Neptune zero-velocity explorer plus reference-frame, Hohmann-transfer, and elliptical-orbit animations. Each experiment explains its assumptions.
- `/publications`: searchable/filterable conference contributions, citations, and resource slots for paper links and PDFs.

All substantive text, including the CV and equations, is included in the server’s initial HTML and works without JavaScript. Interactive controls require JavaScript. The WebGL explorer additionally needs `DecompressionStream` and WebGL; unsupported browsers receive a fallback message and original-app link.

## Add papers and PDFs

Edit `src/publications.js`, the single source for publication cards, filtering, citations, and structured data:

```js
paperUrl: 'https://your-real-publisher-or-repository-url',
pdfUrl: '/assets/papers/your-paper.pdf',
```

Place the corresponding author-approved PDF in `src/assets/papers/`. Local PDFs are served as `application/pdf`. Keep fields `null` until resources exist. Missing resources display “not yet available”; the site does not generate fabricated paper links, abstracts, DOIs, or PDFs. Add entries to the same array for future contributions.

## Production SEO

Use a Node-capable host and start the server with `npm start`. Configure **`SITE_URL` to the actual public website origin**, for example `https://your-domain.com`, with no path/query/fragment. Do not use the reference site’s domain unless this application is actually deployed there.

Once configured, the server provides:

- Unique titles and descriptions on all four routes.
- Absolute canonical URLs and Open Graph/Twitter sharing metadata.
- A local 1200×630 social image and SVG favicon.
- Person, WebPage/CollectionPage, and ScholarlyArticle JSON-LD, without invented identifiers or paper URLs.
- `/sitemap.xml` with all four public routes and `/robots.txt` advertising it.
- Redirects from trailing-slash variants and `/index.html` to preferred page URLs.

Without `SITE_URL`, pages still run and remain readable/indexable, but absolute canonical/share URLs are omitted and the sitemap returns an explanatory 503. This prevents publishing a made-up or localhost domain. The host must serve the Node server: `src/index.html` is a rendering template, not a standalone static site. Search ranking/indexing and real-world Core Web Vitals require deployment measurements; these code changes do not guarantee a ranking.

After deployment, verify the public origin and sitemap, then submit the sitemap through Google Search Console/Bing Webmaster Tools if desired. Their ownership verification and submission are account actions, not performed by this project.

## Performance and accessibility

- Plotly and the compressed 161-frame mesh bank are fetched **only after clicking Load interactive 3D explorer**.
- The canvas-demo module loads as an experiment approaches the viewport.
- Teaching animations start paused. Homepage moons follow visible, depth-layered paths around a centered Neptune with a rotating atmospheric texture by default unless reduced motion is requested; the motion button can pause them. Canvas loops suspend offscreen/in hidden tabs and stop scheduling frames while paused. Ambient background motion is separately opt-in. Reduced-motion preference disables decorative CSS motion and pauses running canvas demos on preference changes.
- Journal images use WebP, responsive `srcset`/`sizes`, intrinsic dimensions, native lazy loading, and asynchronous decoding. Original PNGs remain as source assets, not the default image requests.
- KaTeX CSS is requested only by the journal. Math fonts, plotting scripts, and content are served locally; no external fonts or tracking scripts are used.
- Text assets use Brotli/gzip negotiation. ETags and conditional revalidation prevent redownloading unchanged resources without serving stale versionless files. Already-compressed meshes/fonts/images/PDFs are not recompressed.
- The interface includes skip navigation, semantic headings, keyboard-operable controls, visible focus, descriptive figure text, readable contrast, copy-feedback announcements, and a print stylesheet.

## Scientific fidelity

The local 3D explorer uses the source app’s **161 coarse preview meshes**, not its continuously recomputed high-resolution Python/Dash surfaces. The slider uses the original nonlinear Jacobi mapping; statuses reflect the selected stored frame. Physical parameters follow the source Sun/Neptune masses. L1/L2 and critical Jacobi values are solved from normalized force balance. Markers are enlarged.

Zero-velocity surfaces describe energetic accessibility, not trajectories or guaranteed transport. The reference-frame illustration exaggerates the mass ratio (`μ=0.10`) and uses the ideal triangular L4 configuration. The Hohmann demo assumes coplanar circular endpoint orbits, instantaneous burns, and `GM = r1 = 1`; its transfer time is a fraction of the inner orbit’s period. These teaching demos are separate from the sourced research results.

## Edit

- `src/views.js`: page structure, biography, and teaching-demo markup.
- `render.js`: server-rendered documents, metadata, and structured data.
- `src/publications.js`: publication records and paper/PDF resource links.
- `src/content/cv.html`, `src/content/research.html`: CV and mathematical journal.
- `src/app.js`: progressive enhancement and lazy module loading.
- `src/demos.js`, `src/dynamics.js`, `src/explorer.js`: animations and scientific models.
- `src/space.css`: current visual design, typography, and responsive behavior; `src/style.css` contains base/document styles.
- `src/assets/`: figures, meshes, social card, favicon, and PDF directory.

Research mathematics was prerendered with KaTeX 0.19.1. Keep accessible MathML and visual HTML together when editing. See `SOURCES.md` for provenance and vendor licenses.
