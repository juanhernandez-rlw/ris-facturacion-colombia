---
tipo: nota
area: arquitectura
tema: facturacion
estado: en-construccion
fuentes: ["[[Inventario del formulario de Orden × RIPS-FEV]]", "[[Dónde vive cada campo — FEV × RIS]]", "[[Diccionario de construcción de la FEV en salud]]"]
etiquetas: [arquitectura, requisitos, ris, rips, fev, formulario, fase-3]
actualizado: 2026-07-19
---

# Formulario de Orden — spec reorganizada (RIPS + FEV)

> [!abstract] Fase 3 — el formulario completo
> Reorganiza el formulario de creación de Orden para que capture **todo** lo que exigen el **RIPS** (usuario + servicio) y la **FEV** (facturación). Cada campo trae su **control**, **origen**, **obligatoriedad** y a qué **campo RIPS/FEV** alimenta.
> **Estado:** propuesta (`inferido`) sobre datos `verificados`. **Asunciones a validar:** (1) diagnóstico y clínica **por estudio**; (2) la facturación **baja del Convenio**.

## Principios de diseño
1. **Capturar solo lo que varía por atención** (paciente, estudio, diagnóstico, recaudo).
2. **Derivar del Convenio** todo lo del pagador (cobertura, modalidad, retenciones…) → se muestran **solo lectura**, no se re-digitan.
3. **Predefinir lo estable** de imagenología (vía de ingreso, modalidad de atención, finalidad, grupo de servicios) con override.
4. **Calcular / integrar fuera del form** (precio, totales, numeración, CUFE, CUV).

## Leyendas
**Control:** `input` · `select` · `typeahead` (catálogo grande) · `toggle`/`check` · `date` · `multiselect` · `readonly`
**Origen:** ✍️ captura · 🤝 derivado del Convenio (RO) · ⚙️ default (editable) · 🔢 calc/tarifa (RO) · 🏢 config (sede/IPS) · 🔌 integración (fuera del form)
**Ob.:** ● obligatorio · ◐ condicional · ○ opcional

---

## Paso 1 · Paciente
> Alimenta el **usuario** del RIPS y, si es Particular, el **adquiriente** de la FEV.

### 1a · Identificación
| Campo | Control | Origen | Ob. | Alimenta |
|---|---|---|---|---|
| Buscar/crear paciente | typeahead | ✍️ | ● | — |
| Tipo de documento | select (`TipoIdPISIS`) | ✍️ | ● | RIPS `tipoDocumentoIdentificacion` |
| Número de documento | input | ✍️ | ● | RIPS `numDocumentoIdentificacion` |

### 1b · Datos personales
| Campo | Control | Origen | Ob. | Alimenta |
|---|---|---|---|---|
| Nombres | input | ✍️ | ● | RIPS / FEV (si particular) |
| Primer apellido | input | ✍️ | ● | " |
| Segundo apellido | input | ✍️ | ○ | " |
| Fecha de nacimiento | date | ✍️ | ● | RIPS `fechaNacimiento` (→ edad) |
| Sexo biológico | select | ✍️ | ● | RIPS `codSexo` |
| Incapacidad | check | ✍️ | ● | RIPS `incapacidad` (SI/NO) |

### 1c · Contacto
| Teléfono · Teléfono adicional · Correo | input | ✍️ | ○ | (interno) |

### 1d · Residencia
| Campo | Control | Origen | Ob. | Alimenta |
|---|---|---|---|---|
| País | select | ⚙️ (def. 170 Colombia) | ● | RIPS `codPaisResidencia` |
| Departamento | select | ✍️ | ● | (deriva municipio) |
| Municipio | typeahead (DANE) | ✍️ | ● | RIPS `codMunicipioResidencia` |
| Zona territorial | select | ✍️ | ● (si país=170) | RIPS `codZonaTerritorialResidencia` |
| Dirección | input | ✍️ | ○ | (interno) |
| País de origen | select | ✍️ | ◐ (migrante) | RIPS `codPaisOrigen` |

---

## Paso 2 · Convenio y cobertura  *(nuevo bloque — surge del modelo)*
> Al elegir el **Convenio** del paciente, **baja** todo el contexto de pago. La mayoría es **solo lectura**.

| Campo | Control | Origen | Ob. | Alimenta |
|---|---|---|---|---|
| **Convenio** | select | ✍️ | ● | (llave; trae lo de abajo) |
| Pagador / adquiriente | readonly | 🤝 | ● | FEV `AccountingCustomerParty` |
| Régimen | readonly | 🤝 | ● | (contexto) |
| Tipo de entidad resp. de pago | readonly | 🤝 | ● | FEV |
| Cobertura / plan | readonly | 🤝 (`coberturaPlan`) | ● | FEV `COBERTURA_PLAN_BENEFICIOS` |
| Modalidad de pago | select | 🤝 + **override** | ● | FEV `MODALIDAD_PAGO` |
| Factura sin contrato (+ caso) | readonly | 🤝 (`facturaSinContrato`) | ◐ | FEV `FACTURA_SIN_CONTRATO` |
| Retenciones / responsable IVA | readonly | 🤝 | ● | FEV `TaxTotal` |
| Forma / medio de pago · plazo | readonly | 🤝 | ● | FEV `PaymentMeans` |
| Nivel de afiliación | select | ✍️ | ◐ | (interno) |
| **Número de autorización** | input | ✍️ | ◐ (si convenio lo exige) | RIPS `numAutorizacion` · FEV |
| **Número de póliza** | input | ✍️ | ◐ (SOAT/voluntario) | FEV `NUMERO_POLIZA` |
| ID MIPRES · ID SIRAS | input | ✍️ | ◐ (flags convenio) | RIPS |

