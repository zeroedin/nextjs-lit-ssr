# nextjs-litssr

A demo app that server-side renders [Lit](https://lit.dev/) web components in [Next.js](https://nextjs.org/) (App Router) with [Declarative Shadow DOM](https://developer.chrome.com/docs/css-ui/declarative-shadow-dom). All UI components come from the [Red Hat Design System](https://ux.redhat.com/) (`@rhds/elements`), wrapped for React via `@lit/react`.

## Project structure

```
src/
  app/                  # Next.js App Router pages
  components/
    rhds/               # 'use client' re-exports of @rhds/elements React wrappers
    shell/              # App shell (nav, footer)
    pages/              # Page-level components
  data/                 # Mock data and API helpers
  lib/
    lit-dom-shim-adapter.js   # DOM shim without node-fetch
    types.ts
  instrumentation.ts    # SSR shim bootstrap
next.config.ts          # Webpack config, Lit SSR plugin, aliases
patches/                # patch-package patches for @rhds/elements
```

## What's in the box

- **Next.js 15** with the App Router
- **`@lit-labs/nextjs`**: webpack plugin that injects Lit SSR support into server rendering
- **`@rhds/elements`** React wrappers, re-exported from `src/components/rhds/` as `'use client'` modules
- **DOM shim adapter** (`src/lib/lit-dom-shim-adapter.js`): replaces `@lit-labs/ssr`'s DOM shim (see [DOM shim adapter](#dom-shim-adapter))
- **Instrumentation** (`src/instrumentation.ts`): loads SSR shims and patches globals so Lit components and Next.js DevTools coexist on the server (see [Instrumentation](#instrumentation))
- **`patch-package`**: applies patches in `patches/` on `postinstall` (see [Patches](#patches))

### Routes

| Path | Description |
|---|---|
| `/` | Dashboard with stats cards |
| `/products` | Product catalog with detail view (`/products/[id]`) |
| `/orders` | Orders table |
| `/users` | User list |
| `/resources` | Resources with subnav (podcast, video) |
| `/settings` | Settings panel |

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** Run `npm run dev` without the `--turbopack` flag. See [Key constraints](#key-constraints) for details.

## Building for production

```bash
npm run build
npm start
```

## Key constraints

- **Webpack only (Next.js 15).** `@lit-labs/nextjs` v0.2.4 relies on `imports-loader`, a webpack-specific loader. Turbopack support has been merged upstream ([lit/lit#5342](https://github.com/lit/lit/pull/5342), closes [lit/lit#5209](https://github.com/lit/lit/issues/5209)) but has not been published to npm yet. Watch for a new `@lit-labs/nextjs` release to use Turbopack with Next.js 16.
- **`transpilePackages`.** Lit and RHDS packages ship as ES modules with decorators and top-level `await`. List them in `transpilePackages` in `next.config.ts` or the server build fails with "Module not found" or "Unexpected token" errors.
- **`"node"` condition.** The server compiler's `resolve.conditionNames` includes `"node"` so webpack resolves Lit's SSR-safe entry points instead of falling through to browser bundles.
- **DOM shim timing.** Some RHDS controllers access `document` at static field init time, before `register()` runs. The shim adapter self-initializes on import, and `next.config.ts` injects it into server entry points to guarantee globals exist early enough.

## DOM shim adapter

`src/lib/lit-dom-shim-adapter.js`

Lit web components expect browser APIs like `document`, `window`, and `HTMLElement`. Node.js has none of these. To render Lit components on the server, you need fake versions of these APIs, called DOM shims, so component code can run without crashing.

Lit provides a DOM shim (`@lit-labs/ssr/lib/dom-shim.js`), but it drags in `node-fetch` as a dependency. `node-fetch` v3 uses `node:` protocol imports (`node:fs`, `node:http`) that webpack 5 cannot bundle ([webpack#13290](https://github.com/webpack/webpack/issues/13290), [node-fetch#1414](https://github.com/node-fetch/node-fetch/issues/1414)). The build fails with `UnhandledSchemeError` before anything can render. No upstream Lit issue documents this specific combination.

The adapter replaces Lit's DOM shim with one that provides the same fake browser APIs but pulls them from `@lit-labs/ssr-dom-shim`, a lighter package with no `node-fetch` dependency. A webpack alias in `next.config.ts` redirects all imports of `@lit-labs/ssr/lib/dom-shim.js` to the adapter, so nothing in the dependency tree ever reaches `node-fetch`.

> **Upstream fix.** The root cause is in `@patternfly/pfe-core`'s `ssr-shims.js`, which imports `installWindowOnGlobal` from `@lit-labs/ssr/lib/dom-shim.js`. That module pulls in `node-fetch` for its `fetch` shim — functionality `ssr-shims.js` doesn't use. If `pfe-core` imported from `@lit-labs/ssr-dom-shim` instead (which exports the same DOM shim classes without the `node-fetch` dependency), the `node:` protocol error would disappear and the webpack alias workaround in this project would no longer be necessary.
>
> The current `pfe-core` setup works fine for web components outside of Next.js. The issue only manifests here because Next.js bundles server-side code with webpack rather than running it directly in Node.js. In a plain Node runtime, `node-fetch`'s `node:` protocol imports resolve natively. webpack 5 treats `node:` as an unhandled scheme and fails at build time. This is a PatternFly Elements issue and can be looked at upstream.

### createElement enrichment

The adapter also solves a second problem. Lit's DOM shim creates minimal fake elements. They have just enough API surface for Lit's own rendering. Next.js DevTools (bundled React DOM) expects more: it calls `setAttribute`, `style`, and `appendChild` on elements during server rendering. When those methods are missing, every request crashes with a `TypeError`.

The adapter wraps `document.createElement` so every element it returns has these methods. But keeping that wrapper in place is its own challenge.

### Why the wrapper keeps disappearing

`pfe-core` (the foundation library under RHDS components) ships its own SSR shims. Part of that setup is assigning `document.createElement` to its own implementation. This is normal module code. In Node.js or a browser, the module loads once and the assignment runs once. No problem.

Next.js uses webpack for bundling, and this project lists `@patternfly/pfe-core` in `transpilePackages` so webpack can process it. Webpack's code splitting can duplicate a module across multiple bundle chunks. Each chunk gets its own copy of `pfe-core`'s SSR shims, and each copy runs `document.createElement = myVersion` independently when it loads. The module was written to run once. Webpack makes it run several times.

Each of those runs overwrites whatever `document.createElement` was set to before. If the adapter sets its enriched wrapper with a normal assignment, the next chunk to load replaces it. The wrapper is gone, the methods are missing, and the `TypeError` crashes return.

The adapter works around this by using `Object.defineProperty` instead of a normal assignment. It defines a custom setter and getter on `document.createElement`. When any chunk writes `document.createElement = myVersion`, the setter quietly stores that function. But when anything reads `document.createElement`, the getter returns the adapter's wrapper around the stored function. The chunks think they're replacing `createElement`. The adapter keeps its wrapper on top.

## Instrumentation

`src/instrumentation.ts`

Next.js calls `register()` in this file before the server starts handling requests. It does three things:

1. **Loads SSR shims.** Imports `@patternfly/pfe-core/ssr-shims.js` so DOM globals (`document`, `window`, `HTMLElement`) exist before any RHDS component module runs. Some controllers (e.g. `ComboboxController`) access `document` at static field init time, which fires during import before any lazy shim can execute.

2. **Restores `window`.** `installWindowOnGlobal` sets `window = undefined` on `globalThis` ([lit#2391](https://github.com/lit/lit/issues/2391), [PR #2453](https://github.com/nicolo-ribaudo/lit/commit/2453)). Next.js DevTools reads `window` properties (e.g. `window._nextjsDevtoolsStyleCache`) without a `typeof` guard, so `undefined.something` throws `TypeError`. Setting `window = globalThis` gives those reads a valid object.

3. **Patches remaining gaps.** Setting `window = globalThis` makes Next.js run browser-only code paths during SSR. The file stubs `document.querySelector` (Next.js error overlay lookup) and `document.documentElement` (React DOM `namespaceURI` context).

## Patches

`patches/@rhds+elements+4.1.4.patch`

Two bugs in `rh-progress-stepper` that only surface in the Next.js integration. Neither has been fixed upstream as of v4.2.2. Both are applied via `patch-package` on `npm install`.

These components work fine as standard web components and under Lit's own SSR. The bugs appear because of a lifecycle difference in how `@lit-labs/ssr-react` renders components.

Lit's own SSR deliberately skips `connectedCallback` on the server. Their [authoring docs](https://lit.dev/docs/ssr/authoring/) state that only `constructor()`, `render()`, and `willUpdate()` run during SSR. `connectedCallback`, `update`, `updated`, and `firstUpdated` are all skipped. This is intentional — component authors often call browser APIs or depend on reactive update timing in these methods.

`@lit-labs/ssr-react` takes a different approach. Its `render-custom-element.js` always calls `renderer.connectedCallback()` (line 62), then immediately calls `renderShadow()`. This means code in `connectedCallback` runs during SSR, but the reactive update cycle that normally follows it in a browser does not. Components that do setup work in `connectedCallback` and rely on the reactive cycle to finish that work before the first render break under this path.

No upstream issue has been filed for this inconsistency. The closest is [lit/lit#5175](https://github.com/lit/lit/issues/5175), which added an opt-in `connectedCallback` to Lit's own SSR — reinforcing that calling it is not the default.

React's hydration also compares server and client markup strictly, so discrepancies that browsers silently normalize (like an empty CSS class) become hydration mismatch warnings.

**`rh-progress-step`: missing icon on server render.** `connectedCallback` sets `this.role` but never calls `this.computeIcon()`. In a browser, the reactive update computes the icon before paint. Under `ssr-react`, `connectedCallback` runs but the reactive update never fires, so the icon markup is missing from the Declarative Shadow DOM output. The patch adds `this.computeIcon()` to `connectedCallback`.

**`rh-progress-stepper`: empty string as CSS class.** `currentState` initializes to `''`. The `render` method passes `[currentState]: true` into `classMap`, which adds an empty string as a CSS class. Browsers ignore this. React's hydration flags it as a server/client mismatch because the client normalizes the class list. The patch changes the initial value to `undefined` and guards the `classMap` entry so it only includes `currentState` when truthy.
