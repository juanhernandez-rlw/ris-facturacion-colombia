---
tipo: diccionario
area: modelo-datos
tema: facturacion
estado: en-construccion
fuentes: ["[[SISPRO — Micrositio FEV-RIPS]]"]
etiquetas: [modelo-datos, facturacion, fev, salud]
actualizado: 2026-07-19
---

# Diccionario de construcción de la FEV en salud

> [!abstract] Fase 0 + Fase 1 del plan de campos de facturación
> Catálogo campo-por-campo de la **Factura Electrónica de Venta en salud (FEV)**: de cada dato que exige la factura, **qué es, de dónde sale en nuestra solución y cómo se construye**. Meta: derivar **qué debe capturar el front del RIS** y probar que es **suficiente** para construir una FEV válida.

> [!warning] Estado: borrador en construcción
> - La **extensión de salud** está `verificada` contra el DT2 v001.
> - Los **campos base** están **verificados** contra el **XSD UBL 2.1 + `DIAN_UBL_Structures` + el anexo v1.9** (Caja de herramientas V2026, en `_Adjuntos/DIAN FEV v1.9/`) — ver §Verificación XSD.
> - La columna **Origen** es una **propuesta de diseño** (`inferido`): se valida contra la arquitectura real del RIS en la Fase 3.

## Alcance y fuentes de la verdad
| Capa | Fuente | Estado |
|---|---|---|
| Extensión de salud (campos DT2) | **Documento Técnico 2 v001** (2026-07-01), en [[SISPRO — Micrositio FEV-RIPS]] | `verificado` |
| Factura base (envelope UBL/DIAN) | **Anexo Técnico FEV v1.9** (Res. DIAN 000165/2023; Caja de herramientas FE **V19 V2026**) | gobernante · cruce fino `por-verificar` |
| Estructura real de referencia | `FE_ERT3000.xml` — FEV en salud real con `ApplicationResponse` = "Documento validado por la DIAN" | `verificado` (existencia/estructura) |
| Enums / catálogos | **Tablas vivas de SISPRO** (`coberturaPlan`, `modalidadPago`, `facturaSinContrato`, `conceptoRecaudo`, `TipoIdPISIS`…) | `verificado en vivo 2026-07-19` (ver §Catálogos) |

## Leyendas
**Origen del dato** (propuesta de diseño):

| Código | Significado | ¿Va al front? |
|---|---|---|
| `FRONT` | Se captura en atención / admisión / caja | ✅ **sí** |
| `RIPS` | Ya se captura para el RIPS → reutilizar (capturar una vez) | ♻️ **sí (reuso)** |
| `MAESTRO` | Config del prestador / pagador / contratos / tarifas | ❌ config |
| `CALC` | Lo calcula el motor de facturación | ❌ |
| `DEFAULT` | Constante / valor fijo | ❌ |
| `INTEGR` | Lo genera Loggro / DIAN / MUV en el timbrado | ❌ |

**Estado por fila:** `verificado` · `inferido` (diseño propuesto) · `por-verificar` (+ fuente).

## Panorama: qué construye la app vs. qué genera el timbrado
La FEV real es un **contenedor** (`AttachedDocument`) que envuelve la **`Invoice`** + las `DianExtensions` (CUFE, autorización, QR) + el `ApplicationResponse` de la DIAN.

- **La app del RIS construye:** el cuerpo de la **`Invoice`** (secciones A–H) + la **extensión de salud** (I).
- **Loggro / DIAN generan (origen `INTEGR`, fuera del front):** el contenedor `AttachedDocument`, las `DianExtensions` (`SoftwareSecurityCode`, **CUFE/`SS-CUFE`**, `QRCode`) y el `ApplicationResponse`.
- **Numeración (decisión edenmed 2026-07-19):** la resolución de numeración DIAN es **de la institución**; el **RIS asigna el consecutivo** dentro del rango autorizado y arma el `InvoiceControl` (`InvoiceAuthorization` = nº de resolución, `AuthorizationPeriod` = vigencia ≤2 años, `AuthorizedInvoices` = prefijo/desde/hasta). Loggro **valida** la resolución (`consultarInformacionResolucionDIAN`) y **timbra**. El **CUFE** usa la **clave técnica** de esa resolución → confirmar con Loggro si lo computa él o lo embebe el RIS.

---

## Catálogo por secciones

