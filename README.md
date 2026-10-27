# Orbital — Samantha Ramsey

A space-themed aerospace engineering portfolio adapted from [Samantha Ramsey’s TNO Dynamics site](https://samantharamsey.github.io/tno-dynamics/). Includes a full CV, publications, a mathematical research journal, and interactive Sun–Neptune zero-velocity surfaces.

## Run locally

Requires Node.js 22 or later. No dependency installation, credentials, database, or build step is needed.

```sh
npm run dev
```

The server listens on port 3000; open `http://localhost:3000` in your browser. Override with `PORT` if needed. Routes: `/`, `/journal`, `/simulations`. Stop with Ctrl+C.

```sh
npm test
```

Five tests cover HTTP routes and assets, inaccessible private files, Sun–Neptune equilibrium force balance, critical energy levels, all 161 mesh frames, and their nonlinear energy mapping.

## Pages

- **Overview:** biography, contact links, education, engineering experience, research and teaching, skills, certifications, awards, and publications. Print / save CV uses a print stylesheet and the browser print dialog.
- **Research journal:** eight chapters, including CR3BP assumptions, coordinate systems, equations of motion, Jacobi integral, equilibria, accessible regions, numerical verification, and future TNO research. Equations are prerendered with KaTeX; figures and fonts are local.
- **Simulations:** two independently rotatable/zoomable 3D zero-velocity-surface views, a Jacobi-constant slider, gateway statuses, and a pausable energy sweep. Includes the original portfolio’s two-body orbit demo as a separate foundational illustration.

The 3D explorer needs WebGL and a modern browser with `DecompressionStream`. On unsupported browsers it displays an explanation and links to the original high-resolution explorer. Its energy sweep only runs when requested. The two-body animation starts paused when reduced motion is preferred.

## Scientific fidelity

The local surface explorer uses the source app’s **161 precomputed preview meshes**, not its Python/Dash backend or continuously recomputed high-resolution surfaces. Slider states use the source’s nonlinear Jacobi-constant mapping. Displayed values describe the selected stored frame. The mass ratio comes from the source’s Sun and Neptune masses. L1 and L2 are solved from the normalized force balance, and their critical Jacobi constants determine the displayed gateway statuses. Markers are enlarged for visibility.

Zero-velocity surfaces bound energetic accessibility; they are not trajectories and do not guarantee transit through an open gateway. Consult the original app for higher-resolution surfaces, and the research journal for the model’s assumptions and numerical limitations.

## Edit

- Page structure and biography: `src/app.js`
- CV, journal, publications: `src/content/*.html`
- Scientific parameters and mesh-bank parser: `src/dynamics.js`
- 3D controls and rendering: `src/explorer.js`
- Design and print styles: `src/style.css`
- Figures and precomputed data: `src/assets/`

Research HTML was adapted from the source Markdown; mathematics was rendered with KaTeX 0.19.1. Keep equations’ accessible MathML and visual HTML together when editing. See `SOURCES.md` for provenance and vendor versions.

Google Fonts are optional; system fallbacks work offline. Research content, math fonts, Plotly, and surface data are served locally. Deployment requires a Node process running `npm start`, or a static host configured to serve `src/index.html` for all three page routes and other `src` files at the root.
