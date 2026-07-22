# `modelo-formal/` movido → repo hermano `generador-rips`

El modelo declarativo se **consolidó en `generador-rips`** (carpeta `modelo-formal/`) el
**2026-07-21**, junto con el prototipo que alimenta. Este repo (vault) ya **no** lo versiona.

| Antes (aquí) | Ahora |
|---|---|
| `modelo-formal/enums.json`, `reglas.dmn.json`, `catalogo-rvc-rvg.json` | `generador-rips/modelo-formal/…` |
| `modelo-formal/esquema-json/`, `zod/`, `surveyjs/`, `transform/` | idem, en `generador-rips/modelo-formal/` |
| `modelo-formal/build.mjs` | idem — ahora escribe **directo** a `prototipos/modelo.datos.js` |

Regenerar el bundle del prototipo: en `generador-rips`, `npm run build:modelo`.
Toda la cadena (modelo → generación → prototipo → validador RIPS) vive ahora en el hermano.

> Historia git: en este repo hasta el commit anterior a la mudanza (recuperable).
