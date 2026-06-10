import type { NextConfig } from "next";
import { resolve } from "node:path";

// @lit-labs/nextjs uses imports-loader to inject `enable-lit-ssr.js` into
// app/ files, which patches React's createElement/JSX to emit Declarative
// Shadow DOM for Lit components during server rendering.
// Note: This plugin requires webpack — Turbopack is not supported because
// imports-loader is a webpack-specific loader.
import withLitSSRPlugin from "@lit-labs/nextjs";
const withLitSSR = withLitSSRPlugin();

const nm = (...parts: string[]) =>
  resolve(import.meta.dirname, "node_modules", ...parts);

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Next.js treats node_modules as pre-compiled by default and doesn't run
  // them through webpack loaders. Lit and RHDS ship as ES modules with
  // features (decorators, top-level await, import.meta) that Next.js's
  // server runtime can't consume raw. transpilePackages tells webpack to
  // process these packages through the same loader pipeline as app code.
  // If a Lit-ecosystem package is missing here, you'll get "Module not found"
  // or "Unexpected token" errors on the server.
  transpilePackages: [
    "@rhds/elements",
    "@rhds/tokens",
    "@rhds/icons",
    "@lit/react",
    "@lit/reactive-element",
    "@lit-labs/ssr-react",
    "@lit-labs/ssr-client",
    "@lit-labs/ssr",
    "@lit-labs/ssr-dom-shim",
    "lit",
    "lit-html",
    "lit-element",
    "@lit/context",
    "@patternfly/pfe-core",
  ],

  // Why webpack: Turbopack (Next.js's Rust bundler, enabled via --turbopack)
  // cannot be used because @lit-labs/nextjs uses imports-loader to inject
  // enable-lit-ssr.js into app/ files. Turbopack has no webpack loader API.
  // The Lit team would need to replace imports-loader with an SWC transform
  // plugin and ship a new @lit-labs/nextjs version for Turbopack support.
  // See: https://github.com/lit/lit/issues/5209
  webpack(config, { isServer }) {
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    const alias = config.resolve.alias as Record<string, string>;

    // Force @rhds/icons to resolve from our node_modules. Without this,
    // webpack can fail to resolve the package when it's referenced as a
    // transitive dependency from within @rhds/elements.
    alias["@rhds/icons"] = nm("@rhds/icons");

    if (isServer) {
      // pfe-core's ssr-shims.js imports installWindowOnGlobal from
      // @lit-labs/ssr/lib/dom-shim.js, which transitively imports node-fetch.
      // node-fetch uses node: protocol imports (node:fs, node:http) that
      // webpack cannot resolve. This alias redirects to our adapter that
      // provides the same function but sources DOM shims from
      // @lit-labs/ssr-dom-shim (no node-fetch dependency).
      // See: src/lib/lit-dom-shim-adapter.js
      alias["@lit-labs/ssr/lib/dom-shim.js"] = resolve(
        import.meta.dirname,
        "src/lib/lit-dom-shim-adapter.js",
      );
    }

    // Several Lit packages use top-level await (e.g. for lazy icon loading).
    // webpack doesn't enable this by default — without it, the build fails
    // with "Module parse failed: Cannot use keyword 'await' outside an
    // async function".
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };

    // RHDS components use top-level await (e.g. rh-icon lazy loading) which
    // webpack supports (above) but still warns about because the default
    // target doesn't advertise async/await support. The warning is noise.
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module: /node_modules\/@rhds/,
        message: /topLevelAwait/,
      },
    ];

    if (isServer) {
      // Inject ssr-shims into every server entry point so DOM globals
      // (document, window, etc.) are available before any component module
      // runs. Without this, `next build`'s prerender worker can evaluate
      // combobox-controller.js (which accesses document at static field
      // init time) before instrumentation's register() has run.
      const origEntry = config.entry;
      config.entry = async () => {
        const entries = await (typeof origEntry === 'function' ? origEntry() : origEntry);
        const shimPath = resolve(
          import.meta.dirname,
          "src/lib/lit-dom-shim-adapter.js",
        );
        for (const [key, entry] of Object.entries(entries)) {
          if (key.startsWith('pages/') || key.startsWith('app/')) {
            if (Array.isArray(entry)) {
              if (!entry.includes(shimPath)) entry.unshift(shimPath);
            } else if (typeof entry === 'object' && entry !== null) {
              const entryObj = entry as { import?: string[] };
              if (Array.isArray(entryObj.import) && !entryObj.import.includes(shimPath)) {
                entryObj.import.unshift(shimPath);
              }
            }
          }
        }
        return entries;
      };

      // Lit ships dual entry points via package.json "exports" conditions:
      //   - "default"/"browser" → browser versions that set isServer=false
      //   - "node" → SSR versions that set isServer=true and use DOM shims
      //
      // Next.js doesn't include "node" in the server compiler's
      // resolve.conditionNames, so webpack never matches Lit's "node"
      // exports and falls through to the browser entry points. Adding
      // "node" makes webpack resolve the SSR-safe versions natively.
      // "..." preserves webpack's built-in defaults (webpack, module, etc.).
      // See: https://webpack.js.org/configuration/resolve/#resolveconditionnames
      // See: https://nodejs.org/api/packages.html#conditional-exports
      config.resolve.conditionNames = ["node", "..."];
    }

    return config;
  },
};

export default withLitSSR(nextConfig);
