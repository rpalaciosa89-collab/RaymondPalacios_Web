# SDD — Simplificación e intuición de raymondpalacios.tech v2

**Fecha:** 2026-09-02
**Estado:** Aprobado para ejecución por loops
**Método:** Spec-Driven Development + Loop Engineering (cada loop: implementar → validar → evidencia → review humano; si no cumple criterios de salida, el loop se repite con correcciones y retries acotados).

---

## 0. Contexto y decisiones de producto (ya cerradas con el dueño)

1. **Proyectos:** todo público, sin registro. Se elimina el email-gate, su API y `private-content/`.
2. **Journey + About:** se fusionan en una sola sección "About" con mini-trayectoria (≤ 4 hitos) + credenciales.
3. **Enlaces públicos y résumé:** se activan con datos reales del dueño (bloqueante `INPUT-01`).
4. **Contenido legal (privacy/cookies):** FUERA DE ALCANCE. No se modifica; queda anotado como pendiente de producto (`NO-GOAL`).
5. **Contacto:** se conserva el formulario (API de Vercel en prod) + fallback `mailto:` visible cuando la API no responde.

---

## 1. Backlog funcional (por impacto)

| ID | Feature | Esfuerzo | Depende de |
|----|---------|----------|------------|
| F-5 | Quitar Three.js (hero 3D) y usar solo CSS | S | — |
| F-4 | Reducir hero y simplificar microtextos | S | — |
| F-1 | Fusionar Journey + About | M | — |
| F-2 | Proyectos públicos sin gate | L | F-1 (solo por orden de review) |
| F-3 | Activar enlaces públicos + résumé | S | `INPUT-01` |
| F-6 | Fallback `mailto:` en contacto | S | — |

**Bloqueante `INPUT-01` (requerido del dueño):**
- `SITE_CONFIG.links.email` (email profesional)
- `SITE_CONFIG.links.linkedin` (URL LinkedIn)
- `SITE_CONFIG.links.github` (URL GitHub)
- `SITE_CONFIG.links.resume` (URL pública del PDF de résumé)

Si `resume` se entrega vacío: se ocultan los botones "Download résumé" (nav + hero) y el enlace "Résumé" del nav en lugar de mostrarlos deshabilitados.

---

## 2. Spec por feature

### F-5 — Quitar Three.js y quedarse con el fallback CSS

**Contexto:** `script.js` importa Three.js desde CDN (`script.js:18,56-57`) solo para decorar el hero. El fallback CSS existe (`style.css:11`, markup `index.html:63`).

**Cambios:**
1. `script.js`: borrar `setupThree`, `initThree`, `state.three`, `SITE_CONFIG.features.threeD` y `SITE_CONFIG.threeModuleUrl`. Quitar la llamada `setupThree()` de `init()`.
2. `index.html:62`: eliminar `<canvas id="engineCanvas">` y la clase de estado `webgl-ready`. Conservar `.engine-stage` + `.engine-fallback`.
3. `style.css:11`: añadir una rotación CSS sutil (keyframes) a `.engine-fallback` (respetando `prefers-reduced-motion` que ya anula animaciones).
4. `vercel.json`: quitar `https://cdnjs.cloudflare.com` de `script-src` y `connect-src` de la CSP.
5. Limpieza: eliminar selectores huérfanos `.engine-canvas`, `.webgl-ready` si quedan sin uso.

**Criterios de aceptación (AC):**
- [ ] `index.html` no contiene `<canvas>`, `cdnjs` ni `webgl-ready`.
- [ ] `script.js` no contiene referencias a `three`, `WebGL`, `canvas`, `cdnjs`.
- [ ] La escena visual del hero (anillos) se renderiza 100% con CSS en navegador normal y en `prefers-reduced-motion` (estática, visible).
- [ ] `npm run check` verde. Sin llamadas de red a terceros en carga inicial (ver DevTools → Network).

---

### F-4 — Hero legible y microtextos claros

**Contexto:** título a `clamp(3.75rem,6.8vw,7.7rem)` (~123px máx, `style.css:10`). Microtextos crípticos: "ENGINEERING × INTELLIGENCE", "PE + US", "PHYSICAL SYSTEM → SIGNAL → DECISION" (`index.html:55,59,64`; `content/site.*.json`).

**Cambios:**
1. `style.css:10`: título del hero → `clamp(2.75rem, 5.4vw, 5.6rem)` con `line-height:1.01` y `letter-spacing:-.05em` aprox. Ajustar el título del hero en `@media` 880px y 640px en proporción (mantener heurística móvil ≤ 12vw).
2. Copy nuevo (EN/ES) en `content/site.en.json` y `content/site.es.json`:

