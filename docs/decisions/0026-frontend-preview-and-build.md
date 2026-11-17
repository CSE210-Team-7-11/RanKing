---
status: accepted
date: 2026-11-12
---

# ADR-0026 | Use Vite for frontend preview and asset builds

## Context and Problem Statement

Frontend contributors write HTML, CSS, and TypeScript and work asynchronously. They need to pull a branch and preview changes with automatic browser updates. Production also needs JavaScript compiled from the frontend TypeScript. The choice is whether one tool should provide both preview and asset builds or the team should connect separate tools.

## Considered Options

- Vite for preview and production asset builds.
- Browsersync with a separate compiler or bundler.
- Web Dev Server with a separate production build setup.

## Decision Outcome

Use Vite because it supplies preview and production asset builds in one setup for plain HTML, CSS, and TypeScript. It does not require React or another UI framework. The preview updates styles in place, allowing a contributor to see CSS changes without a page reload.

### Consequences

- Good, because one tool handles frontend preview and production assets, reducing the separate configuration needed to keep the two paths aligned.
- Bad, because Vite transforms TypeScript without type checking it. `tsc` remains a separate required check even when preview works.

## Pros and Cons of the Options

### Vite

- Good, because it provides both development updates and a production asset build with TypeScript transformation.
- Bad, because the team still needs a separate compiler check for TypeScript correctness.

### Browsersync with a separate compiler or bundler

- Good, because it watches source files, refreshes connected browsers, and can inject CSS changes without a full page reload. [Browsersync file watching](https://browsersync.io/docs/options#option-files)
- Bad, because the team would need to choose and connect a TypeScript compilation and production build setup.

### Web Dev Server with a separate production build setup

- Good, because it serves native JavaScript modules and automatically reloads on file changes. Plugins can add transformations and hot module replacement. [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/)
- Bad, because the team must configure a separate production build. Updates without page reloads also require an appropriate HMR integration; the basic HMR plugin requires modules that consume its API. [HMR support](https://modern-web.dev/docs/dev-server/plugins/hmr/)

## More Information

Node's watch mode restarts a Node process when its inputs change. It can support backend development but is not a complete alternative to a browser preview and frontend build setup. Comparing it alone with Vite would compare different jobs.

[Vite's TypeScript documentation](https://vite.dev/guide/features#typescript) distinguishes transformation from type checking. The configured frontend entry point is `web/index.html`; an integrated app startup command depends on the application entry points the team will implement.