### A · Cabecera de la factura — `Invoice` envelope
Base: `/Invoice/cbc:*` · Gobernante: anexo DIAN v1.9

| Campo | Tipo / long | Oblig. | Origen | Construcción / dominio | Estado |
|---|---|---|---|---|---|
| `UBLVersionID` | texto | 1..1 | `DEFAULT` | `"UBL 2.1"` | `verificado` |
| `CustomizationID` | texto | 1..1 | `CALC` | **tipo de operación salud** (ver §J). Caso típico `SS-CUFE` (acredita recaudos). Define si la factura lleva extensión de salud y si activa el método de cálculo | `verificado` (DT2 §9) |
| `ProfileID` | texto | 1..1 | `DEFAULT` | `"DIAN 2.1: Factura Electrónica de Venta"` | `verificado` |
| `ProfileExecutionID` | 1\|2 | 1..1 | `INTEGR` | 1 = producción, 2 = pruebas (según ambiente) | `verificado` |
| `ID` (numFactura) | alfanum | 1..1 | `MAESTRO`+`CALC` | prefijo + **consecutivo que asigna el RIS** dentro del rango autorizado por la DIAN (Formato 1876). El RIS controla la secuencia (sin saltos/duplicados, dentro de rango y vigencia) | `verificado` (Res. 000042/2020 art. 38) |
| `UUID` (CUFE) | `CUFE-SHA384` | 1..1 | `INTEGR` | hash **SS-CUFE** computado en el timbrado | `verificado` |
| `IssueDate` / `IssueTime` | fecha/hora | 1..1 | `CALC` | fecha-hora de emisión (sistema) | `verificado` |
| `DueDate` | fecha | 0..1 | `CALC`/`FRONT` | fecha de vencimiento (condición de pago / contrato) | `por-verificar` |
| `InvoiceTypeCode` | cod | 1..1 | `DEFAULT` | `"01"` (factura de venta) | `verificado` (ejemplo) |
| `DocumentCurrencyCode` | cod | 1..1 | `DEFAULT` | `"COP"` | `verificado` |
| `LineCountNumeric` | entero | 1..1 | `CALC` | nº de líneas | `verificado` |
| `InvoicePeriod/StartDate`·`EndDate` | fecha (10) | **1..1 oblig.** | `RIPS` | fecha inicio/fin del periodo (§4.10/4.11 = fechas de atención). Hospitalización/urgencias por cápita/PGP con ingreso previo → `StartDate` = fecha de ingreso. `StartTime`/`EndTime` opcionales. **Rechazo si faltan (DND100/101)** | `verificado` (DT2 §7/§11) |

### B · Emisor / prestador — `AccountingSupplierParty`
Todo el bloque = **datos del prestador facturador** → `MAESTRO` (config única, no captura por atención).

| Campo | Origen | Construcción / dominio | Estado |
|---|---|---|---|
| `AdditionalAccountID` (1 natural / 2 jurídica) | `MAESTRO` | tipo de persona del prestador | `verificado` (ejemplo) |
| `PartyName/Name`, `PhysicalLocation/Address` (municipio DANE, depto, país, dirección) | `MAESTRO` | domicilio del prestador | `por-verificar` |
| `PartyTaxScheme/CompanyID` (NIT) + `@schemeName`='31' + `@schemeID` (DV) + `TaxLevelCode` | `MAESTRO` | del RUT del prestador; `schemeName`='31' y dígito de verificación obligatorios | `verificado` (DT2 §11.3 VFE011/012) |
| `PartyLegalEntity` (razón social, `CorporateRegistrationScheme`=prefijo) | `MAESTRO` | del RUT / resolución de numeración | `por-verificar` |
| `Contact` (tel, correo) | `MAESTRO` | contacto del prestador | `verificado` (ejemplo) |

### C · Adquiriente / pagador o paciente — `AccountingCustomerParty`
⚠️ **Bifurcación clave** según cobertura: el "cliente" de la factura es el **pagador (ERP/aseguradora)** cuando hay responsable de pago; es el **paciente** cuando es `Particular`.

