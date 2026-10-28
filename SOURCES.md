# Content and visualization provenance

The portfolio’s research content is adapted from Samantha Ramsey’s [TNO Dynamics website](https://samantharamsey.github.io/tno-dynamics/) and [source repository](https://github.com/samantharamsey/tno-dynamics), inspected at commit `4f6d14163d9041be275eed3c783ee0a64b5754ad`.

- Biography and research themes: `docs/index.md`, `docs/about.md`.
- Curriculum vitae: `docs/cv.md` (dates and ongoing appointments reflect the source, not independently verified employment status).
- Conference contributions: `docs/publications.md`.
- Full journal and scientific figures: `docs/research.md`, `docs/assets/images/research/cr3bp/`.
- Stored surface meshes: `apps/neptune_zvs/assets/preview_frames.dat`, generated upstream by `apps/neptune_zvs/generate_preview_bank.py`.
- Mesh-bank decoding is adapted from `apps/neptune_zvs/assets/preview_bank.js`.
- Physical parameters, energy spacing, and plot geometry follow `apps/neptune_zvs/app.py` and `src/cr3bp.py`.

The original research authorship remains Samantha Ramsey’s. This adaptation changes presentation and adds browser-side rendering of the existing preview bank; it does not claim new research results. The source repository did not contain a license file at the inspected commit; no additional license for its content is asserted here.

The precomputed meshes are coarse moving-preview frames. The original Python/Dash app additionally computes refined meshes on demand. This portfolio does not include that backend. The original app remains linked at https://tno-dynamics.onrender.com/ .

## Included third-party software

- Plotly gl3d distribution **4.1.2**: `src/vendor/plotly-gl3d.min.js`; MIT license in `src/vendor/PLOTLY-LICENSE`.
- KaTeX **0.19.1**: math HTML generated at authoring time, local CSS and fonts in `src/vendor/katex/`; MIT license in `src/vendor/KATEX-LICENSE`.

Content conversion used Marked at authoring time. No conversion tools are needed to run the site. The original two-body animation and the portfolio design are separate from the sourced TNO material.

## Presentation and performance additions

The dedicated publications library in `src/publications.js` follows the same source bibliography. No new paper URLs, PDFs, abstracts, or DOIs have been invented. Responsive WebP derivatives of the original figures preserve the source figures and are used for delivery; original PNGs remain in the repository.

The new reference-frame/L4 schematic and normalized Hohmann-transfer animation are educational illustrations authored for this portfolio. They are not additional results attributed to the source research. Their assumptions and normalized units appear alongside the controls. The nebula/starfield presentation and social-sharing card are also portfolio additions.

## Neptune moon elements

Factual orbital elements are transcribed from [CelestiaContent solarsys.ssc](https://github.com/CelestiaProject/CelestiaContent/blob/e6d05411f1ab8aecbd8d72173711ae37f228deaf/data/solarsys.ssc), Ecliptic J2000, epoch JD 2447763.5 (25 August 1989). The Triton elements are the source’s documented elliptical fallback; the custom precessing orbit is not included. Proteus uses the same file’s elliptical elements. Larissa and Galatea accompany Triton and Proteus in the single-view animation and use `data/minormoons.ssc` from the same commit, reference frame, and epoch. NASA/JPL source pages were inaccessible from this environment, so no direct verification against their current ephemerides is claimed. The factual elements, common frame, source epoch, and propagation limits are exposed in the on-page model details.
