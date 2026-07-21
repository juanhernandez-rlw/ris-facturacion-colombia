---
tipo: contexto
estado: vivo
actualizado: 2026-07-19
etiquetas: [pregunta-abierta]
---

# Preguntas abiertas

Preguntas cuya respuesta afecta el diseño. Se resuelven enlazando a la fuente que las contesta.

| # | Pregunta | Área | Estado | Resuelta por |
| --- | --- | --- | --- | --- |
| 1 | ¿Qué debe hacer la app exactamente, y qué queda por fuera? | contexto | abierta |  |
| 2 | ¿Quiénes van a usar la app y qué puede hacer cada uno? | dominio | abierta |  |
| 3 | ¿Qué normas de seguridad va a cumplir la app (por ejemplo, ISO 27001)? | seguridad | abierta |  |
| 4 | ¿Qué datos del paciente (RIPS/HCE) se guardan dentro de la app y cuáles solo se envían sin guardarlos? | modelo-datos | abierta |  |
| 5 | ~~Conseguir DT1 v002~~ → **resuelta**: DT1 v002 descargado y confirmado | normativo | resuelta | [[SISPRO — Micrositio FEV-RIPS]] |
| 6 | Nuestra copia (transcripción) de los campos tiene errores: ¿cómo los corregimos comparándola con los documentos oficiales DT1 y DT2? (celdas duplicadas en `numNota` y en los "Campos FEV-salud"; "Soportes de cobro" aún sin definir) | modelo-datos | abierta | [[Facturación RIS - Colombia — RIPS (transcripción)]] |
| 7 | Para cada campo del RIPS, ¿de dónde saca la app ese dato y cómo se captura? (el propio documento lo marca "en proceso") | modelo-datos | abierta | [[Facturación RIS - Colombia]] |
| 8 | El formato oficial nuevo (JSON v002) trae campos que en nuestra lista no aparecen: ¿los agregamos al mapa? (`CIE-11`, `causaMotivoAtencion`, `codigoVIDA`, `codPaisOrigen`) | modelo-datos | abierta | [[SISPRO — Micrositio FEV-RIPS]] |
| 9 | Nuestras listas de valores permitidos no coinciden con las oficiales (por ejemplo `tipoUsuario`): ¿qué hay que ajustar para usar la lista oficial `.gc`? | modelo-datos | abierta | [[SISPRO — Micrositio FEV-RIPS]] |
| 10 | ~~Tablas de referencia vigentes~~ → **resuelta:** 20 tablas vivas capturadas; `tipoUsuario`=13 ✓. Residual: cobertura 16/17 es lado XML → confirmar en DT2 | modelo-datos | parcial | [[Tablas de referencia vigentes (SISPRO) — enums del RIPS]] |
| 11 | El documento oficial DT1 parece traer errores: ¿los confirmamos al cruzar los datos? (llaves duplicadas, `vrServicio` de consultas en 0–10, `codigoVIDA` sin comillas) | modelo-datos | abierta | [[Preparación del cruce — DT1 v002 (cambios, erratas, tablas)]] |
| 12 | ¿Una orden queda atada a **un solo contrato** (y mezclar contratos ⇒ varias órdenes/facturas)? La FEV va a un adquiriente con una sola cobertura/modalidad. | flujo | **por-validar** (usuario) | [[Dónde vive cada campo — FEV × RIS]] |
| 13 | ¿Quién computa el **CUFE / `SS-CUFE`** — el RIS o Loggro? (usa la **clave técnica** de la resolución de numeración) | integración | abierta (Loggro) | [[Loggro — API de facturación electrónica]] |
| 14 | Loggro: ¿**preserva las `UBLExtension` personalizadas** (extensión de salud del DT2) al firmar y transmitir? | integración | abierta (Loggro) | [[Loggro — API de facturación electrónica]] |
| 15 | Loggro: ¿**soporta el perfil salud** (`SS-CUFE`/`SS-CUDE`…) o solo FEV convencional? | integración | abierta (Loggro) | [[Loggro — API de facturación electrónica]] |
| 16 | Loggro: **autenticación** del producto "Documentos Electrónicos" y **ambiente de pruebas**. | integración | abierta (Loggro) | [[Loggro — API de facturación electrónica]] |
| 17 | **Casos "sin contrato"** (particular, SOAT, urgencias, tutela, ADRES… — 7 de `facturaSinContrato`): diseñar el **flujo aparte**, incl. tarifa particular. | flujo | **aplazada** (flujo futuro) | [[Diccionario de construcción de la FEV en salud]] |
| 18 | En el formulario de orden, ¿el **diagnóstico (CIE-10)** y la **vía de ingreso** ya están entre los 6 dropdowns de "Información del estudio" o hay que **agregarlos**? | front | **por-validar** (Figma/usuario) | [[Inventario del formulario de Orden × RIPS-FEV]] |
| 19 | **Impuestos en salud:** reglas de **IVA** (excluido/exento/gravado) por tipo de estudio → cuándo aplica `TaxTotal`. | facturación | abierta | [[Diccionario de construcción de la FEV en salud]] |
| 20 | **CUCON:** ¿cómo y cuándo se obtiene del **SIIFA**? (obligatorio para radicar desde jul-2026; gracia para FOMAG) | integración | abierta | [[Dónde vive cada campo — FEV × RIS]] |
| 21 | **Multiusuario** y **modalidades ≠ evento** (cápita / PGP): ¿entran en el alcance del prototipo/modelo? | alcance | abierta | [[Diccionario de construcción de la FEV en salud]] |
| 22 | **Valores vigentes** de cuota moderadora / copago: desde **2026** la referencia es **UVB** (no SMLMV). ¿Traemos los montos/topes del año en curso para el cálculo del recaudo en el RIS? | facturación | abierta | [[Acuerdo 260 de 2004 — Cuotas moderadoras y copagos]] |
| 23 | **Contraste / insumo:** ¿va como **línea propia** (medicamento CUM/IUM) o **bundled** en el precio del CUPS "contrastado"? ¿Lleva **recaudo propio** o el recaudo es solo del estudio? | facturación | por-validar | [[Insumos (medicamentos y otros servicios)]] |
| 24 | **Regla recaudo × tipo de usuario:** ¿quién paga **copago** vs **cuota moderadora** según `tipoUsuario` (y tipo de servicio)? Propuesta actual (por validar contra Acuerdo 260 art. 5–9): contributivo→cuota, subsidiado→copago, ARL/SOAT/particular→no aplica. | facturación | por-validar | [[Cuota moderadora y copago (recaudo del usuario)]] |

> [!note] Sobre la redacción
> Las preguntas **abiertas** se reformularon en lenguaje simple (2026-07-16). Los términos técnicos originales (nombres de campo, documentos, códigos) se conservan **entre paréntesis**; no se cambió ningún dato, estado ni enlace de fuente. Las filas ya resueltas (#5, #10) se dejaron tal cual.
>
> **Filas #12–21 (2026-07-19):** surgen del trabajo de facturación FEV y del flujo **Convenio → Contrato → Orden**. Estados nuevos: `por-validar` (con el usuario), `abierta` (con Loggro / fuente), `aplazada` (flujo futuro). La #12 es la que quedaste de revisar.
