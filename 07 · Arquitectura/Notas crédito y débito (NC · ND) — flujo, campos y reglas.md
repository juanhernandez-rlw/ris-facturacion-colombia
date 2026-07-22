---
tipo: nota
area: arquitectura
tema: facturacion
estado: verificado
fuentes: ["[[DIAN — Anexo Técnico de Factura Electrónica de Venta v1.9]]", "[[Diccionario de construcción de la FEV en salud]]", "[[Mapa de flujos del sistema (para desarrollo)]]", "[[Modelo de persistencia (fusión P0 · Fase 5 · P3)]]"]
relacionado: ["[[Mapa Orden → RIPS (transform · fusión P0 · Fase 1)]]", "[[Loggro — API de facturación electrónica]]"]
etiquetas: [arquitectura, flujos, facturacion, notas, nc-nd, fev, ris, verificado]
actualizado: 2026-07-22
---

# Notas crédito y débito (NC · ND) — flujo, campos y reglas

> [!abstract] Qué es
> Documento que **corrige una FEV ya emitida** (una factura con CUFE **no** se edita → se ajusta con nota). Consolida las reglas del flujo NC/ND **verificadas contra fuente primaria** el 2026-07-22: DT1 v002, DT2 v001, Lineamientos técnicos v3.2 y Anexo DIAN v1.9 + su Caja de Herramientas. Complementa el flujo ③ de [[Mapa de flujos del sistema (para desarrollo)]] (§3.2/3.3).

## 1 · Marco
- **NC = ajuste a la baja** · **ND = ajuste al alza.** Ambas **referencian la FEV** (por CUFE, `cac:BillingReference/InvoiceDocumentReference`) y re-pasan por **DIAN (timbrado) → MUV (CUV)**.
- Anular una factura = **NC total (100 %)**; la FEV pasa a estado `anulada` ([[Modelo de persistencia (fusión P0 · Fase 5 · P3)]] §2.4).

## 2 · Tipo de operación · `CustomizationID` (tablas 13.1.5.2 / 13.1.5.3)
| Código | Documento | ¿En salud? |
|---|---|---|
| `20` | Nota Crédito **que referencia** una FEV | ✅ |
| `22` | Nota Crédito **sin referencia** | ❌ no aplica |
| `30` | Nota Débito **que referencia** una FEV | ✅ |
| `32` | Nota Débito **sin referencia** | ❌ no aplica |

> El MUV **solo admite `20` y `30`** (la nota de salud siempre referencia una FEV) — DT2 §J / Lineamientos v3.2 §4.4.3/4.4.6.

## 3 · Concepto de corrección (obligatorio) · `cac:DiscrepancyResponse/cbc:ResponseCode`
Campo **CBF03** (NC) / **DBF03** (ND). **Rechazo** si el código no está en la lista; la `Description` (CBF04/DBF04) debe corresponder al código. Valores oficiales (Caja de Herramientas v1.9):

**Nota crédito — tabla 13.2.4**
| Cód | Descripción |
|---|---|
| `1` | Devolución parcial de los bienes y/o no aceptación parcial del servicio |
| `2` | Anulación de factura electrónica |
| `3` | Rebaja o descuento parcial o total |
| `4` | Ajuste de precio |
| `5` | Descuento comercial por pronto pago |
| `6` | Descuento comercial por volumen de ventas |

**Nota débito — tabla 13.2.5**
| Cód | Descripción |
|---|---|
| `1` | Intereses |
| `2` | Gastos por cobrar |
| `3` | Cambio del valor |
| `4` | Otros |

> La NC **no** tiene "Otros" (v1.9 lo reemplazó por `5`/`6`); la ND **sí** lo conserva. `.xlsx` en `_Adjuntos/DIAN FEV v1.9/Tablas Referenciadas (Caja de Herramientas v1.9)/`.

## 4 · Campos RIPS · cabecera de transacción (DT1 v002 §4.1)
- **`tipoNota` (T03):** `NC`/`ND` cuando el ajuste **afecta el valor monetario**; **`NA`** (nota ajuste RIPS) cuando **no** afecta valor (solo corrige datos); `null` si no es nota.
- **`numNota` (T04):** número de la nota, **lo genera el facturador electrónico en salud**; **debe coincidir** con el número reportado a la DIAN. C · 0–20 · condicional.
- `numFactura` sigue apuntando a la FEV original (**PFP001**: `numFactura` RIPS = FEV).

## 5 · Regla de valores ⚠️ (corrige el video)
Fuente: **DT1 v002 pág. 84–85** + Lineamientos v3.2 §2.2.2 / §4.4.3.
- **NC:** el valor de cada servicio referenciado **≤ lo facturado**, y la **Σ del RIPS de la NC = el `valor` de la NC (XML)**.
- **ND:** **sí puede incluir valores** (servicios no facturados o facturados de menos).
- **Ambas:** los **pagos moderadores van siempre en 0** — *"las NC y ND en ningún caso incluirán valores de pagos moderadores"*; su resta al total legaliza el recaudo.

