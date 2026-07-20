---
tipo: nota
area: arquitectura
tema: facturacion
estado: en-construccion
fuentes: ["[[Diccionario de construcción de la FEV en salud]]", "[[RIS — Colombia (Figma)]]"]
etiquetas: [arquitectura, facturacion, fev, ris, fase-3]
actualizado: 2026-07-19
---

# Dónde vive cada campo — FEV × RIS (Convenio / Contrato / Orden)

> [!abstract] Fase 3 — reconciliación
> Cruza el [[Diccionario de construcción de la FEV en salud|diccionario FEV verificado]] × el mapa de campos del **[[RIS — Colombia (Figma)|Figma "RIS — Colombia"]]** × el modelo de datos del RIS (**Convenio → Contrato → Orden**). Resultado: **dónde debe vivir/capturarse cada campo** que viaja a la factura, con los enums ya verificados. Base directa del modelo de datos y del front.
> **Estado:** propuesta de arquitectura (`inferido`) sobre datos `verificados`; para afinar en conjunto.

## El modelo del RIS (tomado del Figma)
- **Convenio** — maestro del **pagador** y sus reglas: cobertura, modalidad, tipo de entidad resp. de pago, retenciones, forma/medio de pago, factura-sin-contrato, flags autorización/MIPRES/SIRAS. Se crea en el **módulo de Convenios** (alimentado por **SIIFA**→CUCON, **EAPB/ADRES**→NIT y tipo de pagador, **SISPRO**→enums, **DANE**→municipio). **La orden hereda del convenio** (pagador · modalidad · cobertura · CUCON) vía el selector `field/Convenio`. *No lleva precio.*
- **Contrato** (estudio × convenio) — la **tarifa** (precio, insumos, tipo de cuota), el **CUCON** (lo expide el SIIFA), y las reglas de copago/cuota (conceptoRecaudo + valor).
- **Orden / Ingreso del paciente** (por atención) — **paciente**, régimen/nivel, código de autorización, **estudio (CUPS)**, diagnóstico, fechas, y **copago/cuota recaudados** en caja.
- Transversales: **Config-IPS** (datos de la institución + resolución de numeración), **Cálculo** (totales/IVA), **Integración** (Loggro / DIAN / MUV).

## Reconciliación: dónde vive cada campo de la FEV
**Vive en:** 🏢 Config-IPS · 🤝 Convenio · 📄 Contrato · 🧾 Orden/Ingreso · ∑ Cálculo · 🔌 Integración

| Campo FEV (UBL / extensión)           | Vive en                           | Valor / enum verificado                                                                                                                             | Reconciliación vs Figma                                      |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `CODIGO_PRESTADOR` (ext)              | 🏢                                | REPS de la sede (`IPSCodHabilitacion`) = NIT facturador                                                                                             | = Figma ("Backend") ✓                                        |
| Emisor (`AccountingSupplierParty`)    | 🏢                                | NIT+DV (`schemeName`=31), RUT, domicilio                                                                                                            | —                                                            |
| `ID`/numFactura + `InvoiceControl`    | 🏢 (resolución) + ∑ (consecutivo) | prefijo+consecutivo del rango DIAN; **lo asigna el RIS**                                                                                            | **resuelve** la duda del Figma "¿quién numera?" → **RIS**    |
| `CustomizationID` (SS-*)              | ∑                                 | `SS-CUFE` típico (acredita)                                                                                                                         | nuevo (§J del diccionario)                                   |
| CUFE (`UUID`)                         | 🔌                                | usa la **clave técnica** de la resolución                                                                                                           | por confirmar quién lo computa                               |
| Adquiriente / pagador                 | 🤝 (o 🧾 si Particular)           | tipo entidad resp. pago, NIT, razón social, dirección                                                                                               | = Figma (modal convenio) ✓                                   |
| `MODALIDAD_PAGO` (ext)                | 🤝                                | `modalidadPago` **01–04**                                                                                                                           | Figma decía "Ingreso del paciente" → **corregir a Convenio** |
| `COBERTURA_PLAN_BENEFICIOS` (ext)     | 🤝                                | `coberturaPlan` **17 códigos**                                                                                                                      | Figma decía "01–10 / Contrato" → **17 + Convenio**           |
| `FACTURA_SIN_CONTRATO` (ext)          | 🤝 (flag + caso)                  | `facturaSinContrato` **01–07**                                                                                                                      | = Figma ✓                                                    |
| Forma/Medio de pago (`PaymentMeans`)  | 🤝                                | forma, medio, plazo                                                                                                                                 | = Figma (modal) ✓                                            |
| Retenciones / IVA (`TaxTotal`)        | 🤝 + ∑                            | responsable IVA, ret. renta/IVA/ICA                                                                                                                 | = Figma (modal) ✓                                            |
| `NUMERO_CONTRATO` / CUCON (ext)       | 📄 (+ CUCON 🔌 SIIFA)             | condicional; CUCON solo lectura                                                                                                                     | = Figma ✓ (CUCON "en hold")                                  |
| `ANTICIPO` (ext)                      | 📄                                | solo FEV, no RIPS                                                                                                                                   | = Figma ✓                                                    |
| Precio de línea (`InvoiceLine/Price`) | 📄                                | tarifa estudio × convenio                                                                                                                           | = Figma ("la tarifa es del Contrato") ✓                      |
| Ítem / CUPS (`InvoiceLine/Item`)      | 🧾                                | CUPS del estudio (`CUPSRips`)                                                                                                                       | = Figma ✓                                                    |
| Insumos (contraste / dispositivo)     | 📄 tarifa + 🧾 cantidad           | contraste → CUM/IUM (`medicamentos[]`) · dispositivo → UDI/IDM (`otrosServicios[]`); **línea propia** en FEV, por usuario                           | → [[Insumos (medicamentos y otros servicios)]]               |
| `NUMERO_POLIZA` (ext)                 | 🧾 (si SOAT/voluntario)           | condicional; póliza del caso                                                                                                                        | —                                                            |
| Paciente (identidad)                  | 🧾                                | `TipoIdPISIS`, etc. (ya para el RIPS)                                                                                                               | = Figma (Ingreso) ✓                                          |
| Código de autorización                | 🧾                                | del pagador; deja campo en RIPS                                                                                                                     | = Figma (Ingreso: `AUT-…`) ✓                                 |
| `InvoicePeriod` (fechas)              | 🧾                                | fechas de la atención; obligatorio                                                                                                                  | = Figma ✓                                                    |
| `COPAGO`/`CUOTA`/`PAGOS_COMPARTIDOS`  | 📄 regla (por nivel) → ∑ valor    | `conceptoRecaudo`; **calculado desde el nivel** (cuota fija / copago %×tarifa+tope); Σ = RIPS → [[Cuota moderadora y copago (recaudo del usuario)]] | regla en el **Contrato por nivel**                           |
| Totales (`LegalMonetaryTotal`)        | ∑                                 | Σ líneas − recaudos; `PrepaidAmount` ≤ total                                                                                                        | —                                                            |