---

## Paso 3 · Agendamiento
> Define el **estudio (CUPS)**, la **sede** y la **fecha de atención**.

| Campo | Control | Origen | Ob. | Alimenta |
|---|---|---|---|---|
| Estudios a agendar | multiselect (`CUPSRips`) | ✍️ | ● | RIPS `codProcedimiento`/`codServicio` · FEV `Item` |
| Sucursal / sede | select | ✍️ | ● | RIPS `codPrestador` · def. `modalidadAtencion` |
| Fecha · hora · sala | calendario | ✍️ | ● | RIPS `fechaInicioAtencion` · FEV `InvoicePeriod` |

---

## Paso 4 · Información del estudio  *(se repite por estudio)*
> El bloque **clínico**. Aquí entran diagnóstico y vía de ingreso.

| Campo | Control | Origen | Ob. | Alimenta |
|---|---|---|---|---|
| Estudio (CUPS) | readonly | (heredado del paso 3) | ● | RIPS `codProcedimiento` |
| Prioridad | select | ✍️ | ● | (interno) |
| **Diagnóstico principal (CIE-10)** | typeahead (`CIE10`, reusar generador-rips) | ✍️ | ● | RIPS `codDiagnosticoPrincipal` |
| **Tipo de diagnóstico** | select | ⚙️ (def. impresión diagnóstica) | ● | RIPS `tipoDiagnosticoPrincipal` |
| Diagnóstico(s) relacionado(s) | typeahead | ✍️ | ◐ | RIPS `codDiagnosticoRelacionado` |
| Médico que **ordena** (referente): tipo doc + cédula, nombre, especialidad | input/select | ✍️ | ● | RIPS doc. profesional que ordena |
| Médico que **realiza** (asignado) / Técnico radiólogo | select | ✍️ | ● | RIPS doc. profesional que realiza |
| Motivo del estudio | textarea | ✍️ | ○ | (interno) |
| **Vía de ingreso** | select | ⚙️ (def. 02 derivado consulta externa) | ● | RIPS `viaIngresoServicioSalud` |
| **Modalidad de atención** | select | ⚙️ (def. 01 intramural, de la sede) | ● | RIPS `modalidadGrupoServicioTecSal` |
| Finalidad | select | ⚙️ (def. 15 diagnóstico) | ● | RIPS `finalidadTecnologiaSalud` |
| Grupo de servicios | select | ⚙️ (def. 02 apoyo diagnóstico) | ● | RIPS `grupoServicios` |

*(Los 4 últimos, colapsables en "Avanzado" — casi siempre el default.)*

---

## Paso 5 · Recaudo (caja)  *(por estudio o por orden)*
> Lo que se cobra al usuario; cuadra RIPS ↔ FEV.

| Campo | Control | Origen | Ob. | Alimenta |
|---|---|---|---|---|
| Concepto de recaudo | select (`conceptoRecaudo` 01–05) | ✍️ | ● | RIPS `conceptoRecaudo` |
| Valor recaudado | input (≥0) | ✍️ | ◐ | RIPS `valorPagoModerador` · FEV `PrepaidPayment` (copago/cuota/pagos compartidos) |
| Precio del estudio | readonly | 🔢 (tarifa del Contrato) | ● | RIPS `vrServicio` · FEV `Price` |
| Total a pagar | readonly | 🔢 | ● | FEV `LegalMonetaryTotal` |

---

## Paso 6 · Comentarios y archivos
| Comentarios · Archivos adicionales | textarea / uploader | ✍️ | ○ | (interno) |

---

## Fuera del formulario (calc / integración — no se digita)
- **Numeración** (`numFactura`): el RIS asigna el consecutivo del rango DIAN (config).
- **CUCON**: readonly, lo expide el SIIFA al registrar el contrato.
- **CUFE / SS-CUFE · QR · SoftwareSecurityCode**: timbrado (Loggro/DIAN).
- **CUV**: MUV (MinSalud).
- Totales, impuestos: motor de cálculo.

## Asunciones y decisiones abiertas (para afinar)
1. **Por estudio vs por orden** — diagnóstico/clínica/recaudo modelados **por estudio** (lo que pide el RIPS). Si el 95% son mono-estudio, mostrar una vez y replicar.
2. **Convenio como llave** — todo el pago baja de él; ¿se permite override además de en modalidad de pago?
3. **Paso 2 nuevo** ("Convenio y cobertura") separa lo derivado de lo capturado; se puede fusionar visualmente con el paso 1 si prefieren menos pasos.
4. Confirmar los **6 dropdowns** actuales de "Información del estudio" para ver qué de esto **ya existe** vs. hay que **agregar**.

## Wireframe / prototipo
- ⭐ **Prototipo de flujo completo (navegable · abrir en el navegador):** `generador-rips/prototipos/prototipo-convenio-contrato-orden.html` (repo hermano) — 3 módulos encadenados **Convenios → Contratos (con tarifa) → Orden** (selector de contrato **en cascada**: solo muestra lo parametrizado; valida vigencia; gate RIPS+FEV). Supuesto **"orden = un contrato"** ([[Preguntas abiertas|#12]], marcado en el propio prototipo).
- Wireframe previo (solo el formulario de orden): `generador-rips/prototipos/orden-wireframe.html` (repo hermano)

## Fuentes / Relacionado
- [[Inventario del formulario de Orden × RIPS-FEV]] · [[Dónde vive cada campo — FEV × RIS]] · [[Diccionario de construcción de la FEV en salud]] · [[RIS — Colombia (Figma)]]
