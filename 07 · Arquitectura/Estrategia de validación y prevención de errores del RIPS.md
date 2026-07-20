---
tipo: analisis
area: arquitectura
estado: en-progreso
actualizado: 2026-07-17
etiquetas: [rips, validacion, ux, prevencion, dt1]
---

# Estrategia de validación y prevención de errores del RIPS

> [!abstract] Objetivo
> Que el usuario llene el formulario y **al final no existan errores**: cada regla de la norma (DT1 v002) se traduce en un **control de entrada** que hace el error imposible o lo muestra al instante. Fuente: DT1 v002 (**103 reglas RVC** de campo/contenido + **20 RVG** de cruce). App: [[generador-rips (app local)|proyecto local `generador-rips`]].

## Marco de la norma (secuencia del MUV)
El DT1 valida en 3 capas, en orden, y clasifica el resultado en **aprobado / notificación / rechazo**:

| Capa | Qué valida | Reglas | ¿Prevenible en el formulario? |
| --- | --- | --- | --- |
| **Estructura** | JSON válido, **tipo** (C/N), **tamaño** | RVG01, RVG04, RVG05 | **Sí, 100%** (por construcción) |
| **Contenido** | Valor ∈ tabla de referencia (enum), formato fecha, **catálogos** (CUPS, CIE, CUM, DANE, REPS, MIPRES) | RVG06; RVC001-005, 015-031, 096-098… | Enums **sí**; catálogos requieren cargarlos |
| **Relación** | Cruces entre campos: doc↔edad, fechas, dx↔sexo/edad, aplicabilidad por servicio, pago↔recaudo, duplicados | RVC006-053; RVG07, 12-17 | **Mayoría sí** (cruces internos) |
| **Relación externa** | Coincidencia con la **FEV**; profesional en **RETHUS/MIPRES** | RVG02, 08, 09, 10, 11 | **No** solo con el RIPS → integración |

## Estrategias de prevención (de la más fuerte a la más débil)
- **A · Poka-yoke (hacer el error imposible):** selects/dropdowns en todo campo con tabla de referencia; inputs tipados (number, date/datetime pickers); `maxLength`/patrón por campo según la columna "Tamaño" del DT1.
- **B · Campos de catálogo con buscador (typeahead):** CUPS, CIE-10/11, CUM/IUM, municipio DANE, `codPrestador` (REPS) — solo permiten seleccionar valores válidos. Requiere cargar catálogos.
- **C · Guía contextual:** campos **condicionales** (numNota si hay tipoNota; registroSIRAS si SOAT; dx de egreso solo en urgencias/hospitalización; idMIPRES si aplica) y **dropdowns dependientes** (finalidad/vía/causa/condición solo muestran los códigos que aplican a ese tipo de servicio) + prefill/auto-derivación.
- **D · Validación en vivo + cruces progresivos:** recalcular rechazos/notificaciones con ubicación exacta en cada cambio (ya existe); añadir cruces faltantes (fechas, pago↔recaudo, dx↔sexo/edad).
- **E · Gate de envío:** bloquear descarga/envío con rechazos; checklist de pendientes; notificaciones se muestran sin bloquear (como el MUV).
- **F · Externo (transparencia + integración):** FEV (RVG02/08/09), RETHUS (RVG11) y catálogos → panel "Requiere verificación externa" mientras no haya integración.

## Plan / priorización
| # | Acción | Impacto | Estado |
| --- | --- | --- | --- |
| 1 | Selects en todos los enums + inputs tipados | Elimina "contenido-enum" | Parcial |
| 2 | `maxLength`/patrón por campo (mapa de tamaños DT1, RVG05) | Elimina errores de tamaño | ✅ **Hecho** |
| 3 | **Dropdowns dependientes por aplicabilidad** | Elimina "relación por servicio" | ✅ **Hecho** |
| 4 | Campos condicionales (nota, SIRAS, egreso, MIPRES) | Evita obligatoriedad mal puesta | ✅ **Hecho** |
| 5 | Cruces en vivo faltantes (fechas, pago↔recaudo) | Cierra "relación" interna | 🔄 **B1-B9 ✓; falta RVC050/066 (modelo) y B10 (nicho)** (ver [[Inventario de cruces (RVC-RVG) — cobertura del validador]]) |
| 6 | Gate de envío + checklist | Garantiza 0 rechazos al final | ✅ **Hecho** (descarga bloqueada + checklist) |
| 7 | Typeahead de catálogos (CUPS/CIE/DANE/REPS) | Elimina "contenido-catálogo" | 🔄 **DANE ✅ (1.123) + CUPS ✅ (13.640) + CIE-10 ✅ (12.634, todos los dx) + Países ✅ (249) + UMM ✅ (129) + FFM ✅ (37)**, tablas vivas SISPRO. **IUM ✅ (34.642, asistente + notificación)**. **CIE-11 = no en SISPRO** (WHO ICD-11 poscoordinada). **CUM = 162.285 (impractical de embeber)**; REPS (impractical) |

## Principio rector
**Cada regla del DT1 → un control de entrada.** Lo que no se puede prevenir en el formulario (FEV, RETHUS, catálogos externos) se hace **explícito** y se resuelve por integración.

## Relacionado
- [[Objetivo]] · [[Preparación del cruce — DT1 v002 (cambios, erratas, tablas)]] · [[Tablas de referencia vigentes (SISPRO) — enums del RIPS]] · [[_MOC Arquitectura]]