## Discrepancias del Figma que este cruce corrige
- **cobertura 01–10 → 17** (tabla viva SISPRO).
- **`tipoUsuario` "05 no afiliado"** → no existe en el catálogo oficial; usar el `.gc`/tabla viva.
- **modalidad/cobertura** se **maestrean en el Convenio**, no se recapturan en "Ingreso del paciente".
- **"Plano software facturación" (Loggro sin API)** → **descartado**; integración = **API de Loggro** (XML UBL).
- **numeración** → la asigna el **RIS** (validado contra Res. 000042/2020).

## Consecuencia para el front (lo que la Orden/Ingreso realmente captura)
Lo demás es Convenio-maestro, Contrato, cálculo o integración:
- Paciente: identidad + demografía (ya para el RIPS).
- **Código de autorización** (cuando el convenio lo exige).
- **Estudio(s)** (CUPS) + cantidad · **diagnóstico** · **fechas** de atención.
- **Copago/cuota recaudados** en caja (cuadran con el RIPS).
- **Nº de póliza** (si SOAT/voluntario).
> El **pagador, régimen, cobertura y modalidad** se **derivan del Convenio** del paciente (al elegir su convenio) — no se re-digitan por atención.

## Validaciones que el modelo debe respetar (verificadas)
`PFP001` numFactura = RIPS · `VFE022` pagador ↔ cobertura · `InvoicePeriod` obligatorio · `PrepaidAmount ≤ total` · numeración **dentro de rango y vigencia**.

## Pendientes / a afinar juntos
- Confirmar con Loggro **quién computa el `SS-CUFE`** (clave técnica).
- Cruce fino de campos base vs **XSD** (tarea #6).
- ✅ **Selección del Convenio (resuelto):** existe un **módulo de Convenios** (maestro, alimentado por SIIFA/EAPB-ADRES/SISPRO/DANE) y **la orden hereda del convenio** (pagador/modalidad/cobertura/CUCON) — de ahí bajan esos campos, vía el componente `field/Convenio`. Falta solo confirmar la **pantalla exacta** donde la orden enlaza el convenio (¿admisión o creación de orden?).
- Casos multiusuario y modalidades ≠ evento (cápita/PGP) — variantes.

## Fuentes / Relacionado
- [[Diccionario de construcción de la FEV en salud]] · [[RIS — Colombia (Figma)]] · [[FEV-RIPS — Facturación electrónica en salud]] · [[Inventario de cruces (RVC-RVG) — cobertura del validador]]
