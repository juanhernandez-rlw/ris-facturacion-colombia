---
tipo: analisis
area: modelo-datos
estado: en-progreso
actualizado: 2026-07-16
etiquetas: [rips, dt1, cie11, tablas-referencia, pre-cruce]
---

# Preparación del cruce — DT1 v002 (cambios, erratas y tablas de referencia)

> [!abstract] Para qué sirve
> Consolida lo que el **cruce** del RIPS debe tener en cuenta: cambios 2275→948, **erratas del DT1 oficial** (para no propagarlas) y el **mapa de fuentes de las tablas de referencia** con sus conflictos. Insumo directo del [[Objetivo|mapa de construcción del RIPS]].
> **El cruce aún NO se ha ejecutado** (Regla 3.2). Falta cerrar la completitud (§6).

## 1 · Jerarquía de fuentes (qué manda sobre qué)
1. **DT1 v002** (`DT1-v002-…`) — estructura del **RIPS JSON** + reglas RVC/RVG. **Autoridad para el JSON.** ✅ vigente.
2. **DT2 v001** (`DT2-v001-…`) — extensión **FEV-salud XML/UBL**. Autoridad para el XML.
3. **Ejemplos JSON oficiales** (`ejemplificaciones-…`) — estructura real por escenario. ⚠️ algunos **incompletos** (ver §3).
4. **Tablas de referencia (enums)** — varias fuentes en conflicto/versiones (§4).
5. Secundaria: [[Video — Análisis DT1 Resolución 948]] (contexto + erratas).

## 2 · Cambios estructurales 2275 → 948 (confirmados en el texto de DT1 v002)
- **CIE-11 en todo:** nuevos campos código+nombre CIE-11 (dx principal, relacionados, complicación, causa de muerte) en consultas/procedimientos/urgencias/hospitalización/recién nacidos/medicamentos (289 menciones "CIE11"). Conviven con CIE-10 (4 caracteres).
- **`codigoVIDA`** (34): ID único de la atención (interoperabilidad HCE). Tipo **carácter → entre comillas**. Obligatorio cuando opere IHCE.
- **`registroCIAS`** (29) en `usuarios`: radicación reporte víctimas accidentes de tránsito (plataforma CIRAS). null o 1–60; se valida si `tipoUsuario`=10 (SOAT).
- **Medicamentos:** se **elimina `numAutorizacion` (M02)** (salto M01→M03); nuevo **`valorDispensacion`** (19); `idMIPRES` → null o 19–25; tipo/número doc del prescriptor ahora **opcionales**; ajustes de concentración/forma farmacéutica.
- **Otros servicios:** nombre tecnología ampliado a 1–200; nuevo `valorDispensacion`.
- **`causaExterna` → `causaMotivoAtencion`** (13; confirmado en el JSON de ejemplo).
- **Transacción:** `numDocumentoIdObligado` de 9 fijo a **4–12**.
- **Nueva validación:** fecha/hora prestación ≤ fecha/hora fallecimiento + 24 h.
- **Urgencias:** se eliminó la nota "≤ 48 h entre ingreso y egreso".
- **Notificación → rechazo:** generales 17 (15 rechazo = 88 %); por campo ~97 (53 rechazo = 55 %, 44 notificación = 45 %); muchas notificaciones migrarán a rechazo → foco en calidad del dato.
- **Vigencia:** transición desde 1-jun-2026; normalizado a 1-jul-2026.

## 3 · ⚠️ Erratas del DT1 oficial (NO propagar) — reportadas por el video
> Verificar una a una contra el `.txt`/PDF durante el cruce (Regla 4). Estado: `por-verificar`.
- **Consulta – dx relacionado 2 CIE-11:** llave de código/nombre **mal referenciada** (repite la del relacionado 1) → llave duplicada.
- **`vrServicio` en consultas:** tamaño **0–10**, mientras en procedimientos/medicamentos/otros es **1–15**. Posible error (debería ser 1–15).
- **`codigoVIDA` en ejemplos:** aparece **sin comillas** siendo carácter → debe ir entre comillas.
- **Recién nacidos:** llave "código dx causa muerte CIE11" **duplicada** (variable 17 repite código en vez de **nombre**).
- **Ejemplos incompletos:** recién nacidos sin los nuevos campos CIE-11; medicamentos y otros servicios sin `valorDispensacion` (M28).

