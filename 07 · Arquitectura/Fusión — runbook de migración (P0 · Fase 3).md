---
tipo: nota
area: arquitectura
tema: fusion
estado: propuesta
fuentes: ["[[Mapa Orden → RIPS (transform · fusión P0 · Fase 1)]]", "[[Enums unificados y crosswalks (fusión P0 · Fase 2)]]"]
relacionado: ["[[Modelo de persistencia (fusión P0 · Fase 5 · P3)]]", "[[reference-generador-rips-sibling]]"]
etiquetas: [arquitectura, fusion, migracion, runbook, fase-3]
actualizado: 2026-07-20
---

# Fusión — runbook de migración (P0 · Fase 3)

> [!abstract] Qué es
> **Fase 3 = la migración física** de la captura (Convenio→Contrato→Orden) hacia `generador-rips`, para tener **una sola app**. El diseño ya está (Fases 1/2/4/5); esto es el **runbook** para ejecutarla. Es la parte **hands-on**: toca un repo aparte y su UI React, que no se puede verificar de forma automática. Se ejecuta **contigo en el loop**, paso a paso y verificando cada uno.

> [!danger] Prerequisito bloqueante — el repo hermano NO está bajo git
> `~/Documents/Claude Projects/generador-rips` **no es un repo git** (sin control de versiones ni remoto). **No se debe migrar código nuevo a un repo sin git** (no hay revert ni revisión). **Paso 0 obligatorio:** `git init` + `.gitignore` + commit baseline (+ remoto privado) antes de tocar nada.

## Orden de ejecución (cada paso verifica antes de seguir)

| # | Paso | Qué se mueve | Verificación |
|---|---|---|---|
| **0** | **git init** del hermano + baseline | — | `git status` limpio; los 7 ejemplos oficiales siguen en 0 rechazos |
| **1** | **Enums única fuente** (Fase 2) | consolidar en `rips-codigos.ts`; añadir crosswalks `tipoUsuario`(13↔11)/`modalidad`(12↔4) y helper que aplique `COBERTURA_APLICA` | `npm run typecheck`; test del helper con la matriz |
| **2** | **Tipos de captura** | portar `Convenio`/`Contrato`/`Orden` (de `modelo-formal/esquema-json` + `modelo.zod.ts`) a `src/lib/captura-tipos.ts` reusando los tipos RIPS | `typecheck` |
| **3** | **Transform** | portar `orden-a-rips.mjs` → `src/lib/orden-a-rips.ts` tipado con `rips-tipos.ts` | `node`/test: genera 948 + lista `faltantes` |
| **4** | **UI de captura** (hands-on) | pantallas Convenio/Contrato/Orden en React (Linear DS), reusando `CatalogTypeahead`, selects filtrados por `COBERTURA_APLICA` | **manual, contigo**: crear convenio→contrato→orden en vivo |
| **5** | **Gate honesto** | el botón "Generar" corre el transform → `rips-validaciones.ts` (40 RVC) y muestra `faltantes` reales | el gate deja de mentir (X-01); ejemplos OK |
| **6** | **Persistencia** (Fase 5) | entidades cuando arranque el backend | por definir con el stack |

## Qué se descarta / preserva
- **Descartable:** el prototipo `generador-rips/prototipos/prototipo-convenio-contrato-orden.html` (y el `-linear`) → su lógica ya vive en el modelo formal + transform; consolidado en el repo hermano `generador-rips` como referencia.
- **Se preserva:** todo el modelo formal (`modelo-formal/`) es la fuente que se porta; los catálogos reales ya se comparten.

## Cierres al terminar Fase 3
- **X-01** (gate falso) → el gate corre el transform + validador reales.
- **E-A2/E-A8** (enum-drift) → una sola fuente de enums.
- **A-02** (`COBERTURA_APLICA` código muerto) → aplicada en la captura.
- Los **GAP** del Mapa (Fase 1 §7) se van cerrando al añadir cada campo a la UI (paso 4).

## Lo que NO cierra Fase 3 (siguen su carril)
- **P1 recaudo** — espera la validación de [[Recaudo — hoja de validación (Acuerdo 260, por validar)|su hoja]] (#22/#23/#24). El transform ya deja los ganchos (`conceptoRecaudo`/`valorPagoModerador` en null).
- Campos de **catálogo pendientes** (CUM/IUM farmacéutico, REPS `codServicio`, CIE-11) — captura + tabla viva.

## Relacionado
- [[Mapa Orden → RIPS (transform · fusión P0 · Fase 1)]] · [[Enums unificados y crosswalks (fusión P0 · Fase 2)]] · [[Modelo de persistencia (fusión P0 · Fase 5 · P3)]] · [[reference-generador-rips-sibling]]