| Clave | EN (propuesto) | ES (propuesto) |
|-------|----------------|----------------|
| `hero.eyebrow` | `INDUSTRIAL SYSTEMS · AUTOMATION · APPLIED AI` | `SISTEMAS INDUSTRIALES · AUTOMACIÓN · IA APLICADA` |
| `hero.regions` | `Peru + United States experience` | `Experiencia en Perú + EE. UU.` |
| `hero.engine` | `Systems · Automation · AI` | `Sistemas · Automación · IA` |

*Nota: si el dueño prefiere otra redacción la cambia en el loop de review; no es bloqueante.*

3. Revisar que el `hero-title` mantenga sentido en ambos idiomas (frase larga queda, ahora legible).

**AC:**
- [ ] El hero ocupa menos de 100svh incluyendo hero-actions y credibility en desktop ≥ 1280px.
- [ ] `data-t` y JSONs EN/ES en paridad (valida `npm run validate`).
- [ ] Sin "PE + US" ni "ENGINEERING × INTELLIGENCE" en UI. Caption del motor en texto plano.
- [ ] Review visual en 390px, 768px y 1440px (manual, con screenshots opcionales en `validation/`).

---

### F-1 — Fusión de Journey + About en una sola sección

**Contexto:** Journey (`index.html:83`) repite la historia de Expertise y About (`index.html:86`). Decisión: "About con mini-trayectoria".

**Cambios:**
1. `index.html`:
   - Eliminar `<section id="journey">`.
   - En la sección `about`: conservar visual (frame RP), statement y `#credentialChips`, y AÑADIR `<ol id="aboutTimeline">` (mini-trayectoria ≤ 4 hitos).
   - Nav (`index.html:43`): quitar enlace "Journey". Queda: Expertise · Work · About · Contact.
2. `content/site.en.json` / `es`:
   - Borrar `nav.journey`, `journey.*`.
   - En `about`: añadir `milestones: [{title, body}] × 4` (EN/ES), condensando los 5 pasos actuales.
3. `script.js`:
   - `applyContent()` deja de llamar `renderTimeline`; nuevo `renderAboutTimeline()` que rellena `#aboutTimeline` desde `about.milestones`.
4. `style.css`: reutilizar la línea visual (borde + nodos) del `.timeline` para `.about-timeline`; limpiar estilos huérfanos de `.journey-*` y `#journey`.

**Redacción sugerida (revisable en loop):**

| Hito | EN | ES |
|------|----|----|
| 1 | Industrial electronics → engineering | Electrónica → ingeniería industrial |
| 2 | Projects & maintenance leadership | Liderazgo de proyectos y mantenimiento |
| 3 | Regulated manufacturing in the US | Manufactura regulada en EE. UU. |
| 4 | Data science & applied AI | Ciencia de datos e IA aplicada |

**AC:**
- [ ] No existe `journey` en HTML, JS ni JSON.
- [ ] `about` contiene statement + credentials + milestones EN/ES.
- [ ] Nav sin "Journey"; scroll-spy/anclas a secciones vivas intactas.
- [ ] `npm run validate` + `npm run lint` verdes. Nada más en la página dice "Journey".

---

### F-2 — Proyectos públicos sin email-gate

**Contexto:** cada tarjeta exige email para abrir el caso (`script.js:46-48`, `api/project-access.js`). El detalle vive en `private-content/projects/*.{en,es}.json` y se sirve solo vía API de Vercel + Supabase (leads). Decisión: público total.

**Cambios:**
1. `content/projects.json`: nuevo schema por proyecto: `{ id, status:{en,es}, title, category:{en,es}, summary:{en,es}, tech[], detail:{ en:{problem,approach,architecture[],learning}, es:{...} } }`. Migrar el contenido real desde `private-content/projects/`.
2. `index.html:103`: simplificar `<dialog>`: solo botón de cierre + `<article id="projectDetail">`. Eliminar `#dialogGate`, `#projectAccessForm`, campos, checkboxes de marketing/privacy y `#accessStatus`.
3. `script.js`:
   - `renderProjects()`: botón "View case study" (texto `work.access`) solo abre el dialog local.
   - `openProject(slug)`: rellena título y pinta `showProjectDetail(p.detail[state.lang])` SIN solicitar datos. Cero `fetch`.
   - Eliminar: `submitProjectAccess`, `requestProjectWithToken`, token de sesión, `state.currentProject` (si queda sin uso), imports de lógica de gate.
   - `showProjectDetail()` conserva el renderizado de secciones (problem/approach/architecture/learning) tomando el objeto ya cargado.
