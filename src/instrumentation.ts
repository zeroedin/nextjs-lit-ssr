// Load pfe-core's SSR shims early — before any component modules are imported.
// pfe-core normally loads these lazily via rh-icon/ssr.js, but controllers like
// ComboboxController call document.createElement at static field init time,
// which runs during import before the lazy shim has a chance to execute.
//
// The import resolves through a webpack alias: pfe-core's ssr-shims.js imports
// installWindowOnGlobal from @lit-labs/ssr/lib/dom-shim.js, which we redirect
// to src/lib/lit-dom-shim-adapter.js to avoid the node-fetch dependency chain
// that breaks webpack bundling. See next.config.ts for the alias.
//
// The adapter also installs a createElement trap that enriches all elements
// with setAttribute/style/appendChild — needed by Next.js DevTools (bundled
// React DOM). The trap uses defineProperty so it survives pfe-core's
// unconditional createElement overrides across multiple webpack chunks.
// See: src/lib/lit-dom-shim-adapter.js
export async function register() {
  await import("@patternfly/pfe-core/ssr-shims.js");

  // ── Next.js DevTools compatibility ──────────────────────────────────
  //
  // The original installWindowOnGlobal() (via our adapter) sets
  // `window = undefined` on globalThis. Next.js DevTools accesses `window`
  // properties (e.g. window._nextjsDevtoolsStyleCache) without a typeof
  // guard, so `undefined.something` throws TypeError.
  //
  // Setting window = globalThis provides a valid object for those property
  // accesses. The tradeoff: Next.js then believes it's in a browser
  // environment, so some of its code runs browser-only paths during SSR
  // (querySelector, style checks, etc.), requiring the additional stubs
  // below. This is a known tension in the Lit SSR ecosystem — the Lit team
  // intentionally removed window from their shim (PR #2453) because it
  // breaks SSR detection in other packages.
  // See: https://github.com/lit/lit/issues/2391
  // See: next/dist/compiled/next-devtools/index.js
  (globalThis as Record<string, unknown>).window = globalThis;

  // Because window = globalThis makes window.location resolve to
  // globalThis.location (undefined in Node), Next.js getLocationOrigin()
  // crashes when it destructures { protocol, hostname, port } from
  // window.location.
  // See: next/dist/shared/lib/utils.js:110
  //
  // Note: installWindowOnGlobal already sets location, but it's overwritten
  // when we set window = globalThis (location becomes globalThis.location
  // which is undefined). We re-set it here.
  (globalThis as Record<string, unknown>).location = new URL(
    "http://localhost",
  );

  // Because window = globalThis makes Next.js think it's in a browser
  // (see lit/lit#2391), several browser-only code paths execute during SSR.

  // querySelector: Next.js app-page runtime's ReplaySsrOnlyErrors calls
  // document.querySelector() to find error overlay elements. The ssr-dom-shim's
  // DocumentShim does not provide querySelector.
  // See: next/dist/compiled/next-server/app-page.runtime.dev.js
  (globalThis.document as Record<string, unknown>).querySelector = function () {
    return null;
  };

  // documentElement: Next.js DevTools (bundled React DOM) accesses
  // document.documentElement during SSR rendering (e.g. to read
  // namespaceURI for element creation context).
  // Created via our enriched createElement wrapper so it gets style/setAttribute.
  // See: next/dist/compiled/next-devtools/index.js (react-dom-client.production.js)
  (globalThis.document as Record<string, unknown>).documentElement =
    globalThis.document.createElement("html");
}
