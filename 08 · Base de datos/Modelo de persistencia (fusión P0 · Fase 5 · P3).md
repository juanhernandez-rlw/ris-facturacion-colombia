---
tipo: nota
area: base-datos
tema: persistencia
estado: propuesta
fuentes: ["[[Mapa de flujos del sistema (para desarrollo)]]", "[[project-auditoria-modelo-2026-07]]"]
relacionado: ["[[Mapa Orden → RIPS (transform · fusión P0 · Fase 1)]]", "[[Recaudo — hoja de validación (Acuerdo 260, por validar)]]"]
etiquetas: [base-datos, persistencia, rbac, auditoria, estado-factura, fase-5]
actualizado: 2026-07-20
---

# Modelo de persistencia (fusión P0 · Fase 5 · P3)

> [!abstract] Qué es
> **Fase 5 / P3.** Diseño de las **entidades de almacenamiento** — hoy `08 · Base de datos` está vacío pese a ser una pregunta núcleo (*"¿cómo se almacena?"*, hallazgo **A-03**). Cubre lo que los flujos ya describen pero el modelo no persiste: **factura, estados, numeración, notas, bitácora, RBAC** y el **acumulador anual de recaudo** (necesario para R-05/D6). Propuesta de arquitectura; los tipos de dato finos se afinan al implementar.

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
`{ id, tipo (NC 20 / ND 30), facturaRef (CUFE), motivo, valor, estado, fecha }` — hoy ausente (cabecera RIPS `tipoNota`/`numNota`).

### 2.4 EstadoFactura *(máquina de estados — del flujo 6.1)*
`borrador → generada → timbrada(CUFE) → transmitida(CUV) → radicada → conciliada → pagada`
Excepciones: `rechazada` (DIAN/MUV → corregir → generada), `glosada` (→ responder), `anulada` (vía NC).
> Modelar como **transiciones válidas** (no un string libre) + timestamp por transición.

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

## 3 · Relaciones (resumen)
```
ConfigIPS 1─* ResoluciónDIAN
Convenio 1─* Contrato 1─* Orden *─1 Paciente
Orden *─1 Factura 1─* Nota
Factura 1─1 EstadoFactura(historial)  · Factura *─1 ResoluciónDIAN
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