4. Eliminar archivos: `api/project-access.js`, carpeta `private-content/`.
5. `vercel.json`: quitar la entrada `functions` de project-access (queda sin funciones; si ninguna API requiere `functions`, se elimina la clave). CSP: sin cambios adicionales.
6. `scripts/validate-content.js`: en vez de exigir `private-content/projects/<id>.<lang>.json`, exigir `detail.<lang>` con `problem`, `approach`, `architecture[]`, `learning` en `projects.json`.
7. Tests:
   - `tests/content.test.js`: sustituir el test de `marketing` por: "el dialog de proyecto no contiene formulario de email ni checkbox marketing/privacy".
   - Revisar `tests/backend-policy.test.js` y `tests/security.test.js`: eliminar/adoptar casos que referencien `project-access`, leads o el schema viejo. Mantener tests de contacto y privacy intactos.
8. `script.js:20`-`applyContent`: `gate` copy: eliminar clave `gate` de JSONs y limpiar `state.currentProject` si se elimina.
9. `content/site.*.json`: borrar sección `gate`.

**AC:**
- [ ] Click en cualquier proyecto → dialog con caso completo EN y ES, sin pedir email.
- [ ] `private-content/` y `api/project-access.js` no existen en el repo.
- [ ] `npm run check` verde con tests actualizados. `npm run build` no incluye `private-content`, `api` ni `database`.
- [ ] Contacto/privacy (endpoints, scripts, páginas) sin cambios funcionales.
- [ ] Ninguna cadena "Unlock", "gate", "Register your email" en UI/JSON.

**Fuera de alcance (anotado):** borrado de tablas `leads` / `project_access` en Supabase y de la migración `001_initial.sql` si la define el schema. Es tarea de infraestructura/ops; documentar en `MAINTENANCE.md` como pendiente, no ejecutarla.

---

### F-3 — Activar enlaces públicos y résumé

**Contexto:** `SITE_CONFIG.links` vacío (`script.js:15`) → botones résumé deshabilitados y sección contacto sin enlaces. Depende de `INPUT-01`.

**Cambios:**
1. `script.js:15`: completar `SITE_CONFIG.links` con los valores reales.
2. `configureResume()` ya activa los botones automáticamente al existir `links.resume` (`script.js:38`). Si no hay résumé: ocultar botones (`.is-disabled` → `display:none` vía clase nueva) en vez de mostrarlos apagados.
3. `renderPublicLinks()` ya pinta email/LinkedIn/GitHub automáticamente (`script.js:37`); sin cambios si los datos existen.
4. Si `email` no se configura, se elimina la promesa "or use the public email once configured" del texto de error del formulario (`content.contact.form.error`, `site.en/es.json`).

**AC:**
- [ ] Nav y hero muestran "Résumé" enlazado y activo (o no aparecen).
- [ ] `#publicLinks` muestra Email y/o LinkedIn y/o GitHub con `target=_blank` + `rel=noopener`.
- [ ] `mailto:` correcto con el email real.
- [ ] Sin enlaces vacíos (`href="#"` deshabilitados) visibles.

---

### F-6 — Contacto con fallback `mailto:`

**Contexto:** `postJson(SITE_CONFIG.api.contact)` falla en local (501 en `scripts/dev.js`) y puede fallar en prod si la API no está. Hoy solo muestra texto de error (`script.js:52`).

**Cambios:**
1. `script.js` `setupContactForm`: en `catch`, además del estado de error, renderizar un enlace visible `mailto:<SITE_CONFIG.links.email>?subject=<subject>&body=<name + message>`.
2. `content/site.en.json` / `es`: nueva clave `contact.form.mail_fallback` (p. ej. EN: "Prefer email? Write me directly →", ES: "¿Prefieres email? Escríbeme directo →").
3. CSS: reutilizar `.text-link` o `.public-links a` para el fallback; el formulario se resetea solo en éxito (sin cambios).
4. Si `INPUT-01` deja `email` vacío, el fallback NO se muestra (solo texto de error actual).

**AC:**
- [ ] Con servidor local (`npm run dev`) enviar el formulario → aparece enlace `mailto:` con asunto/cuerpo precargados.
- [ ] En prod con API OK: flujo actual intacto (sin enlace, mensaje de éxito).
- [ ] Email en `mailto:` idéntico a `SITE_CONFIG.links.email`.

---

## 3. Restricciones globales (se aplican a todos los loops)

