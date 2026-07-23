---
tipo: nota
area: base-datos
tema: persistencia
estado: propuesta
fuentes: ["[[Mapa de flujos del sistema (para desarrollo)]]", "[[project-auditoria-modelo-2026-07]]", "[[Manual Único de Devoluciones, Glosas y Respuestas (Res 2284-2023 · 1885-2024)]]"]
relacionado: ["[[Mapa Orden → RIPS (transform · fusión P0 · Fase 1)]]", "[[Recaudo — hoja de validación (Acuerdo 260, por validar)]]", "[[Requisitos funcionales — glosas y devoluciones (RF-GL)]]"]
etiquetas: [base-datos, persistencia, rbac, auditoria, estado-factura, glosa, devolucion, fase-5]
actualizado: 2026-07-22
---

# Modelo de persistencia (fusión P0 · Fase 5 · P3)

> [!abstract] Qué es
> **Fase 5 / P3.** Diseño de las **entidades de almacenamiento** — hoy `08 · Base de datos` está vacío pese a ser una pregunta núcleo (*"¿cómo se almacena?"*, hallazgo **A-03**). Cubre lo que los flujos ya describen pero el modelo no persiste: **factura, estados, numeración, notas, devoluciones y glosas** (§2.10–2.13, derivadas de la Res. 2284/2023 + 1885/2024), **bitácora, RBAC** y el **acumulador anual de recaudo** (necesario para R-05/D6). Propuesta de arquitectura; los tipos de dato finos se afinan al implementar.

## 1 · Entidades existentes (ya modeladas)
`Convenio` — `Contrato` (FK→Convenio) — `Orden` (FK→Contrato). Ver `generador-rips/modelo-formal/esquema-json/`.

## 2 · Entidades nuevas

### 2.1 Paciente *(nuevo — cierra R-05 y evita recapturar)*
Identidad persistente del paciente (hoy la Orden lo captura ad-hoc, sin historial).
`{ id, tipoDoc, numDoc (único), nombres, sexo, fechaNac, municipio, país, tipoUsuario, zona }`
> Clave para el **acumulador anual** (§2.7) y para la minimización (Ley 1581): se guarda una vez, no por atención.

### 2.2 Factura *(nuevo)*
La FEV emitida. `{ id, numFactura, ordenIds[], convenioId, contratoId, cufe, cuv, customizationID (SS-CUFE…), total, prepaidAmount, estado→§2.4, fechaEmision, resolucionId→§2.5 }`
> Cuadra con el RIPS: `numFactura` = RIPS (**PFP001**); `prepaidAmount` ≤ total.

### 2.3 Nota crédito/débito *(nuevo)*
`{ id, tipo (NC/ND), tipoOperacion (20/30), conceptoCorreccion (13.2.4 NC · 13.2.5 ND), facturaRef (CUFE), numNota, alcance (total/parcial), lineas[], valor, moderadores=0, estado, fecha }` — hoy ausente (cabecera RIPS `tipoNota`/`numNota`).
> **NC total** (anulación) → **sin RIPS**, el MUV marca la FEV como "afectada con NC al 100 %". **NC parcial / ND** → **con RIPS** soporte (Σ RIPS = `valor` de la nota); pagos moderadores siempre en 0. Flujo, campos y códigos verificados en [[Notas crédito y débito (NC · ND) — flujo, campos y reglas]].

### 2.4 EstadoFactura *(máquina de estados — dos ejes)*
Cada paso hacia adelante es una **llamada asíncrona a un servicio externo** (DIAN vía Loggro · MUV MinSalud · portal ERP), con **latencia y resultado**. Se modela con **dos ejes**:
- **A · Documento** (persistente): `borrador → generada → timbrada(CUFE) → validada(CUV) → radicada → conciliada → pagada`.
- **B · Operación** (efímero, por transición): `idle → enviando/esperando` (**loading**) `→ ok | error`.

