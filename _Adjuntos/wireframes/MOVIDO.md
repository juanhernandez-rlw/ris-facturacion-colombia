# Prototipos movidos → repo hermano `generador-rips`

Los prototipos de captura y su runtime se **consolidaron en `generador-rips`** (carpeta
`prototipos/`) el **2026-07-21**. Este repo (vault) ya **no** los versiona.

| Antes (aquí) | Ahora |
|---|---|
| `prototipo-convenio-contrato-orden.html` | `generador-rips/prototipos/prototipo-convenio-contrato-orden.html` |
| `prototipo-convenio-contrato-orden-linear.html` | `generador-rips/prototipos/prototipo-convenio-contrato-orden-linear.html` |
| `orden-wireframe.html` | `generador-rips/prototipos/orden-wireframe.html` |
| `motor.js` · `seed.js` · `modelo.datos.js` · `catalogos/*.js` | idem, en `generador-rips/prototipos/` |

El **modelo declarativo** que los alimenta sigue aquí en `modelo-formal/`. `build.mjs` genera
`modelo-formal/dist/modelo.datos.js` (gitignoreado) y luego se copia al hermano — ver
`modelo-formal/README.md`.

> Historia git de los archivos: en este repo hasta el commit anterior a la mudanza (recuperable).
