---
tipo: guia
actualizado: 2026-07-17
---

# Estado del proyecto

## Etapa actual
**Etapa 2 — Construcción del validador.** El cruce del RIPS se está materializando como una **app local de validación en tiempo real** ([[generador-rips]], en `~/Documents/Claude Projects/generador-rips`) que captura la complejidad del sistema de forma interactiva y validada. La base de contexto (Etapa 1) quedó sólida y sigue como fuente de verdad.

## Los dos frentes
| Frente                       | Qué es                                                                       | Estado                             |
| ---------------------------- | ---------------------------------------------------------------------------- | ---------------------------------- |
| **A · Vault de contexto**    | Repositorio Obsidian: fuentes, normativa, modelo de datos, arquitectura      | ✅ Base sólida; se amplía a demanda |
| **B · App `generador-rips`** | Formulario que construye el JSON RIPS y lo valida en vivo contra el DT1 v002 | 🔄 Construcción activa             |

---

## ✅ Hecho

### Frente A · Vault
- Estructura, taxonomía, plantillas, MOCs; documentos rectores [[Objetivo]] y [[Reglas]].
- **Fuentes ingeridas:** [[Facturación RIS - Colombia]] (5 imágenes + 3 PDFs), [[SISPRO — Micrositio FEV-RIPS]] (14 docs oficiales, **DT1 v002**), [[Video — Análisis DT1 Resolución 948]].
- **20 tablas de referencia vivas** capturadas de SISPRO → [[Tablas de referencia vigentes (SISPRO) — enums del RIPS]].
- Síntesis del cruce y erratas → [[Preparación del cruce — DT1 v002 (cambios, erratas, tablas)]].
- **Auditoría exhaustiva** de las 97 RVC + RVG del DT1 → [[Inventario de cruces (RVC-RVG) — cobertura del validador]] (clasifica los ~118 cruces en implementado / implementable / catálogo / externo).
- Estrategia de prevención → [[Estrategia de validación y prevención de errores del RIPS]].

### Frente B · App (validador)
- **Proyecto local standalone** (Vite + React 19 + TS + Tailwind), corriendo en `localhost:5173`.
- **Modelo de datos** del RIPS 948 (`rips-tipos.ts`) — 7 tipos de servicio + usuario + cabecera.
- **Enums vigentes** de SISPRO (`rips-codigos.ts`, ~495 líneas) — todas las tablas de referencia, con mapas de aplicabilidad por servicio y de tamaños (DT1 v002).
- **Motor de validación en vivo** (`rips-validaciones.ts`, ~730 líneas) — 3 capas (estructura → contenido → relación) con panel de rechazos/notificaciones.
- **Prevención #2 · Tamaños (RVG05):** mapa de longitudes del DT1 + validación + `maxLength` en inputs.
- **Prevención #3 · Dropdowns por aplicabilidad:** finalidad/vía/causa/condición muestran solo los códigos que aplican al servicio.
- **Prevención #4 · Campos condicionales:** numNota, numFactura, registroSIRAS, dx de causa de muerte, ID MIPRES aparecen solo cuando aplican (y se limpian al ocultarse).
- **Prevención #5 · Cruces B1-B9** (26 reglas): unicidad de dx (RVC086-089), fechas vs. nacimiento/estancia (RVC079-081, 046, 040, 041), rangos de RN (RVC057/058/097), familias CIE-10 (RVC031-033, 085), pagos (RVC084/092/060), sexo↔RN/IVE (RVC009/010), doc madre (RVC047), aritmética + CUPS/día (RVC094/018), finalidad↔causa materno-perinatal (RVC052/067-078).
- **Prevención #6 · Gate de envío + checklist:** descarga bloqueada con rechazos + checklist de pendientes agrupados por ubicación.
- **Prevención #1 (parcial):** corregidos los rangos desactualizados de los tooltips (`rips-info.ts`).
- **Prevención #7 (typeahead + catálogos oficiales de SISPRO):** componente `CatalogTypeahead` reutilizable (con **carga diferida** de catálogos grandes servidos como JSON estático) + **tres catálogos oficiales capturados y verificados**: **municipios DANE (1.123)**, **CUPS (13.640, tabla `CUPSRips`)** y **CIE-10 (12.634, tabla `CIE10`)**, con validación de membresía en el motor (rechazo si no existe). Cableado en `codMunicipioResidencia`, `codConsulta`/`codProcedimiento` (CUPS) y `codDiagnosticoPrincipal` (CIE-10). **Por diseño es imposible ingresar un código inexistente.** Probado en vivo (búsqueda por código/nombre sin acentos, selección guarda el código).
- **Verificación continua:** los **7 ejemplos oficiales** del MUV pasan con 0 rechazos; pruebas negativas disparan cada regla; `build` + `typecheck` limpios.