> [!warning] Errata del video de análisis DT1
> El [[Video — Análisis DT1 Resolución 948|video]] dice *"para notas débito no se pueden incluir valores"*. **Es falso**: el DT1 v002 dice lo contrario. Prevalece la fuente oficial.

## 6 · Escenarios oficiales y transmisión al MUV (Lineamientos v3.2 §2.2)
Ocho situaciones: FEV+RIPS · **NC total** · **NC parcial**+RIPS · **ND**+RIPS · NA · RIPS sin factura · NC sin RIPS · factura cápita+RIPS. Las de nota:

| Escenario | ¿RIPS? | Cómo | Efecto |
|---|---|---|---|
| **NC total 100 %** (anulación / devolución no subsanada) | **Sin RIPS** | El MUV recibe la NC 100 % y **marca la FEV** como *"afectada con NC al 100 %"* | Anula la cuenta |
| **NC parcial** (glosa aceptada) | **Con RIPS** (solo registros aceptados; Σ = valor NC) | Módulo `cargarNCREDITO` (4.1.1.3) | Baja parcial |
| **ND** (servicio no facturado / mayor valor) | **Con RIPS** (actualiza los RIPS de la FEV: mismo consecutivo, o registros nuevos que continúan la secuencia) | Junto con la ND | Sube el valor |

> La nota (XML, ya validada por DIAN) + su **RIPS soporte (JSON)** se transmiten **juntos** al MUV como "conjunto de información" con llave irrepetible → **CUV**. **No** es un lote aparte. La **numeración/timbrado** de la nota es de la pierna **Loggro** (ver [[Loggro — API de facturación electrónica]]).

## 7 · Modelo de datos (entidad `Nota`)
Actualiza [[Modelo de persistencia (fusión P0 · Fase 5 · P3)]] §2.3:
`{ id, tipo (NC/ND), tipoOperacion (20/30), conceptoCorreccion (13.2.4/13.2.5), facturaRef (CUFE), numNota, alcance (total/parcial), lineas[], valor, moderadores=0, estado, fecha }`

## 8 · Integración en el prototipo (implementado · 2026-07-22)
`prototipo-convenio-contrato-orden.html` ya implementa el sustrato y el flujo NC/ND, verificado headless:
1. **Sustrato (Capa 0):** la orden se emite como `Factura` con **ciclo async real** (ver [[Ciclo de vida de la FEV — estados y operaciones asíncronas]]) + bandeja + estados.
2. **Flujo de nota (Capa 1):** desde una factura `radicada`/`validada` → modal NC/ND con **concepto de corrección** (enum real), gate de valores (**NC ≤ facturado · ND admite valores · moderadores 0**), ramas **total** (al validarse en el MUV deja la FEV en `anulada`) / **parcial**. La nota **reutiliza el mismo ciclo async** (timbrar → transmitir al MUV).
3. **Corrección guiada de rechazos:** cada error DIAN/MUV se muestra mapeado a su **campo de origen + cómo corregir** (p. ej. `RVC035 → Tipo de usuario del paciente`).
- **Todo en el modelo declarativo:** los enums (`TIPO_NOTA`, `CONCEPTO_CORRECCION_NC/ND`, `TIPO_OPERACION_NOTA`) **y las 4 reglas del gate** (scope `nota` en `reglas.dmn.json` → `RIS.validarNota`) viven en `modelo-formal/`. **Deuda cerrada (2026-07-22)** — el HTML solo arma el contexto y llama al motor.
- **Enlace con glosas (§6.2):** aceptar una glosa genera automáticamente una **NC parcial** por el valor glosado.

## Fuentes
- **DT1 v002** §4.1 (T03/T04), pág. 84–85 (regla de valores) — `_Adjuntos/SISPRO FEV-RIPS/DT1-v002-…txt`.
- **DT2 v001** §J (tipos de operación; solo 20/30) — `_Adjuntos/SISPRO FEV-RIPS/DT2-v001-…txt`.
- **Lineamientos técnicos v3.2** §2.2.2/2.2.3/2.2.7, §4.4.3/4.4.6 — `_Adjuntos/SISPRO FEV-RIPS/lineamientos-tecnicos-v3.2-…txt`.
- **Anexo DIAN v1.9** (CBF03/DBF03) + **Caja de Herramientas** (tablas 13.2.4/13.2.5, 13.1.5.2/3) — [[DIAN — Anexo Técnico de Factura Electrónica de Venta v1.9]].
