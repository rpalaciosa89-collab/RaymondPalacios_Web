# Third-party notices

## Three.js

The hero optionally imports Three.js 0.179.1 at runtime from cdnjs. Three.js is distributed under the MIT License. The application remains functional if the import is unavailable because the 3D scene is progressive enhancement with a CSS fallback.

Pinned module location used by `SITE_CONFIG.threeModuleUrl`:

`https://cdnjs.cloudflare.com/ajax/libs/three.js/0.179.1/three.module.js`

Before changing the pinned version, review the upstream release, test WebGL/reduced-motion fallbacks, run the full quality suite, and approve a preview deployment.