---

## 🔄 En proceso / siguiente
- Cruces restantes del inventario: **B9**, **RVC050/066**, **B10** (ver tabla).

## ⏳ Falta (backlog priorizado)
| # | Tarea | Notas |
|---|---|---|
| **5** | **RVC050/066** (quién ordena; descripción del dispositivo) | Requieren añadir campos al modelo (`OtroServicio`) + formulario |
| **5** | **B10** (RVC053 muerte+24h, RVC062 derivado, RVC064 cannabis) | Nicho / complejo |
| **1** | Auditar selects/inputs restantes | Tooltips ✅ corregidos; falta barrer los inputs |
| **7** | Typeahead **CUM/IUM, REPS, CIE-11** | Infra ✅ + **DANE ✅ + CUPS ✅ + CIE-10 ✅**; faltan CUM/IUM (medicamentos), REPS (prestador) y CIE-11 (secundario) — mismo método de captura desde SISPRO |

## 🌐 Fuera de alcance de un RIPS aislado (fase de integración)
Los ~15 cruces que dependen de la **FEV/XML** (cuadres de NIT, factura, valores, cobertura), **RETHUS**, **RUAF-ND** y régimen. Documentados en el inventario (sección D) y expuestos en el panel "reglas externas" para que se verifiquen en el flujo completo. No se pueden resolver desde el formulario.

## 🅿️ Parqueado
- **Traslado ↔ CUPS** (RVC024) — retomar al cargar el catálogo CUPSRips.
- **Matiz RS/numNota** — confirmar en el DT1 si `RS` (RIPS sin factura) realmente exige numNota.

## 🧭 Recordatorio de alcance mayor
El proyecto nació para diseñar **arquitectura, base de datos y flujo de información** de la app de facturación. Hoy el foco está en el **validador del RIPS** (pieza central). Las carpetas `05 · Requisitos`, `08 · Base de datos` y `09 · Flujos de información` siguen como MOCs vacíos → pendientes si continúan en alcance.

---