- **Sin regresión de contenido:** EN/ES siempre en paridad (valida `npm run validate`).
- **Calidad:** `npm run check` verde al cierre de cada loop. `npm run build` verde y revisión de `dist/` sin archivos privados.
- **A11y:** skip-link, ARIA, foco, `prefers-reduced-motion` y `prefers-contrast` intactos. No introducir dependencias nuevas.
- **Seguridad:** sin literales de secretos (valida `npm run lint`). CSP actualizada si se quita CDN. Ninguna API nueva.
- **Git:** cada loop termina en commit con mensaje descriptivo en `main` (repo: `RaymondPalacios_Web`). No subir `dist/`, `.env`, `validation/*.png` nuevos sin consultar.
- **No-goals:** no se toca el contenido legal (`privacy.html`, `cookies.html`, `privacy.js`, `api/privacy-request.js`, versión `2026-08-draft`), ni el flujo de contacto backend, ni el diseño visual general fuera del hero y la fusión About.

---

## 4. Plan de ejecución por loops

### Loop 1 — F-5 (Three.js out)
**Entrada:** repo limpio en `main` (commit actual `eb638bd`).
**Pasos:**
1. Borrar código 3D en `script.js`, `<canvas>` en `index.html`.
2. Añadir rotación CSS sutil al fallback; limpiar estilos huérfanos.
3. Actualizar CSP en `vercel.json`.
4. `npm run check` + `npm run build`.
5. Verificación manual en `http://localhost:3000`: hero con anillos CSS animados; Network sin `cdnjs`.

**Criterios de salida:** AC F-5 completos; sin error en consola del navegador.
**Revert:** `git revert` del commit del loop (el sitio queda exactamente como antes).

### Loop 2 — F-4 (Hero + microtextos)
**Pasos:** ajustar clamp del título en CSS (3 breakpoints), reemplazar copy EN/ES en JSONs, revisar caption y credibility.

**Criterios de salida:** AC F-4; hero legible; `npm run validate`.

### Loop 3 — F-1 (Fusión Journey + About)
**Pasos:** HTML (eliminar journey, añadir milestones en about), JSONs EN/ES (borrar `journey`, añadir `about.milestones`), JS (`renderAboutTimeline`), CSS (`.about-timeline`; limpiar `.journey-*`).

**Criterios de salida:** AC F-1; nav sin Journey; paridad EN/ES.

### Loop 4 — F-2 (Proyectos públicos)
**Pasos:** migrar contenido privado → `projects.json`; simplificar dialog y `script.js`; borrar `api/project-access.js` y `private-content/`; actualizar `vercel.json`, `validate-content.js`, tests; limpiar clave `gate` de JSONs.

**Criterios de salida:** AC F-2; `npm run check` verde; build sin `private-content`; probar EN/ES en los 4 proyectos.

### Loop 5 — F-3 (Enlaces reales) — **bloqueado por `INPUT-01`**
**Pasos:** poblar `SITE_CONFIG.links`; ocultar (no deshabilitar) botones si falta résumé; quitar "once configured" del error si no hay email.

**Criterios de salida:** AC F-3.

### Loop 6 — F-6 (Fallback mailto) + cierre
**Pasos:** fallback en `setupContactForm`; copy EN/ES; revisión integral.

**Cierre integral:** `npm run check`, `npm run build`, walkthrough manual completo en localhost (EN/ES, mobile/desktop, dialog, formulario fallback), actualizar `README.md`/`FINAL_REPORT.md` si describen el gate (verificar; si no, no tocar), commit final y push.

**Criterios de salida:** AC F-6 + checklist de walkthrough completo (ver §5).

---

## 5. Checklist de walkthrough manual (Loop 6)

- [ ] `http://localhost:3000` carga sin errores de consola.
- [ ] EN ↔ ES: todas las secciones traducidas, sin claves rotas.
- [ ] Hero: título legible, anillos CSS, sin WebGL.
- [ ] Nav desktop y móvil (hamburguesa) con las 4 secciones correctas.
- [ ] Sección About: credenciales + hitos visibles; no hay Journey en anclas ni en footer.
- [ ] Proyectos: los 4 se abren completos EN/ES sin pedir email.
- [ ] Formulario de contacto: éxito simulado y fallo simulado muestra fallback `mailto:`.
- [ ] Footer: año correcto, enlaces legales (sin cambios).
- [ ] Keyboard: skip-link, foco visible, dialog cerrable con Esc.
- [ ] `prefers-reduced-motion` activado → sin animaciones, contenido visible.
- [ ] Lighthouse (opcional): CLS estable; sin peticiones a cdnjs.

---

## 6. Registro de cambios del spec

| Fecha | Cambio |
|-------|--------|
| 2026-09-02 | Creación. Decisiones 1-5 cerradas con el dueño. `INPUT-01` pendiente. |