**Excepciones:** `rechazada_dian` (validación previa → corregir → re-timbrar) · `rechazada_muv` (RVC/RVG → corregir RIPS → re-transmitir) · `contingencia` (DIAN no disponible → numeración de contingencia → diferido, Cap. 6) · `error_radicacion` · `devuelta` (Res. 2284 Art. 6 → corregir y reradicar, o aceptar → NC total; §2.10) · `glosada` (§2.11) · `conciliada` (§2.13) · `anulada` (vía NC total).
> **Reanudable:** el resultado se consulta (`ConsultarCUV` / acuse DIAN); si se interrumpe, se **consulta**, no se reenvía (evita duplicados). Transiciones válidas + timestamp por transición (§2.6). Mapa completo, loading states y operaciones en [[Ciclo de vida de la FEV — estados y operaciones asíncronas]].

### 2.5 ResoluciónDIAN / Consecutivo *(nuevo — numeración runtime)*
`{ id, prefijo, rangoDesde, rangoHasta, vigenciaDesde, vigenciaHasta, claveTecnica, siguiente }`
> El RIS asigna el consecutivo dentro del rango vigente (flujo 4.3); bloquea si vencido/agotado.

### 2.6 Bitácora *(inmutable — del flujo 4.4; exige HCE Ley 2015)*
`{ id, entidad, entidadId, accion (crear/editar/anular/timbrar), usuarioId, fecha, antes, después }`
> **Append-only**; toda acción sensible registra actor + antes/después. Cierra S-02/S-05.

### 2.7 RecaudoPagado *(nuevo — acumulador anual, cierra R-05/D6)*
`{ id, pacienteId (o núcleoId), año, concepto (01/02/03), valor, facturaRef }`
> Permite `copago = min(topeEvento, topeAnual − Σ acumulado del año)`. La granularidad (individuo vs **núcleo familiar**) es **D6, por-validar**.

### 2.8 Usuario / Rol / Permiso *(RBAC — del flujo 7.1; cierra S-02)*
`Usuario{ id, ... } — Rol{ id, nombre (Admin/Facturador/Cajero/Auditor/Consulta) } — Permiso{ recurso, accion }`
> Verificación por acción; el actor alimenta la Bitácora (§2.6).

### 2.9 ConfigIPS *(maestro — alimenta el transform, Fase 1 §7)*
`{ numDocumentoIdObligado (NIT), sedes[{ codPrestador REPS, servicios[] }], rut, domicilio, resolucionesDIAN[]→§2.5, ambiente (pruebas/producción) }`

### 2.10 Devolución *(nuevo — Res. 2284/2023 Art. 6)*
Objeta la **factura completa** (antes de auditar ítems); bloquea el pago mientras esté abierta. Una factura tiene **0..1** devolución (se formula una sola vez).
`{ id, numRegistro, facturaRef (numFactura, coincide DIAN), numRadicacion, causalDE (→catálogo), valor (= total), complemento, fechaRegistro, fechaLimiteRespuesta, fechaRespuesta, estado }`
> Plazos **5 / 5 / 5** días hábiles (comunicar desde radicación · responder prestador · decidir ERP). **Silencio del prestador ⇒ aceptación tácita → NC total** (anula, §2.3). Estados: `comunicada → respondida → (aceptada | reiterada | resuelta)`.

### 2.11 Glosa *(nuevo — Ley 1438/2011 Art. 57)*
Objeta **ítems/servicios** de la factura (parcial). Una factura tiene **0..\*** glosas, cada una sobre un servicio (consecutivo + `U10`) y una causa.
`{ id, numRegistro, facturaRef, campoU10 (usuario RIPS), consecutivoServicio, causal (→catálogo, 7 grupos FA/TA/SO/AU/CO/CL/SA), valorGlosado, complemento, fechaFormulacion, fechaLimiteRespuesta, fechaDecision, estado }`
> Plazos **20 / 15 / 10** días hábiles (formular · responder · decidir). Estados: `formulada → respondida → (levantada_total | levantada_parcial | definitiva)`. **Glosa aceptada → NC parcial** (§2.3); **definitiva en desacuerdo → Conciliación** (§2.13).

