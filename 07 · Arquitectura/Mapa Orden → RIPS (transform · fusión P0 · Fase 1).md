---
tipo: nota
area: arquitectura
tema: fusion
estado: en-construccion
fuentes: ["generador-rips/src/lib/rips-tipos.ts (Res. 948/2026)", "ejemplos oficiales RIPS 948", "[[Dónde vive cada campo — FEV × RIS]]"]
relacionado: ["[[Modelo formal declarativo (reglas como dato)]]", "[[project-auditoria-modelo-2026-07]]"]
etiquetas: [arquitectura, fusion, transform, rips, auditoria, fase-1]
actualizado: 2026-07-20
---

# Mapa Orden → RIPS (transform · fusión P0 · Fase 1)

> [!abstract] Qué es y por qué
> **Fase 1 del plan de fusión** (decisión: unir la captura Convenio→Contrato→Orden con el validador `generador-rips` en una sola app). Este es el **cimiento**: mapea **cada campo del RIPS 948** (destino real, `rips-tipos.ts`) a **su origen** en el modelo de captura, marcando qué está **capturado hoy**, qué es **config/cálculo**, y qué es **GAP** (no se captura → cierra los hallazgos C-01…C-11 de la auditoría). Es la especificación del **transform `Orden → RIPS`**. Estructura destino tomada 1:1 de `rips-tipos.ts`; **nada inventado**.

**Origen:** 🏢 Config-IPS · 🤝 Convenio · 📄 Contrato · 🧾 Orden · ∑ Cálculo · 🔌 RIS/Integración · ⛔ **GAP** (no se captura hoy) · ✅ ya capturado.

---

## 1 · Cabecera (`Rips`)
| Campo RIPS | Origen | Estado | Nota |
|---|---|---|---|
| `numDocumentoIdObligado` | 🏢 | ⛔ GAP→Config | NIT del prestador (sin DV). Va en Config-IPS. |
| `numFactura` | 🏢 + ∑ | ⛔ GAP | numeración DIAN que asigna el RIS. Debe cuadrar con la FEV (`PFP001`). |
| `tipoNota` / `numNota` | flujo notas | ⛔ GAP | NC/ND (Res. 948: 20/30). Flujo de correcciones, no modelado. |

## 2 · Usuario (`Usuario`)
| Campo RIPS | Origen | Estado | Nota |
|---|---|---|---|
| `tipoDocumentoIdentificacion` | 🧾 `pac.tipo` | ✅ | ⚠️ depurar `TIPO_DOCUMENTO` (M-08: CN/NV, NI-paciente). |
| `numDocumentoIdentificacion` | 🧾 `pac.num` | ✅ | |
| `tipoUsuario` | 🧾 `pac.tipoUsuario` | ✅ | ⚠️ crosswalk RIPS(13)↔FEV(11) — Fase 2. |
| `fechaNacimiento` | 🧾 `pac.fnac` | ✅ | |
| `codSexo` | 🧾 `pac.sexo` | ⚠️ | capturado pero **no obligatorio** en el esquema (C-09). |
| `codPaisResidencia` | 🧾 | ⛔ GAP | default 170; falta capturarlo/derivarlo (C-07). |
| `codMunicipioResidencia` | 🧾 `pac.mun.c` | ✅ | typeahead DANE. |
| `codZonaTerritorialResidencia` | 🧾 `pac.zona` | ✅ | |
| `incapacidad` | 🧾 `pac.incap` | ⚠️ | boolean → mapear a `"NO"`/`"SI"` (C-08). |
| `codPaisOrigen` | 🧾 | ⛔ GAP | default 170 (C-07). |
| `registroSIRAS` | 🧾 | ⛔ GAP | obligatorio si `tipoUsuario=10` (SOAT) — RVC095, C-11. |
| `consecutivo` | ∑ | ∑ Cálculo | índice del usuario. |

## 3 · Procedimiento (`Procedimiento`) — el servicio principal del RIS
| Campo RIPS | Origen | Estado | Nota |
|---|---|---|---|
| `codPrestador` | 🏢 | ⛔ GAP→Config | REPS de la sede (12 díg.). Multi-sede: varía por sede. |
| `fechaInicioAtencion` | 🔌 RIS | ⛔ GAP | se hereda del inicio de atención del RIS; **obligatoria** (C-02). El gate no la exige. |
| `numAutorizacion` | 🧾 `aut` | ✅ | condicional al convenio. |
| `idMIPRES` | 🧾 | ⛔ GAP | si el convenio exige MIPRES (`reqMipres` hoy sin consumidor). |
| `codProcedimiento` | 🧾 `estudios[].c` | ✅ | CUPS de la tarifa. |
| `viaIngresoServicioSalud` | 🧾 `estudios[].via` | ✅ | **recién agregado** (01/02); tabla viva SISPRO por-capturar. |
| `modalidadGrupoServicioTecSal` | 🧾/📄 | ⛔ GAP | modalidad de prestación del servicio. |
| `grupoServicios` | 🧾/📄 | ⛔ GAP | grupo de servicios (catálogo). |
| `codServicio` | 🏢 | ⛔ GAP→Config | servicio REPS habilitado del prestador. |
| `finalidadTecnologiaSalud` | 🧾 `estudios[].fin` | ✅ | también decide exención de recaudo (R-01). |
| `tipoDocumentoIdentificacion` (prof.) | 🧾 | ⛔ GAP | **documento del profesional** que presta (C-03). |
| `numDocumentoIdentificacion` (prof.) | 🧾 | ⛔ GAP | idem. |
| `codDiagnosticoPrincipal` | 🧾 `estudios[].dx.c` | ✅ | CIE-10 typeahead. |
| `codDiagnosticoRelacionado` | 🧾 | ⛔ GAP | no se captura. |
| `codComplicacion` | 🧾 | ⛔ GAP | no se captura. |
| `*CIE11` / `nom*CIE11` | 🧾 | ⛔ GAP | CIE-11 no parametrizable (WHO ICD-11); opcional. |
| `vrServicio` | 📄 `estudios[].p` | ✅ | tarifa heredada del contrato. |
| `conceptoRecaudo` | ∑ derivado | ⚠️ P1 | derivar figura→código 01/02/05 (C-05); **por-validar** (hoja de recaudo). |
| `valorPagoModerador` | ∑ Cálculo | ⚠️ P1 | `recaudoDe()`; consolidar por DT1 P18 (R-06); **por-validar**. |
| `numFEVPagoModerador` | ∑ | ⛔ GAP | liga el moderador a la FEV (RVC036). |
| `codigoVIDA` | 🧾 | ⛔ GAP | nuevo Res. 948. |
| `consecutivo` | ∑ | ∑ | índice del servicio. |

