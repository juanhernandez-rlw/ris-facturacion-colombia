---
tipo: nota
area: arquitectura
tema: facturacion
estado: en-construccion
fuentes: ["[[RIS — Colombia (Figma)]]", "[[Dónde vive cada campo — FEV × RIS]]"]
etiquetas: [arquitectura, requisitos, ris, rips, fev, fase-3]
actualizado: 2026-07-19
---

# Inventario del formulario de Orden × RIPS/FEV

> [!abstract] Fase 3 — inventario del front (Orden/Ingreso)
> Qué captura hoy el **formulario de creación de Orden** del RIS y si **cubre lo que exigen el RIPS y la FEV** a nivel de usuario/servicio. Marca coberturas y **gaps**.
> **Estado:** primera pasada. Las pantallas del Figma son **imágenes aplanadas**; los campos salen de la tarjeta *"Información de la orden"* (`126:13147`) + las anotaciones de los 4 pasos. Varios quedan `por confirmar` contra el formulario completo.

## Flujo de creación de Orden (4 pasos)
1. **Ingreso del paciente** — identidad + demografía + contacto + dirección + panel **Información de facturación**.
2. **Agendamiento** — sede/sala/fecha-hora (define la fecha de atención).
3. **Información del estudio** — datos del estudio + médico referente.
4. **Comentarios y archivos**.

## Inventario: campo del form → qué alimenta
**Estado:** ✅ visto · ⚠️ por confirmar · 🔴 gap (lo exige RIPS/FEV, no visto)

### Paciente (paso 1)
| Campo (form) | Alimenta | Estado |
|---|---|---|
| Nombre, 1.º/2.º apellido | RIPS usuario · FEV adquiriente (si Particular) | ✅ |
| Sexo biológico* | RIPS `codSexo` | ✅ |
| Fecha de nacimiento | RIPS `fechaNacimiento` (→ edad) | ✅ |
| Documento (**tipo** + número) | RIPS `tipoDocumentoIdentificacion` + `numDocumento` | ✅ selector de tipo (`TipoIdPISIS`, ej. PPT) + número |
| Contacto (teléfono, tel. adicional, correo) | (interno) | ✅ |
| **Residencia: País · Departamento · Municipio · Zona territorial** | RIPS `codPaisResidencia` / `codMunicipioResidencia` / `codZonaTerritorial` | ✅ confirmado en el form (paso 1, `260:31225`) |
| Dirección (texto) | (interno) | ✅ |
| **Tipo de usuario** | RIPS `tipoUsuario` | ✅ **se deriva del Convenio** (config del contrato) |
| **Incapacidad (SI/NO)** | RIPS `incapacidad` | ✅ checkbox |

### Estudio / servicio (paso 3)
| Campo (form) | Alimenta | Estado |
|---|---|---|
| Estudio (CUPS) | FEV `Item` · RIPS `codProcedimiento`/`codServicio` | ✅ |
| Precio | FEV `Price` · RIPS `vrServicio` (viene del **Contrato**, no se digita) | ✅ |
| Prioridad del estudio* | interno | ✅ |
| Médico asignado / Técnico radiólogo | profesional que **realiza** | ✅ |
| Médico referente (nombre, cédula, especialidad…) | profesional que **ordena** → RIPS | ✅ |
| Número de autorización | RIPS `numAutorizacion` · FEV | ✅ |
| Motivo del estudio | interno (texto libre) | ✅ |
| **Diagnóstico (CIE-10)** | RIPS `codDiagnosticoPrincipal` + `tipoDiagnosticoPrincipal` | ⚠️ "Información del estudio" tiene **6 dropdowns**; el doc solo nombra 4 → confirmar si el diagnóstico es uno |
| Vía de ingreso / Modalidad de atención | RIPS `viaIngresoServicioSalud` / `modalidadGrupoServicioTecSal` | ⚠️ ídem — ¿uno de los 6 dropdowns, o default? |
| Grupo de servicios / Finalidad | RIPS `grupoServicios`(02) / `finalidad`(15) | ✅ **default imagenología** (anotación) |

### Facturación (panel del paso 1)
| Campo (form) | Alimenta | Estado |
|---|---|---|
| Régimen del paciente | cobertura / tipoUsuario (del **Convenio**) | ✅ |
| Nivel de afiliación | interno | ✅ |
| Código de autorización | RIPS `numAutorizacion` | ✅ (dup con estudio) |
| Tipo de pago | `conceptoRecaudo` (copago/cuota) | ✅ |
| Valor en efectivo | `valorPagoModerador` recaudado | ✅ |
| Modalidad de pago | `MODALIDAD_PAGO` | ✅ baja del Convenio; **override permitido** en la orden |

### Agendamiento (paso 2)
| Sede/Sucursal · Sala · Fecha-hora | interno + **fecha de atención** → FEV `InvoicePeriod` / RIPS `fechaInicioAtencion` | ✅ |

## 🚩 Gaps — estado actualizado (2026-07-19)
- ✅ **Residencia** (País/Depto/Municipio/Zona territorial), **incapacidad** (checkbox), **tipo de documento** (selector `TipoIdPISIS`) y **contacto** → confirmados en el form de creación de orden (paso 1, `260:31225`).
- ✅ **Tipo de usuario** → se **deriva del Convenio** (config del contrato), no se captura.
- ✅ **Modalidad de pago** → baja del Convenio con **override permitido** en la orden.
- ⚠️ **Único pendiente — Diagnóstico (CIE-10) y Vía de ingreso:** la sección "Información del estudio" tiene **6 dropdowns** (metadata) pero la documentación solo nombra 4 (Prioridad, Médico asignado, Técnico radiólogo, Nº de autorización) + Motivo. **Falta confirmar** si diagnóstico y vía de ingreso son 2 de esos 6, o si son un gap real (el render de esa sección salió en blanco).

## Defaults de imagenología (no se digitan) — por anotación
`grupoServicios` = 02 (apoyo diagnóstico) · `finalidadTecnologiaSalud` = 15 (diagnóstico). *Confirmar vía de ingreso y modalidad de atención.*

## Propuesta de ubicación — diagnóstico y vía de ingreso (`inferido`)
- **Diagnóstico (CIE-10) + tipo de diagnóstico** → **capturar** en el bloque *Información del estudio*. CIE-10 como *typeahead* (**reusar el del `generador-rips`**); `tipoDiagnosticoPrincipal` por default **"impresión diagnóstica"** (dx presuntivo al ordenar imagenología).
- **Vía de ingreso** → dropdown en *Información del estudio* con default **"02 derivado de consulta externa"** (override **"01 demanda espontánea"** para particular).
- **Modalidad de atención** → default **"01 intramural"** (derivable de la sede/sucursal); no visible salvo unidad móvil.
- **Decisión clave (del usuario): ¿por estudio o por orden?** El agendamiento permite varios estudios/orden y el RIPS pide dx **por servicio** → recomendado **por estudio** (a nivel de línea); si casi siempre es mono-estudio, mostrar una vez y replicar.
- Probable que 2 de los **6 dropdowns** de *Información del estudio* ya sean éstos → confirmar.

## Fuentes / Relacionado
- [[Dónde vive cada campo — FEV × RIS]] · [[RIS — Colombia (Figma)]] · [[Diccionario de construcción de la FEV en salud]] · [[Inventario de cruces (RVC-RVG) — cobertura del validador]]