| Campo | Origen | Construcción / dominio | Estado |
|---|---|---|---|
| `AdditionalAccountID` (1/2) | `MAESTRO`/`RIPS` | jurídica (pagador) / natural (paciente) | `verificado` (ejemplo) |
| `PartyName`, `Address` | `MAESTRO` (pagador) · `RIPS` (paciente) | razón social del pagador **o** datos del paciente | `inferido` |
| `PartyTaxScheme/CompanyID` (NIT pagador **o** documento del paciente) + `TaxLevelCode` | `MAESTRO` (pagador) · `RIPS` (paciente) | identidad del responsable de pago | `inferido` |
| `PartyLegalEntity`, `Contact` | `MAESTRO`/`RIPS` | según el caso anterior | `inferido` |

> Tipo de documento del adquiriente/paciente → tabla `TipoIdPISIS` (no válidas las opciones "sin identificar"; menor de edad solo en el grupo `Person`). **VFE022:** el pagador informado debe corresponder a la **cobertura** facturada.

### D · Medios de pago — `PaymentMeans`
| Campo | Origen | Construcción / dominio | Estado |
|---|---|---|---|
| `ID` (1 contado / 2 crédito) | `FRONT`/`MAESTRO` | condición de pago pactada | `por-verificar` |
| `PaymentMeansCode` | `FRONT`/`MAESTRO` | forma de pago (catálogo DIAN, p.ej. 30 transferencia) | `por-verificar` |
| `PaymentDueDate` | `CALC` | si crédito, según plazo | `por-verificar` |

### E · Recaudos del usuario — copago · cuota moderadora · pagos compartidos · anticipo
**DT2 §4.6–4.9.** Valores efectivamente **recaudados al usuario**. Se registran en `/Invoice/cac:PrepaidPayment` (un fragmento por concepto) y acumulan en `/Invoice/cac:LegalMonetaryTotal/cbc:PrepaidAmount`, que **no puede superar el total** de la factura. Solo participan cuando la factura **acredita** los recaudos (tipos `SS-CUFE/CUDE/POS/SNum`, ver §J). **Rechazo** si falta `PrepaidPayment.ID.schemeID` (DND104) o `PaidAmount` (DND105). El concepto de cada recaudo usa la tabla `conceptoRecaudo` (§10.d); el concepto **Anticipos** aplica solo en la FEV, no en el RIPS.

| Campo | Tipo | Oblig. | Origen | Construcción / dominio | Estado |
|---|---|---|---|---|---|
| `COPAGO` | num ≥0, punto decimal | cond. (por usuario/multiusuario) | `FRONT` | valor recaudado en caja; **= Σ copagos del RIPS** | `verificado` (DT2) |
| `CUOTA_MODERADORA` | num ≥0 | cond. | `FRONT` | recaudado; **= Σ cuotas moderadoras del RIPS** | `verificado` (DT2) |
| `PAGOS_COMPARTIDOS` | num ≥0 | cond. (planes voluntarios) | `FRONT` | recaudado; **= Σ pagos compartidos del RIPS** | `verificado` (DT2) |
| `ANTICIPO` | num ≥0 | cond. (si pactado) | `MAESTRO`/`CALC` | anticipo a legalizar del contrato (§3.4) | `verificado` (DT2) |

> El **valor** de copago/cuota moderadora se **calcula desde el nivel de contribución** del paciente (Acuerdo 260): **cuota moderadora** = valor fijo por nivel; **copago** = % × tarifa con tope. → [[Cuota moderadora y copago (recaudo del usuario)]].

### F · Totales — `LegalMonetaryTotal` → todo `CALC`
`LineExtensionAmount`, `TaxExclusiveAmount`, `TaxInclusiveAmount`, `PrepaidAmount`, `PayableAmount` → los calcula el motor a partir de las líneas + impuestos + anticipos. `verificado` (ejemplo).

### G · Impuestos — `TaxTotal` / `TaxSubtotal`
| Campo | Origen | Construcción / dominio | Estado |
|---|---|---|---|
| `TaxAmount`, `TaxSubtotal`, `TaxCategory/Percent`, `TaxScheme` (ID/Name: 01 IVA, ZZ No aplica…) | `CALC` + `MAESTRO` | según naturaleza tributaria del ítem (buena parte de salud = **excluido/exento de IVA**) | `por-verificar` |

> Si el ítem es **gravado**, `InvoiceLine/TaxTotal/TaxAmount` (DND114) y `tributoInfo/TaxableAmount` (DND116) son **obligatorios** (rechazo si faltan).

### H · Líneas — `InvoiceLine` (servicios y tecnologías)
El **puente con el RIPS**: los servicios facturados son los mismos prestados/registrados.

