---
tipo: nota
area: arquitectura
tema: facturacion
estado: en-construccion
fuentes: ["[[Estrategia de validación y prevención de errores del RIPS]]", "[[Inventario de cruces (RVC-RVG) — cobertura del validador]]"]
etiquetas: [arquitectura, validacion, modelo-formal, json-schema, dmn, zod, surveyjs, fase-3]
actualizado: 2026-07-20
---

# Modelo formal declarativo (reglas como dato)

> [!abstract] Qué es
> Las reglas, enums y relaciones que el **prototipo** implementa hoy, extraídas del código y expresadas como **dato** en las capas estándar (JSON Schema · DMN · SurveyJS · Zod). Deja de estar "enterrado en un solo JS": el formulario, el gate de validación y (a futuro) el backend leen **una sola fuente**. Vive en la carpeta `modelo-formal/` del repo; su documentación completa está en `modelo-formal/README.md`.
> **Estado:** propuesta de arquitectura (`inferido`) sobre datos `verificados`. **Alcance honesto:** formaliza solo lo que el prototipo hace hoy — **no** las 103 RVC + 20 RVG completas del DT1 (ver [[Inventario de cruces (RVC-RVG) — cobertura del validador]]).

## Por qué

Antes, "qué error mostrar" y "qué casilla es requisito cuando otra vale X" vivían como `if` repartidos dentro de las funciones de render y en `validate()`. Ahora son **dato**: una tabla de reglas + esquemas declarativos. Beneficio: cuando cambie la **Resolución 948 / DT1 v002**, se edita una tabla, no se cazan condicionales; y front + validador nunca se desalinean porque leen lo mismo.

## Las capas

| Capa | Estándar | Archivo |
|---|---|---|
| Valores válidos (enums) | tablas de referencia | `modelo-formal/enums.json` |
| Forma + condicionales | **JSON Schema** | `modelo-formal/esquema-json/*.schema.json` |
| Reglas / cruces + mapas | **DMN** (tabla de decisión) | `modelo-formal/reglas.dmn.json` |
| UI declarativa (`visibleIf`/`requiredIf`) | **SurveyJS** | `modelo-formal/surveyjs/orden.survey.json` |
| Validación como código (backend) | **Zod** | `modelo-formal/zod/modelo.zod.ts` |

Este mapa cae 1:1 sobre la [[Estrategia de validación y prevención de errores del RIPS|estrategia de validación]] (Estructura + Contenido → esquema/enums · Relación → DMN · Externa → integración).

## Cómo lo consume el prototipo

`build.mjs` genera `modelo.datos.js` (`window.RIS_MODELO`) desde los JSON canónicos; `motor.js` (`window.RIS`) evalúa las reglas; `seed.js` (`window.RIS_SEED`) trae los datos demo. El HTML delega en `RIS.validarOrden(...)`, `RIS.chequearConvenio(...)`, `RIS.chequearContrato(...)`.

## Pendientes (trazabilidad)

- [ ] Re-validar los **enums** en vivo contra la tabla viva de SISPRO (Regla [[Reglas#4|§4.5]]).
- [ ] Confirmar el mapa **`RECAUDO_TU`** (tipo de usuario → copago/cuota) — hoy `por-verificar` (Acuerdo 260).
- [ ] Ampliar de las reglas del prototipo a la cobertura completa **RVC/RVG** del [[Inventario de cruces (RVC-RVG) — cobertura del validador]].