## 4 · Consulta (`Consulta`) — si el RIS factura lectura/consulta
Igual que procedimiento, con estas diferencias: `codConsulta` (en vez de `codProcedimiento`), **`causaMotivoAtencion`** (⛔ GAP, obligatorio), hasta **3 `codDiagnosticoRelacionado1/2/3`** (⛔ GAP), y **sin** `viaIngresoServicioSalud`/`codComplicacion`.

## 5 · Insumos → `Medicamento` / `OtroServicio`
El `Contrato.insumos` + `Orden.insumos` alimentan estos dos arreglos. Muchos campos son GAP.

**Medicamento (contraste/medicamento):**
| Campo RIPS | Origen | Estado |
|---|---|---|
| `codTecnologiaSalud` (CUM/IUM) · `nomTecnologiaSalud` | 📄 `insumos[].c/.n` | ✅ |
| `cantidadMedicamento` | 🧾 `insumos[].cantidad` | ✅ |
| `vrUnitMedicamento` · `vrServicio` | 📄/∑ | ✅/∑ |
| `tipoMedicamento` · `concentracionMedicamento` · `unidadMedida` · `formaFarmaceutica` · `unidadMinDispensa` · `diasTratamiento` · `fechaDispensAdmon` · dx · prof. · `vrDispensacion` | — | ⛔ **GAP (muchos)** |

**OtroServicio (dispositivo):** `codTecnologiaSalud`/`nomTecnologiaSalud` ✅ (📄), `cantidadOS` ✅ (🧾), `vrUnitOS` ✅ (📄); **GAP:** `tipoOS`, dx, prof., `fechaSuministroTecnologia`, `vrDispensacion`.

## 6 · Fuera de alcance del RIS de imágenes
`Urgencia`, `Hospitalizacion`, `RecienNacido` no aplican a un RIS ambulatorio de imágenes. El modelo unificado debe **poder representarlos** (por completitud del RIPS), pero la captura no los expone.

---

## 7 · Resumen: qué falta capturar para cerrar el transform
Campos **nuevos** que la Orden/Config deben aportar para producir un RIPS válido (agrupados por dónde deben vivir):

- **🏢 Config-IPS (una vez):** `numDocumentoIdObligado`, `codPrestador` (por sede REPS), `codServicio`, numeración DIAN (`numFactura`).
- **🔌 RIS (herencia de la atención):** `fechaInicioAtencion` (obligatoria).
- **🧾 Orden — por atención (nuevos campos):** documento del **profesional** (tipo+num), `modalidadGrupoServicioTecSal`, `grupoServicios`, `causaMotivoAtencion` (consultas), `codDiagnosticoRelacionado`/`codComplicacion`, `idMIPRES` (si aplica), `registroSIRAS` (si SOAT), `codPaisResidencia`/`codPaisOrigen` (default 170), `codigoVIDA`.
- **🧾 Orden — insumos:** los campos farmacéuticos de `Medicamento` y `tipoOS`/dx de `OtroServicio`.
- **∑ Cálculo/derivado:** `conceptoRecaudo` (código), `valorPagoModerador` (P1, por-validar), `numFEVPagoModerador`, `consecutivo`, mapeos `incapacidad` NO/SI y booleans.

## 8 · Forma del transform (Fase 4)
```
transformOrdenARips(orden, contrato, convenio, configIPS, fechaAtencion) → Rips
  cabecera  ← configIPS (numDocumentoIdObligado, numFactura)
  usuario   ← orden.pac  (+ defaults país, incapacidad NO/SI, crosswalk tipoUsuario)
  servicios.procedimientos ← orden.estudios.map(e => procedimientoDe(e, contrato, configIPS, ...))
  servicios.medicamentos   ← orden.insumos.filter(medicamento)
  servicios.otrosServicios ← orden.insumos.filter(dispositivo)
  // conceptoRecaudo/valorPagoModerador ← motor de recaudo (P1, tras validar la hoja)
```
Salida validada por `rips-validaciones.ts` (los ~40 RVC) → **el gate deja de mentir** (cierra X-01).

## Relacionado
- [[Dónde vive cada campo — FEV × RIS]] · [[Recaudo — hoja de validación (Acuerdo 260, por validar)]] · [[Modelo formal declarativo (reglas como dato)]] · [[reference-generador-rips-sibling]]
