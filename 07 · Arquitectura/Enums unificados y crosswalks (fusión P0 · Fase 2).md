---
tipo: nota
area: arquitectura
tema: fusion
estado: en-construccion
fuentes: ["generador-rips/src/lib/rips-codigos.ts", "modelo-formal/enums.json", "salud_tipo_usuario.gc / salud_modalidad_pago.gc", "DT1 v002 §1.8"]
relacionado: ["[[Mapa Orden → RIPS (transform · fusión P0 · Fase 1)]]", "[[Recaudo — hoja de validación (Acuerdo 260, por validar)]]"]
etiquetas: [arquitectura, fusion, enums, crosswalk, cobertura-aplica, auditoria, fase-2]
actualizado: 2026-07-20
---

# Enums unificados y crosswalks (fusión P0 · Fase 2)

> [!abstract] Qué es
> **Fase 2 de la fusión.** Resuelve el **enum-drift** (E-A2/E-A8: dos repos con enums duplicados) y define la **fuente única**, más los **crosswalks** entre catálogos distintos (E-A2/A-05) y la matriz de cross-validación **`COBERTURA_APLICA`** (DT1 §1.8, hallazgo A-02) que la captura debe **aplicar como poka-yoke**. Los valores vienen 1:1 de `rips-codigos.ts` / los `.gc` / `enums.json`; **nada inventado**. Lo que requiere la tabla viva se marca **por-validar** (Regla §1.6).

## 1 · Estrategia de fuente única
- **Canónico = `rips-codigos.ts`** (el validador ya lo tiene completo y verificado contra SISPRO). La captura **deja de tener su propio `enums.json`** y consume el mismo módulo.
- Los enums "recortados" de la captura (p. ej. `FINALIDAD` 9 de 34) se expresan como **vistas/subconjuntos** sobre el canónico, no como listas paralelas → no hay drift.
- Los catálogos DIAN/FEV (`.gc`) que **difieren** del RIPS se modelan como **crosswalks explícitos** (abajo), no como un enum "mezclado".

| Enum | Captura hoy | RIPS canónico | Acción |
|---|---|---|---|
| `TIPO_DOCUMENTO` | 16 | RIPSTipoDocumento (viva) | reconciliar (M-08: CN/NV, NI, PT) |
| `TIPO_USUARIO` | 13 | 13 | **crosswalk** con FEV `.gc` (11) — §2 |
| `COBERTURA` | 17 | 17 | igual ✓ |
| `MODALIDAD_PAGO` | 12 (contrato) | 4 (RIPS `modalidadPago`) | **crosswalk** — §3 |
| `FINALIDAD` | 9 | 34 | subconjunto (imaging) ✓ |
| `RCONCEPTO` | 5 | 5 | igual ✓ (ya corregido) |
| resto (SEXO, ZONA, TIPO_DX…) | — | — | consistentes ✓ |

## 2 · Crosswalk `tipoUsuario` — RIPS (13) ↔ FEV DIAN `.gc` (11)
**Mismo código, distinto significado** en 05/08/12 (hallazgo A-01). El transform debe traducir al emitir la FEV.

| RIPS (13) | FEV `.gc` (11) | Crosswalk |
|---|---|---|
| 01 Cotizante · 02 Beneficiario · 03 Adicional · 04 Subsidiado | 01 · 02 · 03 · 04 | = directo ✓ |
| **05 No afiliado** | **05 Sin régimen** | ¿equivalen? **por-validar** |
| 06 Excepción cotizante · 07 Excepción beneficiario | 06 · 07 | = directo ✓ |
| **08 PPL (FNS)** | *(no existe en `.gc`)* | **por-validar** (¿va por cobertura 14?) |
| 09 ARL · 10 SOAT · 11 Planes voluntarios | 09 · 10 · 11 | = directo ✓ |
| **12 Particular** | **08 Particular** | **12 → 08** (por-validar) |
| **13 Especial no cotizante** | *(no existe en `.gc`)* | **por-validar** |

