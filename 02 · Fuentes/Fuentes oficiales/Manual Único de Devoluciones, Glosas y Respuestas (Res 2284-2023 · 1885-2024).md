---
tipo: fuente
categoria: oficial
titulo: "Manual Único de Devoluciones, Glosas y Respuestas (Res. 2284/2023 · 1885/2024)"
url: "https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%20No%202284%20de%202023.pdf"
autor: "Ministerio de Salud y Protección Social"
fecha_publicacion: "2023-12-29"
fecha_captura: 2026-07-22
estado: procesada
es_fuente_de_verdad: true
confiabilidad: alta
areas: [arquitectura, base-datos, facturacion, requisitos]
etiquetas: [oficial, minsalud, glosa, devolucion, respuesta, manual-unico, fuente-de-verdad]
---

# Manual Único de Devoluciones, Glosas y Respuestas (Res. 2284/2023 · 1885/2024)

> [!info] Fuente de la verdad · oficial (MinSalud)
> **Res. 2284 de 2023** — *"Por la cual se establecen los soportes de cobro de la factura de venta en salud, el **Manual Único de Devoluciones, Glosas y Respuestas** y se dictan otras disposiciones"*. Rige **qué** puede objetar una entidad responsable de pago (ERP) sobre una factura radicada, **con qué código**, **en qué plazo** y **por qué canal**. Es la capa que se activa **después** de la radicación de la FEV+RIPS: es la fuente de la verdad del flujo de glosas del sistema.
> **Res. 1885 de 2024** — *"Por la cual se modifica la Resolución 2284 de 2023…"*: ajusta la **transitoriedad (Art. 12)** y el **Anexo Técnico No. 1 (soportes de cobro)**.

## 🔗 Acceso
- **Res. 2284/2023** (PDF, 34 págs.) — ver frontmatter.
- **Res. 1885/2024** (PDF, 12 págs.) — `https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%20No%201885%20de%202024.pdf`
- Ambas ingeridas en `_Adjuntos/Manual de Glosas (Res 2284-2023 · 1885-2024)/` (PDF + texto extraído).

## 🎯 Qué información aporta
- **Procedimiento y plazos** (verificado):
  - **Devolución** (objeta la factura **completa** · Res. 2284 Art. 6): **5 / 5 / 5** días hábiles — comunicar (desde radicación) · responder el prestador (silencio ⇒ **aceptación tácita → nota crédito**) · decidir la ERP.
  - **Glosa** (objeta **ítems/servicios** · Ley 1438/2011 Art. 57): **20 / 15 / 10** días hábiles — formular · responder · decidir (levanta total/parcial o queda **definitiva**). Desacuerdo persistente → **conciliación** (directa y, de fallar, **Supersalud**).
- **Anexo Técnico No. 3** — las tablas de códigos:
  - **Causales de devolución (`DE…`)**: p. ej. `DE16` persona corresponde a otro responsable · `DE44` prestador fuera de red · `DE50` factura ya pagada/en trámite · **`DE56`** no radicación de soportes en los **22 días hábiles** siguientes.
  - **Causales de glosa**: **7 grupos** (`FA` facturación · `TA` tarifas · `SO` soportes · `AU` autorizaciones · `CO` cobertura · `CL` calidad · `SA` seguimiento a acuerdos) y **283 códigos** (99 subcategorías + **184 aplicables**) → relacionados con el campo RIPS afectado. Detalle y conteos en [[Catálogo de causales de glosa, devolución y respuesta (Res 2284-2023)]].
  - **Códigos de respuesta (`RE…`)**: `RE95` extemporánea · `RE96` injustificada · `RE97` aceptada total (⇒ NC) · `RE98` parcial subsanada · `RE99` no aceptada subsanada.
- **Numeral 2 del Anexo Técnico No. 3 — registro transaccional** (estructura del intercambio ERP↔prestador, verificado líneas 2070-2092): `numRegistro · numRadicación · fechaHora · numFactura (=DIAN) · campo U10 · consecutivo del servicio · código de causa · valor · complemento`. Los campos **U10 + consecutivo** anclan cada glosa a la **línea RIPS exacta**.
- **Canal (Art. 10):** el trámite es automatizado, en línea, por los **"canales de relacionamiento pactados"** (remite al numeral 2 del Anexo Técnico 3) — **no hay portal único obligatorio**. Insumo clave de la estrategia de integración con pagadores.

## ✅ Vigencia y alcance (verificado 2026-07-22)
- **2284/2023 vigente**, modificada por la **1885/2024** (transitoriedad Art. 12 + Anexo Técnico 1). La 1885 **no crea** las causales `DE56` / `S021` / `3061` / `AU01`: estas ya están en el Anexo Técnico 3 de la 2284; la 1885 ajusta el trámite de auditoría a su alrededor.
- La 2284 reemplaza el esquema de glosas de la **Res. 3047/2008** (referencia histórica, no vigente).

## ✅ Ingesta y verificación (2026-07-22)
- Ambas resoluciones descargadas del sitio de MinSalud e ingeridas (PDF + `.txt` extraído).
- Verificado en el texto: título/objeto (Art. 1), plazos de devolución (Art. 6, líneas 242-252), estructura del registro transaccional (numeral 2, líneas 2070-2092), causales `DE56`/`S021`/`AU01` (líneas 1121/1503/1684), códigos `RE97`/`RE98`/`RE99` (líneas 2023-2031).
- **Bloque completado (2026-07-22):** catálogo de causales → [[Catálogo de causales de glosa, devolución y respuesta (Res 2284-2023)]]; entidades de datos → [[Modelo de persistencia (fusión P0 · Fase 5 · P3)]] §2.10-2.13; requisitos → [[Requisitos funcionales — glosas y devoluciones (RF-GL)]]; estrategia de integración → [[ADR-003 · Integración con pagadores para glosas y devoluciones]].

## 🕓 Procedencia
- **Origen:** Normatividad MinSalud (minsalud.gov.co). Descarga y verificación 2026-07-22.
- **Norma de plazos de glosa:** los términos 20/15/10 provienen del **Art. 57 de la Ley 1438 de 2011** (la 2284 remite a él).

## 🔗 Relacionado
- [[Modelo de persistencia (fusión P0 · Fase 5 · P3)]] (§2.10-2.13) · [[Mapa de flujos del sistema (para desarrollo)]] · [[SISPRO — Micrositio FEV-RIPS]] · [[DIAN — Anexo Técnico de Factura Electrónica de Venta v1.9]] (la NC que cierra la glosa aceptada)
