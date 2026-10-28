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

Sixteen tests cover server-rendered content, page metadata and structured data, sitemap/robots behavior, compression, conditional caching, HTTP methods and redirects, scientific equilibrium and surface checks, and educational transfer equations.

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

For a Node-capable host, start the server with `npm start`. Configure **`SITE_URL` to the actual public website origin**, for example `https://your-domain.com`, with no path/query/fragment. Do not use the reference site’s domain unless this application is actually deployed there.

Once configured, the server provides:

- Unique titles and descriptions on all four routes.
- Absolute canonical URLs and Open Graph/Twitter sharing metadata.
- A local 1200×630 social image and SVG favicon.
- Person, WebPage/CollectionPage, and ScholarlyArticle JSON-LD, without invented identifiers or paper URLs.
- `/sitemap.xml` with all four public routes and `/robots.txt` advertising it.
- Redirects from trailing-slash variants and `/index.html` to preferred page URLs.

Without `SITE_URL`, pages still run and remain readable/indexable, but absolute canonical/share URLs are omitted and the sitemap returns an explanatory 503. This prevents publishing a made-up or localhost domain. For Node hosting, serve the Node server. For GitHub Pages or other static hosting, use the export below; do not publish the repository root or the raw `src/index.html` template. Search ranking/indexing and real-world Core Web Vitals require deployment measurements; these code changes do not guarantee a ranking.

After deployment, verify the public origin and sitemap, then submit the sitemap through Google Search Console/Bing Webmaster Tools if desired. Their ownership verification and submission are account actions, not performed by this project.

## Performance and accessibility

- Plotly and the compressed 161-frame mesh bank are fetched **only after clicking Load interactive 3D explorer**.
- The canvas-demo module loads as an experiment approaches the viewport.
- Teaching animations start paused. Homepage moons and Neptune’s cloud texture play continuously, with no hero pause controls. Canvas loops suspend offscreen/in hidden tabs and stop scheduling frames while paused. Ambient background motion is separately opt-in. Reduced-motion preference disables decorative CSS motion and pauses running canvas demos on preference changes.
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

The Neptune illustration uses soft cloud features moving across a projected spherical surface under fixed lighting, rather than artificial atmospheric stripes. Its moon paths now use the dated Keplerian model described below.

## GitHub Pages deployment

The repository includes `.github/workflows/pages.yml`. It tests and builds the site, then deploys the generated `dist/` artifact to GitHub Pages after pushes to `main`.

One-time GitHub setting: **Repository → Settings → Pages → Build and deployment → Source → GitHub Actions**. Then run **Actions → Deploy academic portfolio to GitHub Pages → Run workflow**, or push to `main`. The public site is https://existing-prog.github.io/testiing/ . The environment must allow the `main` branch to deploy to `github-pages`.

The workflow gets the actual public URL from GitHub’s Pages configuration. Assets, navigation, canonical URLs, structured data, and the sitemap support the repository subpath. All four pages are generated as real HTML directories, so direct links and reloads work without a Node runtime. Dynamic import URLs and the 3D mesh/Plotly URLs resolve relative to their JavaScript modules.

Build manually with:

```sh
npm run build
```

Output is `dist/` (ignored by Git). The default target is `https://existing-prog.github.io/testiing/`; `PUBLIC_SITE_URL` overrides it, including a project path or custom domain. Publish the **contents of `dist/`**, not `src/` or the repository root. A `.nojekyll` file prevents unintended Jekyll processing. GitHub Pages controls compression and cache headers in production; the Node server’s header logic is not executed there. A project-level `robots.txt` cannot set the host-wide robots policy, but the project sitemap is available at `/testiing/sitemap.xml`.

## Neptune moon orbital model

The hero continuously animates Triton, Proteus, Larissa, and Galatea using a consistent set of Ecliptic J2000 elements at JD 2447763.5 (1989-08-25). Elements come from CelestiaContent `data/solarsys.ssc` and `data/minormoons.ssc`, commit `e6d05411f1ab8aecbd8d72173711ae37f228deaf`. Triton uses the documented elliptical fallback. These dated two-body orbits are not a present-day ephemeris.

Each orbit uses a normalized powered-log semimajor-axis map. With a fixed physical reference of 1,000,000 km, `u = clamp(ln(a/RNeptune) / ln(reference/RNeptune), 0, 1)`. The displayed semimajor axis is `0.38 + 0.62*u³` in fixed viewport units. Neptune has a fixed display radius of `0.30` units. The added clearance keeps the enlarged globe readable. Increasing the exponent moves every displayed moon inward because each normalized value is below 1, including Triton. The view is not auto-fitted afterward, which would undo the intended compression. Eccentricities and orbital planes are preserved by uniformly resizing each orbit.

Periods return to gentle logarithmic scaling: `15 * ln(1 + P/Pmin) / ln(1 + PTriton/Pmin)` seconds. Triton remains at 15 seconds, and the inner moons are easier to track than with cubed periods. These are deliberately distorted display distances and periods; marker sizes are enlarged.

The enlarged hero has no pause button, speed controls, or on-page model-details section. Only moon names and the logarithmic scale/body-marker caption remain. The header ambient-motion button is removed. The hero plays continuously, as explicitly requested; rendering suspends only while the document is hidden or the illustration is offscreen, resuming when visible. Research-demo controls elsewhere are unchanged.

The static build versions JS/CSS filenames and rewrites module imports to avoid stale cached animation modules after deployment. The scholarly profile identifies Samantha Ramsey as a Ph.D. candidate in Aerospace Engineering, including visible text, CV, and JSON-LD.

The hero uses a closer fixed framing (world units scale to the smaller of 80% of the illustration width and 64% of its height) to show Neptune at approximately the earlier large-portrait size. Camera azimuth 226°, elevation 28°, and roll −45° show the orbits obliquely: Triton and Proteus have apparent minor/major ratios around 0.46 and 0.40, with major axes separated by about 24°. Orbital elements and the approved framing are unchanged. Triton’s track and marker receive a matching violet highlight. The normalized distance map and logarithmic periods are unchanged.
