// Adapter that provides installWindowOnGlobal() without importing node-fetch.
//
// pfe-core's ssr-shims.js imports installWindowOnGlobal from
// @lit-labs/ssr/lib/dom-shim.js, which transitively imports node-fetch.
// node-fetch uses node: protocol imports (node:fs, node:http, etc.) that
// webpack cannot resolve when bundling instrumentation.ts.
//
// This adapter re-exports the same function but sources its DOM shims from
// @lit-labs/ssr-dom-shim (which has no node-fetch dependency), sidestepping
// the webpack error entirely.
//
// Wired in via a webpack alias in next.config.ts:
//   alias['@lit-labs/ssr/lib/dom-shim.js'] = resolve('src/lib/lit-dom-shim-adapter.js')
//
// See: @lit-labs/ssr/lib/dom-shim.js → node-fetch → node:fs (UnhandledSchemeError)
import {
  Document,
  document,
  HTMLElement,
  Element,
  Event,
  CustomEvent,
  EventTarget,
  CSSStyleSheet,
  CustomElementRegistry,
  customElements,
  ShadowRoot,
  IntersectionObserver,
  MutationObserver,
  ResizeObserver,
  Node,
  HTMLSlotElement,
} from '@lit-labs/ssr-dom-shim';

// Enriches elements returned by any createElement implementation with methods
// that Next.js DevTools (bundled React DOM) expects. Uses a property trap on
// document.createElement so that even if pfe-core overrides createElement
// (which it does, unconditionally, after calling installWindowOnGlobal),
// the enrichment wrapper survives.
//
// Why a trap: pfe-core's ssr-shims.js is bundled into BOTH the instrumentation
// chunk and the vendor-chunks/@patternfly chunk. Each copy calls
// `document.createElement = function(...) { ... }` unconditionally. The second
// copy overwrites whatever the first set. A defineProperty trap intercepts
// every assignment and re-wraps, so the enrichment is always the outermost layer.
// See: next/dist/compiled/next-devtools/index.js (react-dom-client.production.js)
function enrichElement(el) {
  if (!el.style) el.style = {};
  if (!el.setAttribute) {
    el._attrs = {};
    el.setAttribute = function (k, v) { this._attrs[k] = String(v); };
    el.getAttribute = function (k) { return this._attrs[k] ?? null; };
    el.removeAttribute = function (k) { delete this._attrs[k]; };
    el.hasAttribute = function (k) { return k in this._attrs; };
  }
  if (!el.appendChild) el.appendChild = function (child) { return child; };
  return el;
}

let _rawCreate = null;

function installCreateElementTrap() {
  if (!globalThis.document) return;
  const doc = globalThis.document;

  // If already trapped, skip
  if (doc._createElementTrapped) return;
  doc._createElementTrapped = true;

  // Capture current createElement and wrap it
  _rawCreate = doc.createElement;
  const wrappedCreate = function createElement(tagName) {
    return enrichElement(_rawCreate(tagName));
  };
  doc.createElement = wrappedCreate;

  // Trap future assignments to document.createElement so pfe-core's
  // unconditional override gets re-wrapped automatically
  Object.defineProperty(doc, 'createElement', {
    get() { return wrappedCreate; },
    set(fn) {
      _rawCreate = fn;
    },
    configurable: true,
  });
}

// Self-initialize on first import. During `next build`, webpack bundles
// component modules (e.g. combobox-controller.js) that access `document` at
// static field init time. The prerender worker may evaluate these modules
// before instrumentation.ts's register() runs. By calling installWindowOnGlobal
// at import time, we ensure globalThis.document exists as soon as any module
// in the bundle pulls in pfe-core's ssr-shims (which imports this adapter).
const _selfInit = () => {
  if (globalThis.window === undefined) {
    const windowObj = {
      EventTarget,
      Event: globalThis.Event ?? Event,
      CustomEvent: globalThis.CustomEvent ?? CustomEvent,
      Element,
      HTMLElement,
      Document,
      document,
      CSSStyleSheet,
      ShadowRoot,
      CustomElementRegistry,
      customElements: customElements ?? new CustomElementRegistry(),
      Node,
      HTMLSlotElement,
      IntersectionObserver,
      MutationObserver,
      ResizeObserver,
      location: new URL('http://localhost'),
      requestAnimationFrame() {},
      window: undefined,
    };
    Object.assign(globalThis, windowObj);
    installCreateElementTrap();
  }
};
_selfInit();

export const installWindowOnGlobal = (props = {}) => {
  if (globalThis.window === undefined) {
    const windowObj = {
      EventTarget,
      Event: globalThis.Event ?? Event,
      CustomEvent: globalThis.CustomEvent ?? CustomEvent,
      Element,
      HTMLElement,
      Document,
      document,
      CSSStyleSheet,
      ShadowRoot,
      CustomElementRegistry,
      customElements: customElements ?? new CustomElementRegistry(),
      Node,
      HTMLSlotElement,
      IntersectionObserver,
      MutationObserver,
      ResizeObserver,
      location: new URL('http://localhost'),
      requestAnimationFrame() {},
      // The original sets window = undefined here, but we deliberately omit it.
      // Setting window = undefined or window = globalThis both cause problems
      // with Next.js — see instrumentation.ts for the window override and why.
      window: undefined,
      ...props,
    };
    Object.assign(globalThis, windowObj);
  }
  // Install the trap after every call — pfe-core calls installWindowOnGlobal
  // before overriding createElement, so the trap must be ready to catch it.
  installCreateElementTrap();
};
