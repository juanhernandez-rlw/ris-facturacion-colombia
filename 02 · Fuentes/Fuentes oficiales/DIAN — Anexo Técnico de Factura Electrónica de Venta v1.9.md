---
tipo: fuente
categoria: oficial
titulo: "DIAN — Anexo Técnico de Factura Electrónica de Venta v1.9"
url: "https://www.dian.gov.co/impuestos/factura-electronica/Documents/Anexo-Tecnico-Factura-Electronica-de-Venta-vr-1-9.pdf"
autor: "DIAN"
fecha_publicacion: "2023-11-01"
fecha_captura: 2026-07-19
estado: procesada
es_fuente_de_verdad: true
confiabilidad: alta
areas: [modelo-datos, arquitectura, facturacion]
etiquetas: [oficial, dian, fev, factura-electronica, fuente-de-verdad]
---

# DIAN — Anexo Técnico de Factura Electrónica de Venta v1.9

> [!info] Fuente de la verdad · oficial (DIAN)
> Especificación de la **factura electrónica de venta base** (envelope UBL 2.1, campos, algoritmo del **CUFE**, firma, habilitación). Es la capa **base** sobre la que el sector salud añade su extensión (DT2). Adoptado por **Resolución DIAN 000165 de 2023** (01-nov-2023).

## 🔗 Acceso
- **URL:** anexo v1.9 (PDF) — ver frontmatter. Caja de herramientas: `Caja-de-herramientas-FE-V19-V2026.zip` (contiene el **XSD**).
- **Documentación técnica DIAN:** https://micrositios.dian.gov.co/sistema-de-facturacion-electronica/documentacion-tecnica/

## 🎯 Qué información aporta
- Estructura del documento `Invoice` (UBL 2.1): cabecera, emisor, adquiriente, líneas, impuestos, totales, medios de pago.
- Algoritmo y formato del **CUFE**; política de firma; modos de operación; validaciones DIAN.
- Referencia **gobernante de los campos base** del [[Diccionario de construcción de la FEV en salud]] (secciones A–H).

## ✅ Vigencia (verificado 2026-07-19)
- **v1.9 es la versión vigente** a 2026: la DIAN publica la **Caja de herramientas FE V19 V2026** (refresco 2026 sobre la misma v1.9). No se identificó versión posterior del anexo.
- Contexto: el vault había registrado antes las v1.7/v1.8 como "no pertinentes" cuando el foco era el RIPS ([[SISPRO — Micrositio FEV-RIPS]]); con el trabajo de la FEV, la **v1.9 sí es necesaria**.

## ✅ Ingesta y verificación (2026-07-19)
- **Caja de herramientas FE V19 V2026** descargada (26 MB). Ingeridos en `_Adjuntos/DIAN FEV v1.9/`: el **anexo v1.9 (PDF, 11 MB, 753 págs.)** + los **XSD** `UBL-Invoice-2.1`, `DIAN_UBL_Structures`, `UBL-AttachedDocument`, `CreditNote`, `DebitNote`, `ApplicationResponse`.
- **Cruce fino de campos base hecho** (XSD estructural + obligatoriedad del anexo + DT2 §11) → [[Diccionario de construcción de la FEV en salud]] §Verificación XSD. Cierra la tarea de verificación base.

## 🕓 Procedencia
- **Origen:** micrositio DIAN de factura electrónica (documentación técnica). Vigencia confirmada 2026-07-19.
- **Versión:** Anexo Técnico FEV **v1.9** — Res. DIAN 000165 de 2023.

## 🔗 Relacionado
- [[Diccionario de construcción de la FEV en salud]] · [[FEV-RIPS — Facturación electrónica en salud]] · [[SISPRO — Micrositio FEV-RIPS]]
