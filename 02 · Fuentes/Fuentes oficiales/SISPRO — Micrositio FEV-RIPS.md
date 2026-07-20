---
tipo: fuente
categoria: oficial
titulo: "SISPRO — Micrositio FEV-RIPS (facturación electrónica en salud)"
url: "https://www.sispro.gov.co/central-financiamiento/Pages/facturacion-electronica.aspx"
autor: "MinSalud / SISPRO"
fecha_captura: 2026-07-16
estado: procesada
es_fuente_de_verdad: true
confiabilidad: alta
areas: [normativo, modelo-datos, dominio, arquitectura]
etiquetas: [oficial, fev-salud, rips, muv, fuente-de-verdad]
---

# SISPRO — Micrositio FEV-RIPS

> [!info] Fuente de la verdad · oficial
> Micrositio oficial de MinSalud/SISPRO con la normativa, documentos técnicos y material de la **facturación electrónica en salud (FEV-RIPS)**. Consultado 2026-07-16 (release MUV vigente: 1.4.10.1 producción / 5.4.10.1 pruebas). Estructurado en 3 tabs: **FEV**, **RIPS**, **Mecanismo de Validación** (Pruebas/Producción).

Originales + texto `.txt` + ZIP descomprimidos en `_Adjuntos/SISPRO FEV-RIPS/`.

## ✅ Documentos VIGENTES descargados (núcleo RIPS/JSON)
| Doc | Archivo local | Pág | Relevancia |
| --- | --- | --- | --- |
| **Resolución 948 de 2026** (14-may-2026) | *(ya en `_Adjuntos/Facturación RIS - Colombia/`)* | 17 | Norma vigente. [[Resolución 948 de 2026]] |
| **DT1 · Versión 002** (1-jul-2026) — campos RIPS (JSON) + reglas RVC/RVG | `DT1-v002-doc-tec1-tecnicas-datos-validacion-rips-fev-salud.pdf` (+`.txt`) | 129 | ⭐ **Fuente de verdad de la estructura del RIPS.** v002 confirmado en control de cambios |
| **DT2 · Versión 001** (1-jul-2026) — campos FEV-salud (XML/UBL) | `DT2-v001-doc-tec2-campos-datos-sector-salud-generacion-fev.pdf` (+`.txt`) | 58 | ⭐ Extensión FEV-salud. (58 pág.; difiere del `anexo-tecnico2` de 54 pág. bajado antes → usar este) |
| **Lineamientos Técnicos v3.2** — generación/validación RIPS+FEV | `lineamientos-tecnicos-v3.2-generacion-validacion-rips-fev.pdf` (+`.txt`) | 143 | ⭐ Guía operativa del proceso |
| **Ejemplo Cápita** | `ejemplo-capita.pdf` (+`.txt`) | 1 | Ejemplo modalidad cápita |
| **Manual convertidor JSON** | `manual-usuario-convertidor-json.pdf` (+`.txt`) | 22 | Cómo se arma/convierte el JSON |
| **Infografía FEV-RIPS** | `infografia-facturacion-electronica-fev-rips.pdf` (+`.txt`) | 1 | Panorama del proceso |

## 📦 Datos estructurados (ZIP) — clave para valores y estructura de campos
- **`ejemplificaciones-estructura-resolucion-948-de-2026.zip`** ⭐⭐ → **ejemplos JSON reales del RIPS v002** por escenario: `Consulta`, `Procedimientos`, `Urgencias`, `Hospitalizacion`, `Medicamentos`, `OtrosServicios`, `RecienNacidos`, + par `FEV(XML)`/`RIPS(JSON)` de FACTURA_SIN_CONTRATO. Es el **esquema real del JSON** que se envía.
- **`Lista_valores.zip`** → 7 catálogos `.gc` (GenericCode/OASIS): `salud_cobertura`, `salud_tipo_usuario`, `salud_modalidad_pago`, `salud_identificacion`, `salud_tipo_operacion`, `TipoDocumentoReferencia`, `ReferenciaGrupo`. Enums oficiales.
- **`diccionario-tablas-fev-rips.zip`** → `F DICCIONARIO TABLAS.xlsx` (diccionario de tablas de referencia).
- **`tabla-relacionamiento-glosas-vs-campo-rips-31-mayo-2024.zip`** → `.xlsx` (glosas ↔ campos RIPS).