> Autoridad final: tabla viva SISPRO/DIAN (Regla §1.6). Las filas "directo" coinciden en código y glosa; las marcadas **por-validar** hay que confirmarlas antes de codificar el crosswalk.

## 3 · Crosswalk `modalidad` — Contrato `ModalidadContratoyPago` (12) → RIPS `modalidadPago` (4)
El contrato adoptó los 12 códigos de contratación; el campo RIPS usa **4** (`MODALIDAD_PAGO_FEV`: 01 Paquete · 02 PGP · 03 Capitación · 04 Evento). Falta el mapeo (A-05).

| Contrato (12) | → RIPS (4) | Estado |
|---|---|---|
| 01 Paquete/Canasta | **01** Paquete | directo ✓ |
| 11 Capitación | **03** Capitación | directo ✓ |
| 12 Por servicio | **04** Evento | probable (por-validar) |
| 02 GRD · 03 Integral grupo riesgo · 04 Por contacto · 05–10 · … | ? | **por-validar** (mapear cada uno a 01–04) |

## 4 · `COBERTURA_APLICA` — cross-validación DT1 §1.8 (aplicar en la captura)
Por cada **cobertura**, los conjuntos válidos de `{tipoUsuario, modalidadPago, conceptoRecaudo}` (códigos RIPS). Hoy vive **solo** en el validador y es **código muerto** (A-02); la captura debe **filtrar** las opciones con esta matriz (poka-yoke → cierra RVC005/CIN006). Fuente: `rips-codigos.ts:334-350`.

| cob | tipoUsuario | modalidadPago | conceptoRecaudo |
|---|---|---|---|
| 01 | 01,02,03,04 | 01,02,03,04 | 01,02,04,05 |
| 02 | 01,02,03,04 | 04 | 01,02,05 |
| 03 | *(vacío)* | *(vacío)* | *(vacío)* |
| 04 SOAT | 10 | 01,04 | 05 |
| 05 ARL | 09 | 01,02,03,04 | 04,05 |
| 06 ADRES | 01–13 | 01,04 | 05 |
| 07 Salud pública | 01–13 | 01,03,04 | 05 |
| 08 · 09 | 05 | 04 | 05 |
| 10·11 PVS | 11 | 01,02,03,04 | 03,04,05 |
| 12 PVS | 11 | 01,04 | 03,04,05 |
| 13 Especial | 06,07,13 | 01,02,03,04 | 01,02,04,05 |
| 14 PPL | 08 | 01,02,03,04 | 04,05 |
| 15 Particular | 12 | 01,04 | 04,05 |
| 16 UPC Contrib. | 01,02,03 | 01,02,03,04 | 01,02,04,05 |
| 17 UPC Subsid. | 04 | 01,02,03,04 | 01,02,04,05 |

> [!warning] Verificar la matriz vs DT1 verbatim (hallazgo H4)
> La matriz está transcrita a mano en el validador. Dos puntos a confirmar contra el DT1: (a) **cob 17 (Subsidiado) admite `conceptoRecaudo` 02 (cuota moderadora)** — pero **RVC035** dice que la cuota es **solo del contributivo**; (b) **cob 03 está vacía**. Antes de usarla como fuente de verdad de la captura, revalidar (Regla §1.6).

## 5 · Consecuencia para la captura (fusión)
- El selector de `tipoUsuario`/`modalidad`/recaudo en la Orden se **filtra por la cobertura del contrato** con la matriz §4 → imposible capturar una combinación que el RIPS rechazaría.
- El transform (Fase 1 §8) aplica los crosswalks §2/§3 al **emitir la FEV** (RIPS usa 13/4; FEV usa 11/…).
- Enum-drift eliminado: un solo `rips-codigos.ts`.

## Relacionado
- [[Mapa Orden → RIPS (transform · fusión P0 · Fase 1)]] · [[Recaudo — hoja de validación (Acuerdo 260, por validar)]] · [[reference-generador-rips-sibling]] · [[Preguntas abiertas]]
