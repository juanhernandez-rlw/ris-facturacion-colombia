---
tipo: requisito
clase: funcional
id: RF-GL
prioridad: alta
estado: propuesta
origen: ["[[Manual Único de Devoluciones, Glosas y Respuestas (Res 2284-2023 · 1885-2024)]]", "Ley 1438/2011 Art. 57"]
relacionado: ["[[Modelo de persistencia (fusión P0 · Fase 5 · P3)]]", "[[Catálogo de causales de glosa, devolución y respuesta (Res 2284-2023)]]", "[[Mapa de flujos del sistema (para desarrollo)]]"]
etiquetas: [requisito, glosa, devolucion, respuesta, conciliacion, plazos, auditoria]
actualizado: 2026-07-22
---

# Requisitos funcionales — glosas y devoluciones (RF-GL)

## Descripción
Como **prestador que radica FEV en salud**, necesito que el sistema **reciba, registre, responda y concilie** las **devoluciones** (objeción a la factura completa) y **glosas** (objeción a ítems) que formula la entidad responsable de pago (ERP), **dentro de los plazos legales** y anclando cada objeción a la **línea RIPS** afectada, para no perder pagos por vencimiento de términos ni por respuestas fuera de forma.

> [!info] Alcance normativo
> **Res. 2284/2023** (Manual Único de Devoluciones, Glosas y Respuestas) + **Ley 1438/2011 Art. 57** (plazos de glosa). Entidades de datos en [[Modelo de persistencia (fusión P0 · Fase 5 · P3)]] §2.10-2.13; códigos en [[Catálogo de causales de glosa, devolución y respuesta (Res 2284-2023)]].

---

### RF-GL-01 · Registro de devoluciones (factura completa)
La ERP puede **devolver la factura completa** (una sola vez) con una causal `DE…`. Bloquea el pago mientras esté abierta.
- [ ] Registrar devolución con `causalDE`, `valor = total`, fecha y número de radicación.
- [ ] Computar `fechaLimiteRespuesta = fechaComunicación + 5 días hábiles`.
- [ ] Si el prestador **no responde en 5 días hábiles ⇒ aceptación tácita** → generar **NC total** (anula la FEV, §2.3).
- [ ] La ERP dispone de **5 días hábiles** para aceptar la respuesta o **reiterar** la devolución.

### RF-GL-02 · Registro de glosas (por ítem/servicio)
La ERP puede glosar **servicios específicos** de la factura (0..* glosas), cada una con una causal del catálogo.
- [ ] Cada glosa referencia **`campo U10` + `consecutivo del servicio`** → ancla a la **línea RIPS exacta** (envolvente numeral 2).
- [ ] `causal` se elige del catálogo (184 aplicables); `valorGlosado ≤ total`; `complemento` descriptivo.
- [ ] El sistema **prellena los `camposRIPS[]`** implicados por esa causal (guía de subsanación).
- [ ] Plazo de formulación de la ERP: **20 días hábiles** desde la radicación.

### RF-GL-03 · Respuesta del prestador
El prestador responde cada glosa/devolución con un código `RE…`.
- [ ] **Aceptar** (`RE97` total / `RE98` parcial) ⇒ genera **NC** por el valor aceptado (§2.3).
- [ ] **No aceptar / subsanar** (`RE99`, etc.) ⇒ adjuntar **justificación + soportes** y (si aplica) subsanar el campo RIPS.
- [ ] Plazo de respuesta: **15 días hábiles**; fuera de término ⇒ marca `RE95` extemporánea.

### RF-GL-04 · Decisión de la ERP y cierre
Tras la respuesta, la ERP **levanta** la glosa (total/parcial) o la deja **definitiva**.
- [ ] Registrar decisión y `valorLevantado` / `valorRatificado`; plazo de decisión **10 días hábiles**.
- [ ] Glosa levantada total ⇒ el ítem vuelve a pago; definitiva ⇒ habilita conciliación (RF-GL-05).

### RF-GL-05 · Conciliación
El desacuerdo persistente se concilia.
- [ ] Registrar **conciliación directa**: `valorAceptado`, `valorLevantado`, `saldo`, acta.
- [ ] Si falla, **escalar a la Superintendencia Nacional de Salud** (`instancia = Supersalud`).

### RF-GL-06 · Catálogo de causales y semántica
- [ ] Usar el catálogo versionado como **fuente única** (no listas embebidas a mano).
- [ ] Validar la causal contra su grupo (`FA/TA/SO/AU/CO/CL/SA`) en el gate declarativo.

### RF-GL-07 · Plazos, días hábiles y alertas
- [ ] Todos los términos se computan en **días hábiles** (excluye fines de semana y festivos de Colombia).
- [ ] **Semáforo de vencimiento** por objeción (verde/ámbar/rojo) y **aceptación tácita automática** al vencer.

### RF-GL-08 · Trazabilidad e intercambio
- [ ] Toda devolución/glosa/respuesta/decisión registra en la **Bitácora inmutable** (§2.6): actor + antes/después.
- [ ] El intercambio con la ERP usa la **envolvente transaccional del numeral 2** (9 campos) por el **canal pactado** (no portal único) → estrategia en [[ADR-003 · Integración con pagadores para glosas y devoluciones]].

---

## Criterios de aceptación transversales
- [ ] Ninguna objeción puede quedar **sin plazo calculado** ni **sin causal válida**.
- [ ] Una glosa/devolución aceptada **siempre** produce su NC correspondiente (no hay aceptación sin efecto contable).
- [ ] El estado de la factura refleja el trámite: `radicada → (devuelta | glosada) → conciliada | pagada` (§2.4).

## Origen / justificación
Cierra el vacío del bloque `05 · Requisitos` para el **post-radicación**: hoy solo existe RF-01 (contrato). El flujo de glosas ya está prototipado y modelado (enums + reglas), pero **sin requisitos escritos** que fijen plazos, efectos contables y trazabilidad. Derivado del articulado descargado y verificado (2026-07-22).

## Relacionado
- [[Modelo de persistencia (fusión P0 · Fase 5 · P3)]] · [[Catálogo de causales de glosa, devolución y respuesta (Res 2284-2023)]] · [[Manual Único de Devoluciones, Glosas y Respuestas (Res 2284-2023 · 1885-2024)]] · [[Mapa de flujos del sistema (para desarrollo)]]
