---
tipo: concepto
area: normativo
estado: revisado
relacionado: []
etiquetas: [facturacion, salud, integracion]
actualizado: 2026-07-16
---

# MUV — Mecanismo Único de Validación

## Definición
Plataforma del **Ministerio de Salud** que **centraliza la recepción y validación** de la información contenida en la **FEV y su soporte RIPS**, con un flujo unificado y **disponibilidad 24/7**. En operación desde el **1 de febrero de 2025** (junto con el uso del RIPS como soporte de la FEV).

## Impacto en el diseño
- Es un **punto de integración obligatorio** para la app → considerar disponibilidad, reintentos, colas, idempotencia y manejo de respuestas de validación.
- Define **contratos de datos** (estructuras/JSON) que la app debe cumplir → ver Documentos Técnicos en SISPRO.

## Relacionado
- [[FEV-RIPS — Facturación electrónica en salud]] · [[RIPS — Registro Individual de Prestación de Servicios]]

## Fuentes
- SISPRO — Facturación electrónica: https://www.sispro.gov.co/central-financiamiento/Pages/facturacion-electronica.aspx
