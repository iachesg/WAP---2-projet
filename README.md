# WAP — Frontend (React + TypeScript + Vite)

This repository contains a small React + TypeScript application scaffolded with Vite.

**Quick goal:** run the app locally, build for production, and preview the production bundle.

**Prerequisites**

- Node.js 18 or newer (recommended). Verify with:

```bash
node --version
```
- Git, if you plan to clone the repo.

**Install dependencies**

Open the project folder in a terminal and run:

```bash
npm install
```

This installs dependencies listed in [package.json](package.json).

**Run the app in development mode**

Start the Vite dev server with:

```bash
npm run dev
```

By default Vite serves the app on http://localhost:5173 — open that URL in your browser.

If the port is already in use, Vite will suggest an alternative port in the terminal.

**Build for production**

Create an optimized production build with:

```bash
npm run build
```

The output will be placed in the `dist/` directory.

**Preview the production build locally**

After building, verify the production bundle with the preview server:

```bash
npm run preview
```

This runs `vite preview` and serves the contents of `dist/` so you can test the production build locally.

**Linting**

Run ESLint across the project with:

```bash
npm run lint
```

Note: the repository includes ESLint config files; fixable problems may be reported.

**Common issues & tips**

- If you see TypeScript type errors when building, ensure the installed TypeScript version matches the one in `devDependencies`.
- If assets like maps (Leaflet) don't display correctly, confirm the app's CSS is loaded (see `src/styles`).
- If the dev server fails to start, check for an existing process on the same port and kill it, or accept the alternate port Vite offers.

**Useful files**

- Project entry: [src/main.tsx](src/main.tsx)
- App component: [src/App.tsx](src/App.tsx)
- Routes / pages: [src/pages](src/pages)
- Build & scripts: [package.json](package.json)

**Example quick workflow**

```bash
# clone the repo (if needed)
git clone <your-repo-url>
cd <repo-folder>

# install and run
npm install
npm run dev
```

If you'd like, I can also add a brief developer section showing how to run tests or add environment variables — tell me what you prefer.