| Campo | Origen | Construcción / dominio | Estado |
|---|---|---|---|
| `ID` | `CALC` | consecutivo de línea | `verificado` |
| `InvoicedQuantity` + `@unitCode` | `RIPS`/`FRONT` | cantidad del servicio/tecnología | `por-verificar` |
| `Item/Description` | `RIPS`/`MAESTRO` | descripción del servicio | `verificado` (ejemplo) |
| `Item/StandardItemIdentification/ID` | `RIPS` | **código del servicio/tecnología (CUPS / CUM-IUM…)** ya capturado en el RIPS | `inferido` |
| `Price/PriceAmount` + `BaseQuantity` | `MAESTRO`/`CALC` | tarifa (contrato / manual tarifario) | `por-verificar` |
| `LineExtensionAmount` | `CALC` | cantidad × precio | `verificado` |

> Las líneas incluyen **estudios** (CUPS) e **insumos**: medicamentos (contraste → **CUM/IUM**) en `medicamentos[]` y dispositivos/insumos (**UDI/IDM**, Res. 1405/2022) en `otrosServicios[]` del RIPS. Cada insumo es una `InvoiceLine` propia y **cuadra** con su valor RIPS. → [[Insumos (medicamentos y otros servicios)]].

### I · Extensión de salud — `CustomTagGeneral / Interoperabilidad`
DT2 §6. Ruta: `…/UBLExtension[2]/…/CustomTagGeneral/Interoperabilidad/Group[@schemeName="Sector Salud"]/Collection[@schemeName="Usuario"]/AdditionalInformation[Name/Value]`. **Rechazo si falta `CustomTagGeneral` (DND060)**. No se incluye en operaciones `SS-Recaudo`.

| Campo (`Name`) | Tipo / long | Oblig. | Origen | Construcción / dominio | Estado |
|---|---|---|---|---|---|
| `CODIGO_PRESTADOR` | alfanum, 10 díg | 1..1 | `MAESTRO` | código REPS `IPSCodHabilitacion` (col `Extra_III:CodigoPrestador`) o `IPSnoREPS`; **debe = NIT del facturador** | `verificado` (DT2) |
| `MODALIDAD_PAGO` | texto, 1–40 | 1..1 | `RIPS` | tabla `modalidadPago` (4 hab.: 01–04; ver §Catálogos) | `verificado` (DT2 + tabla viva) |
| `COBERTURA_PLAN_BENEFICIOS` | texto | 1..1 | `RIPS` | tabla `coberturaPlan` (**17 códigos** vigentes; ver §Catálogos) | `verificado` (DT2 + tabla viva) |
| `NUMERO_CONTRATO` | alfanum | cond. (si hay contrato) | `MAESTRO` | nº de contrato; a futuro el **CUCON** (Ley 1966/2019) | `verificado` (DT2) |
| `NUMERO_POLIZA` | alfanum | cond. (SOAT / plan voluntario) | `FRONT` | nº de póliza SOAT o de plan voluntario | `verificado` (DT2) |
| `FACTURA_SIN_CONTRATO` | numérico | cond. (7 casos) | `FRONT`/`RIPS` | tabla `facturaSinContrato` (7 códigos 01–07; ver §Catálogos). *Validación inicial = Notificación* | `verificado` (DT2 + tabla viva) |
| `COPAGO` / `CUOTA_MODERADORA` / `PAGOS_COMPARTIDOS` / `ANTICIPO` | ver sección E | cond. | `FRONT` | referenciados también aquí | `verificado` (DT2) |

### J · Tipos de operación salud — `/Invoice/cbc:CustomizationID`
Define la naturaleza del documento y **si activa el método de cálculo** del sector salud. (DT2 §8–§9, `verificado`.)

| Código | Tipo | ¿Extensión salud? | ¿Método de cálculo? |
|---|---|---|---|
| `SS-CUFE` | Acreditación — referencia FEV (01/04) que comprueba recaudo de copagos/cuotas + legaliza anticipos | ✅ sí | ✅ activa |
| `SS-CUDE` | Acreditación — referencia factura de contingencia (03) | ✅ sí | ✅ activa |
| `SS-POS` | Acreditación — referencia doc. equivalente POS | ✅ sí | ✅ activa |
| `SS-SNum` | Acreditación — referencia factura talonario | ✅ sí | ✅ activa |
| `SS-Recaudo` | Recaudación — comprobante de recaudo (se expide individual por usuario) | ❌ **no** | ❌ no |
| `SS-Reporte` | Reporte — recaudos ya con tratamiento contable | ✅ sí | ❌ no |
| `SS-SinAporte` | Reporte — sin aporte ni recaudo en dinero | ✅ sí | ❌ no |