### 2.12 Respuesta *(nuevo — Anexo Técnico 3, códigos RE)*
Réplica del prestador (o contra-réplica de la ERP) a una devolución o glosa. Una devolución/glosa tiene **0..\*** respuestas (ida y vuelta). La Res. 1885/2024 ajusta la transitoriedad (Art. 12) y los soportes (Anexo Técnico 1) del trámite de auditoría en torno a causales de la 2284 como **DE56** y las glosas **S021 / 3061 / AU01**.
`{ id, ref (tipo: devolucion|glosa, refId), causalRE (RE95 extemporánea · RE96 injustificada · RE97 aceptada total · RE98 parcial subsanada · RE99 no aceptada subsanada · →catálogo), valor, justificacion, soporteIds[], fechaRespuesta }`
> El sentido (acepta / subsana / no acepta) lo lleva el `causalRE`; **RE97 al 100 % ⇒ NC**.

### 2.13 Conciliación *(nuevo — Art. 57 par.: desacuerdo persistente)*
Cierre del desacuerdo cuando la glosa queda **definitiva**. Una factura tiene **0..1** conciliación sobre 1..\* glosas.
`{ id, facturaRef, glosaIds[], valorGlosadoInicial, valorAceptado, valorLevantado, saldo, instancia (directa | Supersalud), actaRef, fecha, estado }`
> Estados: `abierta → conciliada | escalada_supersalud`. La conciliación directa fallida escala a **Supersalud** (Superintendencia Nacional de Salud).

> [!note] Envolvente transaccional común (Anexo Técnico 3, numeral 2 — verificado)
> Devolución, glosa y respuesta comparten el **mismo registro de intercambio** con la ERP: `numRegistro · numRadicacion · fechaHora · numFactura (=DIAN) · campoU10 · consecutivoServicio · códigoCausa · valor · complemento`. Los campos `campoU10` + `consecutivoServicio` **enlazan cada glosa con la línea RIPS exacta** (numerales 2.2.5–2.2.6). El canal es **pactado** (Art. 10 — no hay portal único obligatorio) → estrategia de integración en [[ADR-003 · Integración con pagadores para glosas y devoluciones]]. Causales (DE / glosa / RE) en el catálogo → [[Catálogo de causales de glosa, devolución y respuesta (Res 2284-2023)]]; requisitos en [[Requisitos funcionales — glosas y devoluciones (RF-GL)]].

## 3 · Relaciones (resumen)
```
ConfigIPS 1─* ResoluciónDIAN
Convenio 1─* Contrato 1─* Orden *─1 Paciente
Orden *─1 Factura 1─* Nota
Factura 1─1 EstadoFactura(historial)  · Factura *─1 ResoluciónDIAN
Factura 1─0..1 Devolución       · Factura 1─* Glosa (por servicio/causa)
Devolución 1─* Respuesta        · Glosa 1─* Respuesta
Glosa aceptada → Nota(NC parcial) · Devolución aceptada → Nota(NC total)
Factura 1─0..1 Conciliación *─* Glosa
Paciente 1─* RecaudoPagado (por año)
Usuario *─* Rol *─* Permiso ; toda mutación → Bitácora
```

## 4 · Datos sensibles (Ley 1581 / HCE Ley 2015 — cierra S-00/S-03/S-04)
- **Clasificación:** `Paciente` + diagnósticos (CIE-10) = **dato sensible de salud** → cifrado en reposo, control de acceso por rol, y **minimización** (`additionalProperties:false` ya aplicado al esquema de orden).
- **Retención / borrado:** definir política (pregunta #4 abierta) — qué se guarda vs solo se transmite.
- **Consentimiento / Habeas Data:** flujo de consentimiento en admisión (hoy sin modelar).
- **Transmisión a terceros (Loggro):** requiere **contrato de encargado del tratamiento** (S-01).

## Relacionado
- [[Mapa de flujos del sistema (para desarrollo)]] · [[Mapa Orden → RIPS (transform · fusión P0 · Fase 1)]] · [[Recaudo — hoja de validación (Acuerdo 260, por validar)]] · [[Preguntas abiertas]] (#3, #4)
- **Glosas y devoluciones:** [[Requisitos funcionales — glosas y devoluciones (RF-GL)]] · [[Catálogo de causales de glosa, devolución y respuesta (Res 2284-2023)]] · [[ADR-003 · Integración con pagadores para glosas y devoluciones]]
