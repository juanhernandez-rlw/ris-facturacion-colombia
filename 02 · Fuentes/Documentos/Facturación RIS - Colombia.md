---
tipo: fuente
categoria: documento
titulo: "Facturación RIS - Colombia"
url: "obsidian://open?vault=Eden&file=Facturaci%C3%B3n%20RIS%20-%20Colombia"
autor: "edenmed (equipo)"
fecha_publicacion: 2026-07-16
fecha_captura: 2026-07-16
estado: procesada
es_fuente_de_verdad: false
confiabilidad: alta
areas: [dominio, modelo-datos, normativo]
etiquetas: [rips, fev-salud, ris, modelo-datos]
---

# Facturación RIS - Colombia

> [!info] Ficha de fuente · procesada
> Documento interno (vault **Eden**) que mapea cómo el **RIS** (Radiology Information System) alimenta la **facturación electrónica en salud** (RIPS + FEV-salud). **Primera fuente** del repositorio. Contiene 5 imágenes con tablas de campos y enlaces a 4 documentos oficiales.

## 🎯 Qué aporta
Es el punto de partida del mapa de construcción del RIPS (ver [[Objetivo]]): para cada campo da **tipo·tamaño**, **obligatoriedad**, **qué es** (con su tabla/enum) y **de dónde sale** (dónde se captura en el RIS/app).

Distingue explícitamente **RIS ≠ RIPS**: el RIS *no radica ni factura*, pero es la fuente de casi todo el dato y produce **4 insumos** → RIPS (JSON), factura → FEV, campos FEV-salud (XML/UBL) y soportes de cobro.

## 📄 Texto operable (formato nativo)
- **Transcripción de las 5 tablas (markdown):** [[Facturación RIS - Colombia — RIPS (transcripción)]] — el mapeo campo-por-campo (`por-verificar`).
- **Texto extraído de los PDFs (.txt):** en `_Adjuntos/Facturación RIS - Colombia/` (ver tabla abajo).

## 🗂️ Originales (inmutables · Regla 2)
Carpeta: `_Adjuntos/Facturación RIS - Colombia/`
- `Facturación RIS - Colombia (original).md` — nota original tal cual (vault Eden).
- 5 imágenes `Pasted image *.png`.

## 📚 Documentación oficial relacionada (descargada 2026-07-16)
| Doc                                                | Original (PDF)                                                 | Texto extraído (.txt)                       | Notas                                                                                                                                |
| -------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Resolución 948 de 2026**                         | `resolucion-0948-de-2026.pdf` · 1.1 MB · 17 pág                | `resolucion-0948-de-2026.txt`               | Norma vigente; deroga 2275/2023, 558/2024, 1884/2024. Ver [[Resolución 948 de 2026]]                                                 |
| **DT1 — campos RIPS (JSON) + reglas RVC/RVG**      | `anexo-tecnico1-resolucion-948-de-2026.pdf` · 1.5 MB · 131 pág | `anexo-tecnico1-resolucion-948-de-2026.txt` | ⚠️ **v001 — SUPERADO.** La versión vigente **v002** está en [[SISPRO — Micrositio FEV-RIPS]]; usar esa para el cruce                 |
| **DT2 — extensión FEV-salud (XML/UBL) + rechazos** | `anexo-tecnico2-resolucion-948-de-2026.pdf` · 1.8 MB · 54 pág  | `anexo-tecnico2-resolucion-948-de-2026.txt` | Contiene reglas de rechazo `FEVxxx` y campos MODALIDAD_PAGO, COBERTURA_PLAN_BENEFICIOS, NUMERO_CONTRATO (CUCON)…                     |
| **Tablas de referencia FEV-RIPS (SISPRO)**         | — (consulta web, no PDF)                                       | —                                           | ~37 tablas de códigos/enums. [Consulta SISPRO](https://web.sispro.gov.co/WebPublico/Consultas/ConsultarDetalleReferenciaBasica.aspx) |

**Enlaces oficiales de origen:**
- Resolución 948/2026 — https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-0948-de-2026.pdf
- DT1 (v001, biblioteca) — https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/OT/anexo-tecnico1-resolucion-948-de-2026.pdf
- DT2 — https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/OT/anexo-tecnico2-resolucion-948-de-2026.pdf

## ⚠️ Verificaciones pendientes
- ✅ **DT1 v002 obtenido** (ver [[SISPRO — Micrositio FEV-RIPS]]); el `anexo-tecnico1` de esta carpeta es **v001 (superado)**. Usar v002 para el cruce.
- **Cruce pendiente (Regla 4):** la transcripción aún **NO** se ha validado contra DT1/DT2 → estado `por-verificar`. Es el siguiente paso.
- Anomalías de transcripción (celdas duplicadas en `numNota` y en Campos FEV-salud; `Soportes de cobro` = TBD). Ver la transcripción y [[Preguntas abiertas]].

## 🖼️ Vista original (imágenes)
**Panorama · los 4 insumos**
![[Pasted image 20260716194957.png]]
**Transacción**
![[Pasted image 20260716195139.png]]
**Usuarios**
![[Pasted image 20260716195225.png]]
**Procedimientos**
![[Pasted image 20260716195254.png]]
**Campos FEV-salud**
![[Pasted image 20260716195524.png]]

## 🕓 Procedencia
- **Origen:** vault Obsidian **Eden** (`/Users/juanhernandez/Desktop/Obsidian/Eden`) — nota "Facturación RIS - Colombia" + 5 imágenes.
- **Traído al vault:** 2026-07-16 (copiado; originales preservados en Eden — Regla 2).
- **PDFs:** descargados de `minsalud.gov.co` el 2026-07-16 (HTTP 200, verificados como PDF).

## 🔗 Relacionado
- [[Facturación RIS - Colombia — RIPS (transcripción)]] · [[Objetivo]] · [[RIPS — Registro Individual de Prestación de Servicios]] · [[FEV-RIPS — Facturación electrónica en salud]] · [[Resolución 948 de 2026]] · [[MUV — Mecanismo Único de Validación]]