- **Método de cálculo** (`SS-CUFE/CUDE/POS/SNum`): los valores acreditados se acumulan por concepto en `cac:PrepaidPayment` → `LegalMonetaryTotal/PrepaidAmount` (≤ total de la factura).
- **NC/ND:** el MUV solo admite los tipos **20** (nota crédito) y **30** (nota débito) que referencian una FEV (la DIAN define además `22`/`32` sin referencia, **no** usados en salud). Cada nota lleva **concepto de corrección** obligatorio (`DiscrepancyResponse/ResponseCode`: tabla **13.2.4** NC · **13.2.5** ND). **Valores (DT1 v002 pág. 84–85):** en NC el valor del servicio ≤ lo facturado (Σ RIPS = valor de la NC); la **ND sí admite valores**; en ambas los **pagos moderadores van en 0**. Flujo, campos y códigos: [[Notas crédito y débito (NC · ND) — flujo, campos y reglas]].
- El **caso típico del RIS** (cobro de servicios a un pagador, acreditando copagos/cuotas) es **`SS-CUFE`**.

### K · Validaciones del MUV (rechazos) — DT2 §11
Reglas que **rechazan** el conjunto FEV+RIPS si no se cumplen (selección `verificada`):

| Código | Regla |
|---|---|
| `VFE003` | `CustomizationID` debe ser un tipo de operación **válido del sector salud** (§J) |
| `VFE005` / `VFE006-007` | `Invoice.ID` y `UUID` (CUFE) válidos y no vacíos |
| `VFE011` / `VFE012` | NIT del prestador: `schemeName`='31' y dígito de verificación obligatorios |
| `VFE020` / `VFE021` | `InvoicePeriod` inicio/fin obligatorios |
| **`VFE022`** | la **ERP/pagador** informada debe corresponder a la **cobertura** facturada |
| **`PFP001`** | el **número de la FEV debe coincidir con el reportado en el RIPS** |
| `GI013` / `GI014` | el CUFE debe estar registrado en el MSPS y la `Invoice` corresponder a la aprobada por la DIAN |
| `RVG018` | el periodo de facturación **no puede ser anterior a 2024-10-01** (o al inicio del grupo) |
| `PFR001` | el CUV debe corresponder a los datos de XML+JSON enviados |

> El **CUV** solo se genera tras el almacenamiento exitoso en el MSPS (§11.4).

---

## ⭐ Resumen: campos que el front del RIS debe disponibilizar
Solo los orígenes `FRONT` + `RIPS`. Agrupados por momento de captura:

**1. Admisión / identificación (paciente y responsable de pago)**
- Identidad del paciente (tipo y nº de documento, nombres, sexo, fecha de nacimiento, municipio) → **ya en RIPS** ♻️.
- **Cobertura / plan de beneficios** (`coberturaPlan`) → ya en RIPS ♻️.
- **Modalidad de pago** (`salud_modalidad_pago.gc`) → ya en RIPS ♻️.
- Responsable de pago (pagador/ERP) o marca de **Particular**; si aplica, **nº de póliza** (SOAT / plan voluntario) 🆕.
- **Factura sin contrato** (cuál de los 7 casos), cuando no hay contrato 🆕.

**2. Atención / servicios (líneas de la factura)**
- Servicios y tecnologías prestados con su **código (CUPS / CUM-IUM)** y cantidad → ya en RIPS ♻️.
- Fechas de la atención → periodo de facturación (§4.10/4.11) → ya en RIPS ♻️.

**3. Facturación / caja (recaudos y condiciones)**
- **Copago, cuota moderadora, pagos compartidos** efectivamente recaudados 🆕 (deben cuadrar con el RIPS).
- Condición y **forma de pago** (contado/crédito, medio) 🆕.

**4. Configuración / maestros (una vez, no por atención)** — `MAESTRO`, fuera del front de atención
- Datos del prestador (NIT, RUT, REPS, `CODIGO_PRESTADOR`, resolución de numeración, domicilio).
- Contratos con pagadores (`NUMERO_CONTRATO` / CUCON) y **tarifas**.