## 4 · Tablas de referencia (enums): fuentes, versiones y CONFLICTOS
| Fuente | Alcance | Estado |
| --- | --- | --- |
| **DT1 v002 / DT2 v001** | Estructura + tablas aplicables + códigos cambiados por 948 | ✅ vigente (autoridad) |
| **`Lista_valores.zip` (.gc)** | 7 tablas lado **XML/FEV** (GenericCode) | Subconjunto; `salud_tipo_usuario` = 11 códigos |
| **`F DICCIONARIO TABLAS.xlsx`** | **36 tablas** (RIPS/JSON y XML) | ⚠️ **7-feb-2025 → PRE-948**; sin 16/17 ni +13 |
| **SISPRO · Consulta de referencias básicas** (web) | Tablas vivas | ❌ **no capturado aún** |

**Conflictos confirmados:**
- **`tipoUsuario`:** `RIPSTipoUsuarioVersion2` (JSON) = 12 códigos, **12=Particular, 05=No afiliado**; ≠ `salud_tipo_usuario.gc` (XML) = 11 códigos, **08=Particular, 05=Sin régimen**. **Son tablas distintas (JSON vs XML) — no mezclar.** El video añade **código 13** (ausente en el diccionario pre-948).
- **`CoberturaPlanBeneficios`:** diccionario (pre-948) trae 01–15 con **01 activo**; 948 **inactiva el 01** y agrega **16 (contributivo)** y **17 (subsidiado)**. No confirmable en el texto extraído de DT2 (posible tabla no capturada por el extractor).
- **`causaExterna`:** diccionario aún la llama `RIPSCausaExternaVersion2`; en 948 es `causaMotivoAtencion`.

**Inventario del diccionario (36 tablas):** CIE10, CUPSRips, CatalogoCUMs, CoberturaPlanBeneficios, CondicionyDestinoUsuarioEgreso, DCI, EntidadResponsablePago, FFM, GrupoServicios, IPSCodHabilitacion, IPSnoREPS, IUM, LstSiNo, ModalidadAtencion, ModalidadContratoyPago, Municipio, Pais, RIPSCausaExternaVersion2, RIPSFinalidadConsultaVersion2, RIPSTipoDiagnosticoPrincipalVersion2, RIPSTipoUsuarioVersion2, Servicios, Sexo, TipoIdPISIS, TipoMedicamentoPOSVersion2, TipoNota, TipoOtrosServicios, TipoPagoCompartido, UMM, UPR, ViaIngresoUsuario, ZonaVersion2, coberturaPlan, conceptoRecaudo, modalidadPago, tipoPagoModerador. Volcado operable: `…/diccionario-tablas-fev-rips/F DICCIONARIO TABLAS (texto).md`.

## 5 · Sexo (dos convenciones)
- General: columna **Extra III** = `M` masculino · `F` femenino · `I` indeterminado (NO H/M).
- **Recién nacidos:** columna **Extra 2** = `01` hombre · `02` mujer · `03` indeterminado.

## 6 · 🚦 Evaluación de completitud
**✅ Brecha cerrada (2026-07-16):** se capturaron las **20 tablas-dominio vivas** de SISPRO → [[Tablas de referencia vigentes (SISPRO) — enums del RIPS]]. Confirmado: `tipoUsuario` = 13 códigos (2024); `causaMotivoAtencion` = tabla `RIPSCausaExternaVersion2` (códigos 21–49); `codSexo` se reporta con **Extra_III** (M/F/I); `incapacidad` = `SI`/`NO`.
**Residual menor:** la cobertura **16/17** NO está en la tabla RIPS viva (sigue 01–15, 01 activo); es del lado **XML/FEV-salud** → confirmar en **DT2**. Catálogos masivos (CIE/CUPS/CUM/municipios…) quedan como referencia externa por `?Code=`.
**Estado:** con **DT1 v002 + ejemplos JSON + estas 20 tablas**, la información es **suficiente para iniciar el cruce**.

## 🔗 Relacionado
- [[SISPRO — Micrositio FEV-RIPS]] · [[Video — Análisis DT1 Resolución 948]] · [[Facturación RIS - Colombia — RIPS (transcripción)]] · [[Resolución 948 de 2026]] · [[Objetivo]] · [[Preguntas abiertas]]