## 🧪 Ambientes de prueba / MUV (tab Mecanismo de Validación)
- `guia-instalacion-validador-fev-rips-cliente-servidor.pdf` (18 pág)
- `guia-autenticacion-fev-rips-cliente-servidor.pdf` (40 pág)
- `manual-usuario-cliente-servidor-fev-rips-pruebas.pdf` (72 pág)
- `manual-consumo-api-docker-fev-rips.pdf` (43 pág)
- Instaladores `.exe` y `docker-compose.zip` (stage/prod): **no descargados** (binarios; no son documentación).

## ⚠️ Descarga fallida (Regla 3.1)
- **Guía implementación API DOCKER v2.0** → el enlace del micrositio devolvió **HTTP 404** (HTML de error, eliminado). URL rota: `.../guia-implementacion-api-docker-fev-rips.pdf`. Sustituto disponible: `manual-consumo-api-docker-fev-rips.pdf`.

## 🚫 NO descargados — superados o no pertinentes (registro · Regla 3.4)
A un clic si se necesitan.
- **Derogadas por la 948/2026:** Res. 2275/2023, 1884/2024, 558/2024 (+ ancilares 1557/2023, 1885/2024, 1886/2024, Circular externa 0021/2024, Circular conjunta 007/2025).
- **Marco DIAN base (no específico de salud):** Res. DIAN 000042/2020, 000099/2020, 000012/2021, Decreto 358/2020, Anexo Técnico FEV DIAN v1.7 y v1.8, Anexo Res. 506/2021.
- **RIPS histórico:** Resolución 3374/2000.
- **No pertinente al RIPS/JSON:** listados PSS/PTS, listas blancas, videos (.mp4/YouTube), presentaciones, doc HA Azure, Google Sheet de preguntas, formularios de inscripción.

## 🔎 Hallazgos de cruce preliminar (Regla 4) — el oficial corrige la transcripción de Eden
Comparando el JSON de ejemplo v002 y `salud_tipo_usuario.gc` contra [[Facturación RIS - Colombia — RIPS (transcripción)]]:
- **DT1 v002 confirmado** → el `anexo-tecnico1` (v001) bajado antes queda **superado**.
- **La estructura JSON v002 añade campos que la transcripción no lista:** `causaMotivoAtencion` (reemplaza `causaExterna`), campos **CIE-11** (`codDiagnosticoPrincipalCIE11`, `nom…`), `codigoVIDA`, `codPaisOrigen`, `tipoDiagnosticoPrincipal`, `codConsulta`. El RIPS es **anidado**: `usuarios[] → servicios{ consultas[] / procedimientos[] / … }`.
- **`tipoUsuario`:** el catálogo oficial tiene **11 valores** (01 cotizante · 02 beneficiario · 03 adicional · 04 subsidiado · 05 sin régimen · 06/07 excepción · 08 particular · 09 ARL · 10 SOAT · 11 planes voluntarios). Difiere del de Eden (que decía "05 no afiliado"). ⚠️ **Usar el `.gc` oficial.**
- **`incapacidad`:** el JSON usa `"NO"`/`"SI"` (no "1/2"). Verificar contra DT1.

→ El **cruce completo** campo por campo (DT1 v002 + ejemplos JSON + tablas vivas) es el siguiente paso para dejar el mapa del RIPS `verificado`.

**Tablas de referencia vivas capturadas (2026-07-16):** 20 tablas-dominio del RIPS desde la Consulta SISPRO (`?Code=<tabla>`) → [[Tablas de referencia vigentes (SISPRO) — enums del RIPS]].

## 🕓 Procedencia
- **Origen:** micrositio SISPRO (URL arriba), tabs FEV/RIPS/Validación. Descargado 2026-07-16 de `minsalud.gov.co` y `sispro.gov.co` (HTTP 200 verificados; 1 archivo 404).
- Originales + `.txt` + ZIP descomprimidos en `_Adjuntos/SISPRO FEV-RIPS/`.

## 🔗 Relacionado
- [[Facturación RIS - Colombia]] · [[Facturación RIS - Colombia — RIPS (transcripción)]] · [[Resolución 948 de 2026]] · [[FEV-RIPS — Facturación electrónica en salud]] · [[RIPS — Registro Individual de Prestación de Servicios]] · [[MUV — Mecanismo Único de Validación]] · [[Objetivo]]