> **Lectura clave:** la mayoría de campos del front **ya existen para el RIPS** (reuso ♻️). Lo genuinamente nuevo del front (🆕) es acotado: **responsable de pago / particular, nº de póliza, factura-sin-contrato, y los recaudos (copago/cuota/pagos compartidos) + la condición de pago**. Todo lo demás es maestro, cálculo, default o timbrado.

## Cuadres FEV ↔ RIPS (capturar una vez, validar consistencia)
Campos compartidos que **deben coincidir** entre factura y RIPS: identidad del paciente · `MODALIDAD_PAGO` · `COBERTURA_PLAN_BENEFICIOS` · `NUMERO_CONTRATO` · códigos de servicios (CUPS/CUM) · **copago/cuota/pagos compartidos (Σ RIPS = valor FEV)** · NIT prestador · valores. → materializa los ~15 cruces "externos" del [[Inventario de cruces (RVC-RVG) — cobertura del validador]].

**Cuadres verificados (DT2 §11.3):** número de FEV **=** número reportado en el RIPS (**PFP001**); pagador **↔** cobertura (**VFE022**); el CUFE debe estar registrado en el MSPS (GI013).

## Catálogos de referencia (tablas vivas de SISPRO)
> Capturados **en vivo** de `web.sispro.gov.co` el **2026-07-19** (Reglas §1.6; fuente de la verdad para enums). Dato traído tal cual: Código · Nombre · Habilitado · Fecha_Actualizacion.

### `coberturaPlan` — 17 códigos, todos habilitados (act. 2026-07-03)
| Cód | Nombre |
|---|---|
| 01 | Plan de beneficios en salud financiado con UPC |
| 02 | Presupuesto máximo |
| 03 | Prima EPS / EOC, no asegurados SOAT |
| 04 | Cobertura Póliza SOAT |
| 05 | Cobertura ARL |
| 06 | Cobertura ADRES |
| 07 | Cobertura Salud Pública |
| 08 | Cobertura entidad territorial, recursos de oferta |
| 09 | Urgencias población migrante |
| 10 | Plan complementario en salud |
| 11 | Plan medicina prepagada |
| 12 | Otras pólizas en salud |
| 13 | Cobertura Régimen Especial o Excepción |
| 14 | Cobertura Fondo Nacional de Salud de las Personas Privadas de la Libertad |
| 15 | Particular |
| 16 | Plan de beneficios en salud financiado con UPC Contributivo |
| 17 | Plan de beneficios en salud financiado con UPC Subsidiado |

> **Reconciliación 16 (DT2) vs 17 (tabla viva):** la tabla viva incluye el código `01` "…financiado con UPC" (genérico) **además** de los desglosados Contributivo (16) y Subsidiado (17); el DT2 §4.3 solo enumera los dos desglosados (i, xvi) → **usar la tabla viva (17)**.

### `modalidadPago` — 4 habilitados (act. 2025-11-14)
| Cód | Nombre | Hab |
|---|---|---|
| 01 | Pago individual por caso / Conjunto integral de atenciones / Paquete / Canasta | SI |
| 02 | Pago global prospectivo | SI |
| 03 | Pago por capitación | SI |
| 04 | Pago por evento | SI |
| 05 | Otra modalidad (específica) | **NO** |

### `facturaSinContrato` — 7 códigos, todos habilitados (act. 2026-07-11)
| Cód | Nombre |
|---|---|
| 01 | Atención de urgencias |
| 02 | Atención a cargo de ADRES o de aseguradora SOAT, planes voluntarios de salud |
| 03 | Atención en salud por fallos de tutela / órdenes judiciales |
| 04 | Atención en salud por portabilidad o asignación masiva de afiliados (Art. 2.5.3.4.7.9 Decreto 780/2016) |
| 05 | Atención en salud en casos excepcionales por cotizaciones o autorizaciones sin contrato |
| 06 | Gestión recuperación de órganos para trasplante (Ley Estatutaria 1751 de 2015) |
| 07 | Prestación de servicio a paciente particular |

### `conceptoRecaudo` — 5 códigos, todos habilitados (act. 2025-05-16)
| Cód | Nombre |
|---|---|
| 01 | Copago |
| 02 | Cuota moderadora |
| 03 | Pagos compartidos en planes voluntarios de salud |
| 04 | Anticipo *(solo FEV, no RIPS)* |
| 05 | No aplica |