## Bitácora
- **2026-07-21** — **Apps consolidadas en un solo repo.** Los prototipos (`prototipo-convenio-contrato-orden.html` + variante `-linear` + `orden-wireframe.html`) y su runtime (`motor.js`, `seed.js`, `modelo.datos.js` generado, `catalogos/*.js`) se **movieron del vault** (`_Adjuntos/wireframes/`) al **repo hermano `generador-rips`** (carpeta `prototipos/`), que pasa a ser el hogar único de las apps. `modelo-formal/` sigue en el vault y genera el bundle a `modelo-formal/dist/` (ver su README); tras regenerar se copia al hermano. Referencias del vault actualizadas. (También se cerró el PR #12 abierto por una sesión paralela.)
- **2026-07-21** — **`modelo-formal/` también movido al hermano (acople cerrado).** El modelo declarativo (enums/reglas DMN/esquemas JSON/zod/surveyjs/transform + `build.mjs`) pasó del vault a `generador-rips/modelo-formal/`. Ahora `build.mjs` (`npm run build:modelo`) escribe **directo** a `prototipos/modelo.datos.js` — sin `dist/` ni copia cross-repo. Toda la cadena (modelo → generación → prototipo → validador RIPS) vive en un solo repo. Verificado: regeneración idéntica, motor carga, typecheck OK.
- **2026-07-20** — **Mapa de flujos ampliado a ~28 flujos (8 filas).** Se sumaron: ⑤ modalidades ≠ evento (paquete/PGP/capitación); ⑥ ciclo E2E (**máquina de estados** de la factura, glosas, radicación+soportes, autorización previa); ⑦ transversales (RBAC, admisión+recaudo, contingencia DIAN); ⑧ alcance ampliado (agendamiento, MIPRES/SIRAS/FURIPS, masiva/anticipos, reportes). Etiquetas del lienzo pasadas a color claro (se veían oscuras sobre fondo oscuro). Documentación textual completa en [[Mapa de flujos del sistema (para desarrollo)]].
- **2026-07-20** — **Mapa de flujos para desarrollo (Figma + vault).** En Figma (*RIS — Colombia* → página *Diagramas de flujo · Facturación*): **16 flujos** en 4 filas con cinta macro (① Creación · ② Gestión · ③ Correcciones · ④ Configuración): convenio/contrato/orden/facturación, editar-inactivar-anular, caso sin contrato (#17), rechazo/reproceso, nota crédito/débito, bandeja, config IPS+numeración DIAN, sync catálogos, consecutivo runtime, auditoría. Documentados en [[Mapa de flujos del sistema (para desarrollo)]] (pasos · decisiones · validaciones · integraciones). Wireframes de detalle convenio/contrato (solo lectura) agregados antes. **Decisión:** la *fecha de atención* se hereda del inicio de la atención (quitada del prototipo y del gate).
- **2026-07-20** — **Seed poblado para pruebas + fix de validación.** El prototipo trae **10 convenios** (EPS contributivo/subsidiado, ARL, SOAT, prepagada, particular con NIT DIAN 222222222222) y **12 contratos** con tarifas reales (54 estudios CUPS + 12 insumos IUM, todos verificados como existentes) y variedad de cobertura/modalidad/recaudo/vigencia. Bug corregido: los defaults de selects/fechas no se guardaban en el estado (marcaba "faltan" campos ya visibles) → defaults ahora en el estado + el aviso se refresca en vivo.
- **2026-07-20** — **Prototipo con datos 100% reales (sin placeholder).** Se reusaron los catálogos reales del `generador-rips` y se generaron como `.js` en `_Adjuntos/wireframes/catalogos/` (CUPS 13.640 · CIE-10 12.634 · CUM-IUM 34.642 · municipios DANE 1.123), cargados vía `<script src>` (funciona en `file://` local). Enums reales de `rips-codigos.ts` (tipo doc 16, tipo usuario 13, sexo M/F/I, zona, cobertura 17, concepto recaudo, tipo dx, finalidad, forma/medio de pago DIAN). **Typeaheads reales** para municipio · CUPS (tarifa) · CIE-10 (dx) · CUM-IUM (insumo); selects donde corresponde (tarifa del contrato en la orden, enums). Seed con códigos reales (TAC 879111/879112, RM 883231, contraste IOPAMIDOL/GADOTERIDOL). 2 bugs de búsqueda hallados y corregidos: multi-palabra (tokens) e insensible a tildes (fold NFD). Verificado end-to-end.
- **2026-07-19** — **Insumos sumados al prototipo.** Contrato: **tarifa de insumos** (código IUM/CUM/UDI + precio unitario) junto a la de estudios. Orden: sección **④ Insumos** (agregar desde la tarifa del contrato, con cantidad → línea propia que suma al valor de servicios). El copago sigue cayendo **solo sobre estudios** (pregunta #23). Verificado en vivo (insumoTotal, copago sobre estudios, guardado).
- **2026-07-19** — **Documentados los insumos.** Concepto [[Insumos (medicamentos y otros servicios)]]: contraste/medicamento → `medicamentos[]` (CUM/IUM); dispositivo/insumo → `otrosServicios[]` tipoOS 01 (UDI/IDM, Res. 1405/2022). Hallazgo clave: el insumo cuelga del **usuario**, no del estudio (por-orden; "por-estudio" es solo UI). Tarifa del insumo en el **contrato** (como estudios). Enlazado en diccionario/dónde-vive; pregunta #23 (contraste línea vs bundled).
- **2026-07-19** — **Documentado el recaudo del usuario (Acuerdo 260).** Concepto nuevo [[Cuota moderadora y copago (recaudo del usuario)]] (cuota moderadora = valor **fijo** por nivel; copago = **%** del servicio + tope) + ficha [[Acuerdo 260 de 2004 — Cuotas moderadoras y copagos]]. Enlazado en diccionario/dónde-vive; pregunta #22 (valores del año — UVB desde 2026).
- **2026-07-19** — **Prototipo interactivo del flujo Convenio → Contrato → Orden.** App local (`_Adjuntos/wireframes/prototipo-convenio-contrato-orden.html`): 3 módulos encadenados — crear convenio; crear contrato con **tarifa de estudios**; crear orden con **selector de contrato en cascada** (solo lo parametrizado) que hereda pagador/cobertura/modalidad. Enums verificados, validación de **vigencia** y **gate** RIPS+FEV. Supuesto **"orden = un contrato"** ([[Preguntas abiertas|#12]]), marcado en el prototipo. Verificado en vivo (lógica + render).
- **2026-07-19** — **Cierre tarea #6 · anexo DIAN + XSD ingeridos.** Descargada la Caja de herramientas FE V19 V2026 (26 MB); guardados en `_Adjuntos/DIAN FEV v1.9/` el **anexo v1.9** (PDF, 753 págs.) y los **XSD** (`UBL-Invoice-2.1`, `DIAN_UBL_Structures`…). **Cruce fino de campos base verificado** (cardinalidad XSD + obligatoriedad anexo/DT2) → [[Diccionario de construcción de la FEV en salud]] §Verificación XSD. Hallazgo: el XSD UBL es permisivo; la obligatoriedad DIAN/salud viene de reglas de negocio.
- **2026-07-19** — **Fase 3 · Figma del RIS revisado + reconciliación.** Revisado el [[RIS — Colombia (Figma)]] (modelo **Convenio/Contrato/Orden**; ya trae un mapa campo→origen gemelo del diccionario). Creado [[Dónde vive cada campo — FEV × RIS]]: ubica cada campo de la FEV en su capa (Config-IPS / Convenio / Contrato / Orden / Cálculo / Integración) con enums verificados. **Decisiones:** integración = **API de Loggro** (se descarta el "plano" sin API); **numeración DIAN la hace el RIS** (validado vs Res. 000042/2020).
- **2026-07-19** — **Frente FEV (factura DIAN) arrancado.** Proveedor de timbrado definido: **Loggro** (delegación; ingiere XML pre-armado, no cubre RIPS/MUV → la pierna de salud queda en la app). Creado el [[Diccionario de construcción de la FEV en salud]] (Fase 0+1): catálogo de campos de la FEV → **origen de captura**, con la lista de lo que el **front del RIS** debe disponibilizar. Verificado contra DT2 §4–§11 + FEV real validada; **enums en vivo de SISPRO** (`coberturaPlan` 17 — resuelto el 16/17 —, `modalidadPago`, `facturaSinContrato`, `conceptoRecaudo`). Fichas de fuente nuevas: [[DIAN — Anexo Técnico de Factura Electrónica de Venta v1.9]], [[Loggro — API de facturación electrónica]]. Pendiente: cruce fino de campos base vs XSD (Caja de herramientas V2026) y confirmaciones con Loggro.
- **2026-07-16** — Setup del vault; documentos rectores; ingeridas fuentes 1-3; 20 tablas vivas capturadas; base lista para el cruce.
- **2026-07-17** — **Frente B arrancado.** Migrado el proyecto Replit a app local standalone. Reescritos los enums desde las tablas vivas de SISPRO. Construido el motor de validación (3 capas) verificado contra los 7 ejemplos oficiales. Corregido bug documento↔edad. Definida la [[Estrategia de validación y prevención de errores del RIPS|estrategia de prevención #1-#7]].
- **2026-07-17** — Implementadas prevención **#2 (tamaños/RVG05)** y **#4 (campos condicionales)**. Verificado.
- **2026-07-17** — **Auditoría exhaustiva** de las 97 RVC + RVG → [[Inventario de cruces (RVC-RVG) — cobertura del validador]]. Confirmado que existen ~30 cruces implementables adicionales.
- **2026-07-17** — Implementado **Batch B1-B4** (17 cruces: unicidad dx, fechas, rangos RN, familias CIE-10). Verificado: 7 ejemplos oficiales en 0 rechazos + pruebas negativas.
- **2026-07-17** — Implementado **Batch B5-B9** (pagos, sexo↔RN/IVE, doc madre, aritmética, CUPS/día, **finalidad↔causa**), **#6 gate + checklist** y **#1 tooltips**. B9 se pudo hacer sin inventar: la causa "42 materno perinatal" ya estaba en la tabla viva CAUSA_MOTIVO. Verificado (7 ejemplos en 0 rechazos + negativos).
- **2026-07-18** — **Parametrización adicional (tiers).** Tier 1: cableados los ~18 diagnósticos CIE-10 restantes (relacionados/egreso/complicación/causa de muerte) al typeahead — el catálogo CIE-10 ya estaba cargado. Tier 2: capturada la tabla oficial **"Pais"** de SISPRO (249, ISO 3166, Colombia=170) → `paises.ts` (empaquetado), cableado en `codPaisResidencia`/`codPaisOrigen` + validación de membresía en el motor. Verificado (7 ejemplos en 0 rechazos; país 999 → rechazo; build/typecheck).
- **2026-07-19** — **CUM/IUM (Opción A · asistente):** capturado el catálogo **IUM** (34.643 = conteo exacto SISPRO, 34.642 habilitados) en 18 páginas. Servido como JSON diferido (`ium.json`, 4.2 MB) que **solo se carga si el RIPS tiene medicamentos**. `codTecnologiaSalud` (medicamentos) → typeahead para **buscar el medicamento por nombre y traer el IUM**; validación en el motor como **notificación** (no rechazo, porque un CUM también es válido y **CatalogoCUMs = 162.285 es impractical de embeber**). Verificado: 7 ejemplos en 0 rechazos; en vivo "meloxicam 15" → IUM FROBEN; selección guarda el código; IUM inexistente → notificación (no rechazo).
- **2026-07-18** — Cerrado Tier 2: capturadas **UMM** (129, unidad de medida) y **FFM** (37, forma farmacéutica) de SISPRO → `umm.ts`/`ffm.ts`, cableadas en medicamentos como typeahead **condicional a magistral** (tipoMedicamento 03) + validación de membresía. Verificado (magistral con UMM/FFM falsos → rechazos; 7 ejemplos OK). **Hallazgo CIE-11:** NO está en la Consulta de SISPRO (`Code=CIE11`/`CIE_11` → sin resultados) y el DT1 lo define como código hasta **256 caracteres** = codificación **WHO ICD-11 poscoordinada** (no es un enum acotado) → **no parametrizable** con el método de captura; requeriría la **API de WHO ICD-11** (esfuerzo distinto). Es opcional/secundario (el dx obligatorio CIE-10 ya está). Queda de Tier 3: **CUM/IUM** (mediano, sí capturable) y **REPS** (impractical de empaquetar).
- **2026-07-17** — UX municipios: agregado **selector de departamento en dos pasos** (`MunicipioSelector`). El typeahead al enfocar mostraba solo los primeros por código (todos de Antioquia = 05); ahora se elige primero el departamento (33, derivados del catálogo) y el municipio se acota a ese departamento. Verificado en vivo (Valle → 42 municipios 76xxx).
- **2026-07-17** — **#7 CUPS y CIE-10 capturados de la tabla viva de SISPRO** (`CUPSRips` = **13.640**, `CIE10` = **12.634**; conteos exactos, todos habilitados, ground truth verificado). Servidos como JSON estático con **carga diferida** (el bundle no crece: 675 KB). Typeahead cableado en `codConsulta`/`codProcedimiento` (CUPS) y `codDiagnosticoPrincipal` (CIE-10) + validación de membresía en el motor. **Verificado:** 7/7 ejemplos oficiales en 0 rechazos con catálogos cargados; búsqueda/selección en vivo (471100 APENDICECTOMÍA, E101 DIABETES). Captura vía paginación (2000/pág × 7) con verificación de conteo. Faltan CUM/IUM, REPS, CIE-11.
- **2026-07-17** — **#7 (infraestructura + DANE):** construido el typeahead reutilizable `CatalogTypeahead` y capturado el **catálogo oficial de municipios**. Fuente de verdad: tabla viva **"Municipio" de SISPRO** (1.124 registros). **Reconciliado** contra la DIVIPOLA de DANE (datos.gov.co `gdxc-w37w` + geoportal, 1.122): SISPRO es superconjunto exacto + `94663` Mapiripana; se excluye el deshabilitado `27086` (Belén de Bajirá). Catálogo final = **1.123 habilitados**. Verificado en vivo (búsqueda, selección guarda el código, rechazo de inexistentes/deshabilitados). **Nada inventado.** Pendiente: RVC050/066 (campos de modelo), B10 (nicho), y los catálogos CUPS/CIE/CUM/REPS de #7 (requieren sus datos oficiales).
