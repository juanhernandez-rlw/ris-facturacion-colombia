---
tipo: adr
id: ADR-003
estado: propuesta
fecha: 2026-07-22
decisores: [Juan Hernández (edenmed)]
relacionado: ["[[Manual Único de Devoluciones, Glosas y Respuestas (Res 2284-2023 · 1885-2024)]]", "[[Modelo de persistencia (fusión P0 · Fase 5 · P3)]]", "[[Requisitos funcionales — glosas y devoluciones (RF-GL)]]", "[[ADR-001 · Cómputo del CUFE y custodia de la clave técnica]]"]
etiquetas: [adr, glosa, devolucion, integracion, pagadores, canal-pactado, investigacion, por-confirmar]
---

# ADR-003 · Integración con pagadores para glosas y devoluciones

> [!warning] Estado: propuesta · **investigación** (no implementación)
> Este ADR fija la **estrategia arquitectónica** de integración, no cablea ningún pagador. El cableado por-pagador se difiere y **debe confirmarse** contra la especificación real de cada ERP y contra cualquier **mecanismo estándar** que el Ministerio llegue a adoptar (Regla §1.1: no se asume nada no verificado).

## Contexto
- El trámite de devoluciones/glosas/respuestas ocurre **entre el prestador y cada entidad responsable de pago (ERP)** — no con la DIAN ni con el MUV. A diferencia de esos dos (un **endpoint único** cada uno), aquí hay **N contrapartes**.
- **Res. 2284/2023 Art. 10** (verificado): la información transaccional se comunica *"de forma automatizada, en línea y en el formato de datos…"* «a través de los canales de relacionamiento y mecanismos… **pactados**» (Res. 2284, Art. 10), registrada conforme al **numeral 2 del Anexo Técnico No. 3**.
- **Lectura clave — dos capas separadas:**
  - **Formato de datos: estandarizado** por la norma → la **envolvente del numeral 2** (9 campos: `numRegistro · numRadicación · fechaHora · numFactura(=DIAN) · campo U10 · consecutivo del servicio · código de causa · valor · complemento`).
  - **Canal/transporte: pactado** bilateralmente en el acuerdo de voluntades → **no hay portal único obligatorio**; cada ERP puede exigir su propio medio.

## Investigación — panorama de canales (por confirmar por pagador)
No existe un mecanismo único mandado. En la práctica del sector conviven:
1. **Servicios web / API del pagador** (o de su plataforma de auditoría de cuentas).
2. **Intercambio de archivos** (el pagador publica/recibe el numeral 2 como archivo — CSV/JSON/XML — por SFTP o portal).
3. **Operadores / clearinghouses de radicación** que intermedian y centralizan (como ya ocurre con la radicación de la FEV).
4. **Portal web manual** (human-in-the-loop) como piso mínimo cuando el pagador no ofrece automatización.

## Decisión (estrategia propuesta)
1. **Contrato canónico interno = numeral 2.** El sistema representa toda devolución/glosa/respuesta con la envolvente del numeral 2 + las entidades §2.10-2.13. Es la **fuente única**; los canales solo **serializan/deserializan** desde ella.
2. **Puerto + adaptadores** (mismo patrón que la frontera de CUFE en [[ADR-001 · Cómputo del CUFE y custodia de la clave técnica]]): un **puerto `CanalPagador`** con adaptadores intercambiables — `api-rest` · `archivo-sftp` · `operador` · `portal-manual`. Cambiar de canal **no toca** el dominio.
3. **El canal es atributo del acuerdo.** `Convenio`/`Contrato` gana la config `canalGlosas { tipo, endpoint/credencialRef, formato }` — porque el canal se **pacta** por pagador. (Credenciales por referencia a bóveda, nunca en texto plano — coherente con ADR-001.)
4. **Piso mínimo garantizado:** si un pagador no automatiza, el flujo cae al **portal-manual** (registro manual de la glosa/respuesta) sin bloquear el trámite ni la trazabilidad (Bitácora §2.6).
5. **Aislar el riesgo normativo:** si el Ministerio adopta un **mecanismo estándar** (el Art. 10 remite a "lineamientos"), se añade un adaptador más; el dominio no cambia.

## Consecuencias
- **(+)** El dominio de glosas es agnóstico al transporte; agregar un pagador = un adaptador + config, no un rediseño.
- **(+)** El numeral 2 como contrato canónico da **interoperabilidad y trazabilidad** uniformes.
- **(−)** Hay que **mantener adaptadores por pagador** y descubrir la especificación de cada uno (trabajo recurrente, no de una vez).
- **(−)** Sin estándar de transporte, el **portal-manual** será necesario un tiempo → costo operativo.

## Preguntas abiertas / por confirmar
- ¿Qué canal exige realmente cada pagador de **edenmed** (API / archivo / operador)? → relevar por Convenio.
- ¿El Ministerio publicará un **mecanismo/estándar de transporte** además del formato del numeral 2?
- ¿Se usará un **operador de radicación** que ya cubra parte de este intercambio?
- Encaje con la **estrategia de recaudo** y con la representación gráfica (Loggro) — fuera de alcance de este ADR.

## Relacionado
- [[Manual Único de Devoluciones, Glosas y Respuestas (Res 2284-2023 · 1885-2024)]] · [[Modelo de persistencia (fusión P0 · Fase 5 · P3)]] (§2.10-2.13) · [[Requisitos funcionales — glosas y devoluciones (RF-GL)]] (RF-GL-08) · [[Catálogo de causales de glosa, devolución y respuesta (Res 2284-2023)]] · [[Preguntas abiertas]]