## Verificación de campos base contra XSD + anexo v1.9 (`verificado` 2026-07-19)
Cruzados contra `UBL-Invoice-2.1.xsd`, `DIAN_UBL_Structures.xsd` y el **anexo técnico v1.9** (Caja de herramientas FE V19 V2026; ingeridos en `_Adjuntos/DIAN FEV v1.9/`).

> **Hallazgo clave:** el **XSD de UBL es permisivo** — varios campos que la DIAN/salud exigen son estructuralmente `0..1`/`0..N`; su obligatoriedad viene de **reglas de negocio** (anexo DIAN + Schematron; y **DT2 §11** para salud), no del esquema.

- **Obligatorios por estructura (XSD `1..1` / `1..N`):** `cbc:ID` · `cbc:IssueDate` · `cac:AccountingSupplierParty` · `cac:AccountingCustomerParty` · `cac:LegalMonetaryTotal` · `cac:InvoiceLine` (**1..N**, ≥1).
- **Opcionales en UBL, obligatorios por regla DIAN/salud:** `UBLVersionID` · `CustomizationID` (VFE003) · `ProfileID` · `UUID`/CUFE (VFE006/007) · `InvoiceTypeCode` · `DocumentCurrencyCode` · `InvoicePeriod` (VFE020/021 · DT2 §7) · NIT emisor `@schemeName='31'`+DV (VFE011/012).
- **Cardinalidad DIAN de grupos (anexo):** `cac:PaymentMeans` **1..N** (≥1) · `cac:TaxTotal` `0..N` · `cac:PrepaidPayment` `0..N` (recaudos) · `AdditionalAccountID` `1..1`.
- **Numeración (`DIAN_UBL_Structures.xsd`):** `InvoiceControl` → `InvoiceAuthorization` · `AuthorizationPeriod` · `AuthorizedInvoices` (`Prefix`/`From`/`To`) · `SoftwareProvider` · `SoftwareSecurityCode` · `AuthorizationProvider` · `QRCode` — coincide con `FE_ERT3000`.

## Pendientes y discrepancias (auto-auditoría parcial)
**Resuelto (DT2 §7–§11 + captura en vivo SISPRO 2026-07-19):**
- ✅ **XPath de recaudos** = `/Invoice/cac:PrepaidPayment` → `LegalMonetaryTotal/PrepaidAmount` (≤ total).
- ✅ **Tipos de operación** (`CustomizationID`): 7 códigos (§J).
- ✅ **InvoicePeriod** obligatorio 1..1 (DND100/101) + regla de fecha de ingreso.
- ✅ **Validaciones del MUV** (§K) y tablas de referencia (§10) incorporadas.
- ✅ **Enums en vivo verificados:** `coberturaPlan` (17), `modalidadPago` (4 hab.), `facturaSinContrato` (7), `conceptoRecaudo` (5) — ver §Catálogos.
- ✅ **Cobertura 16 vs 17 reconciliada:** la tabla viva agrega el código `01` (UPC genérico) que el DT2 no lista aparte.

**Pendiente:**
- ✅ **Campos base verificados** (2026-07-19) contra el **XSD** (UBL 2.1 + `DIAN_UBL_Structures`) y el **anexo v1.9** — ambos ingeridos en `_Adjuntos/DIAN FEV v1.9/`. Ver §Verificación XSD.
- ✅ **Numeración resuelta:** la asigna el **RIS** con el rango autorizado por la DIAN (Res. 000042/2020 art. 38, Formato 1876: prefijo + rango + vigencia ≤2 años + clave técnica). Queda solo confirmar con Loggro **quién computa el `SS-CUFE`** (usa la **clave técnica** de la resolución).

## Fuentes / Relacionado
- [[SISPRO — Micrositio FEV-RIPS]] · Documento Técnico 2 v001 · `FE_ERT3000.xml`
- [[DIAN — Anexo Técnico de Factura Electrónica de Venta v1.9]] (Res. 000165/2023) · [[Loggro — API de facturación electrónica]] (proveedor de timbrado)
- [[FEV-RIPS — Facturación electrónica en salud]] · [[Inventario de cruces (RVC-RVG) — cobertura del validador]] · [[Objetivo]]
