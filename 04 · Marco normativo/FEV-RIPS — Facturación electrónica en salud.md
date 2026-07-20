---
tipo: norma
jurisdiccion: Colombia
emisor: MinSalud + DIAN
numero: "Modelo FEV-RIPS (Facturación Electrónica de Venta en Salud)"
tema: facturacion
estado: vigente
url_oficial: https://www.sispro.gov.co/central-financiamiento/Pages/facturacion-electronica.aspx
fuentes: []
etiquetas: [normativa, facturacion, salud]
actualizado: 2026-07-16
---

# FEV-RIPS — Facturación electrónica en salud

> [!info] Marco central del proyecto
> Modelo en el que la **Factura Electrónica de Venta (FEV)** y los **RIPS** (soporte clínico-administrativo) **viajan y se validan juntos** en una sola operación, quedando registrados en el sistema del Ministerio de Salud.

## 📌 Resumen
El Ministerio de Salud y Protección Social, con apoyo de la DIAN, implementó la facturación electrónica en salud mediante una **extensión de la factura electrónica** para registrar las condiciones propias del sector salud. La factura y su soporte RIPS se generan, validan y reportan de forma unificada (modelo **FEV_RIPS / reporte automático**).

## 🔑 Puntos clave
- **FEV**: factura electrónica de venta (competencia DIAN).
- **RIPS**: Registro Individual de Prestación de Servicios de Salud; soporte de la FEV en salud (competencia MinSalud). Ver [[RIPS — Registro Individual de Prestación de Servicios]].
- **MUV**: Mecanismo Único de Validación que centraliza recepción y validación (24/7). Ver [[MUV — Mecanismo Único de Validación]].
- **Obligatoriedad**: desde **junio de 2025** aplica al 100% de los prestadores, sin importar tamaño o complejidad.
- Marco normativo actual consolidado en la **[[Resolución 948 de 2026]]**.

## 🧭 Impacto en el diseño
- La arquitectura debe **generar y validar** FEV + RIPS de forma conjunta e integrarse con el **MUV**.
- Manejo simultáneo de **datos financieros** (factura) y **datos de salud sensibles** (RIPS) → segregación y controles diferenciados. Ver [[Ley 1581 de 2012 — Protección de datos personales]].
- Los **anexos técnicos** (estructura de datos/JSON) se publican como **Documentos Técnicos** en el micrositio SISPRO → tratar como dependencia externa versionada.

## 🔗 Fuente oficial
- SISPRO — Facturación electrónica: https://www.sispro.gov.co/central-financiamiento/Pages/facturacion-electronica.aspx
- MinSalud — «FEV_RIPS»: https://www.minsalud.gov.co/Paginas/minsalud-implementa-fev-rips.aspx

## 🔗 Relacionado
- [[Resolución 948 de 2026]] · [[MUV — Mecanismo Único de Validación]] · [[RIPS — Registro Individual de Prestación de Servicios]]
