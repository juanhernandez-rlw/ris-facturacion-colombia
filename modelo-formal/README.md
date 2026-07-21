# Modelo formal declarativo — RIS · FEV-RIPS

> **Qué es:** las reglas, enums y relaciones que el prototipo `prototipo-convenio-contrato-orden.html` implementa **hoy**, extraídas del código y expresadas como **dato** en las capas estándar del desarrollo de software. En vez de estar enterradas en un `<script>`, viven como una **sola fuente** que el formulario, el gate de validación y (a futuro) el backend pueden leer.

> [!warning] Alcance honesto (Reglas del proyecto §3.2)
> Esto formaliza **solo lo que el prototipo hace hoy**: su `validate()`, sus guardas de guardado y su visibilidad condicional. **NO** son las 103 RVC + 20 RVG completas del DT1 v002 — esa cobertura total está inventariada, pendiente, en [[Inventario de cruces (RVC-RVG) — cobertura del validador]]. Certeza: **`inferido`** (arquitectura) sobre datos **`verificados`** (mensajes y condiciones sacados 1:1 del HTML). Los enums se cargan tal cual del prototipo; su **re-validación en vivo** contra la tabla viva de SISPRO (Regla §4.5) queda **pendiente**. El mapa `RECAUDO_TU` está marcado **`por-verificar`** (el propio prototipo lo rotula "Acuerdo 260, POR VALIDAR").

## Las capas (cada estándar cubre una capa)

| Archivo | Capa | Estándar | Qué captura |
|---|---|---|---|
| `enums.json` | Valores válidos | tablas de referencia | Listas `[código, etiqueta]` de cada campo (TIPO_USUARIO, COBERTURA…). |
| `esquema-json/*.schema.json` | Forma + condicionales | **JSON Schema** (2020-12) | Tipos, obligatoriedad, `if/then`, `oneOf`. Convenio · Contrato · Orden. |
| `reglas.dmn.json` | Reglas de negocio / cruces | **DMN** (tabla de decisión) | Cada regla = una fila (condición → mensaje). Gate de la orden + guardas de guardado. Incluye `mapas` (p. ej. `RECAUDO_TU`). |
| `surveyjs/orden.survey.json` | UI declarativa | **SurveyJS** | `visibleIf` / `requiredIf`: "si la casilla X vale V, la casilla Y aparece / es obligatoria". |
| `zod/modelo.zod.ts` | Validación como código | **Zod** (TS) | La misma validación para el **backend** futuro; genera tipos TS + runtime; cruces en `.superRefine()`. |

Esto sigue el mapa de tu [[Estrategia de validación y prevención de errores del RIPS]] (Estructura + Contenido → JSON Schema/enums · Relación → DMN/reglas · Externa → integración).

## Cómo lo consume el prototipo (corre en `file://`, sin fetch)

```
modelo-formal/enums.json + reglas.dmn.json
        │  node build.mjs   (fuente única → bundle)
        ▼
_Adjuntos/wireframes/modelo.datos.js   → window.RIS_MODELO   (GENERADO, no editar a mano)
_Adjuntos/wireframes/motor.js          → window.RIS          (motor: evalúa las reglas)
_Adjuntos/wireframes/seed.js           → window.RIS_SEED      (datos demo)
        ▼
prototipo-convenio-contrato-orden.html  consume RIS.enums / RIS.mapas / RIS.validarOrden(...) / RIS_SEED
```

El HTML ya **no** trae enums ni seed ni reglas incrustados: los enums salen de `RIS.enums`, el seed de `RIS_SEED`, y `validate()` / `saveConvenio` / `saveContrato` delegan en `RIS.validarOrden` / `RIS.chequearConvenio` / `RIS.chequearContrato`. La visibilidad condicional del render lee los mismos datos del modelo (`RECAUDO_TU`, `cv.reqAut`); su forma canónica y declarativa está en `surveyjs/` y en el `if/then` de los esquemas.

### Regenerar el bundle
```bash
node modelo-formal/build.mjs
```

## El mini-lenguaje de condiciones (`reglas.dmn.json`)

Condiciones estructuradas (no un DSL de strings, para que el motor sea seguro):
`empty` · `truthy` · `nonempty` · `emptyArray` · `emptyTrim` · `eq`/`ne` · `gt` · `lte` · `copRango` · `mapIn` · `and`/`or`/`not`. Ver `_meta.operadores` en el JSON. `mapIn` hace lookup en una tabla de decisión (`mapas`), p. ej. `RECAUDO_TU[pac.tipoUsuario] ∈ {copago,cuota}`.

## Nota de rediseño — recaudo

El concepto de recaudo (copago vs cuota moderadora vs no aplica) **ya no vive en el contrato**: se **deriva del tipo de usuario del paciente** vía el mapa `RECAUDO_TU`. El contrato guarda **ambas** figuras (`recaudo.copago` y `recaudo.cuota`, opcionales) y en la orden se aplica la que corresponda. Regla propuesta sobre Acuerdo 260, **por validar**.

## Verificación

- **Paridad:** `motor.js` reproduce el `validate()` y las guardas originales en **15.000 casos aleatorios + casos borde, 0 fallos** (test en el historial de la sesión).
- **Runtime:** el prototipo refactorizado carga sin errores de consola; el gate y las guardas producen exactamente los mismos mensajes ejecutando el motor en el navegador.
