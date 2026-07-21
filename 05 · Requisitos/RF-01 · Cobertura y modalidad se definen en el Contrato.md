---
tipo: requisito
clase: funcional
id: RF-01
prioridad: alta
estado: aprobado
origen: ["[[Dónde vive cada campo — FEV × RIS]]", "auditoría 2026-07-20 (hallazgo A-04)"]
relacionado: ["[[Mapa de flujos del sistema (para desarrollo)]]"]
etiquetas: [modelo-datos, contrato, cobertura, modalidad, auditoria]
actualizado: 2026-07-20
---

# RF-01 · Cobertura y modalidad de pago se definen en el Contrato

## Descripción
Como **modelador del sistema**, necesito que la **cobertura** (`COBERTURA_PLAN_BENEFICIOS`) y la **modalidad de pago** (`MODALIDAD_PAGO`) sean atributos del **Contrato** (no del Convenio), para poder representar que un mismo pagador negocia varios contratos con coberturas/modalidades distintas.

## Criterios de aceptación
- [x] `cob` y `mod` son campos **obligatorios del Contrato** (`contrato.schema.json`) — *ya implementado*.
- [ ] El **Convenio** NO lleva `cob`/`mod`; sí lleva identificación del pagador, forma/medio de pago y flags de autorización/MIPRES/SIRAS.
- [ ] La **Orden hereda** cobertura/modalidad del Contrato elegido (no se recapturan por atención).
- [ ] Un mismo Convenio puede tener contratos con `cob`/`mod` distintas (caso soportado y probado).

## Origen / justificación
Resuelve la **contradicción documental A-04** de la auditoría 2026-07-20:
- **"Dónde vive cada campo"** afirmaba *"cobertura/modalidad se maestrean en el Convenio"* → **superado** (texto conservado ahí como registro histórico revertible).
- El **modelo** (`contrato.schema.json`), el **[[Mapa de flujos del sistema (para desarrollo)|Mapa de flujos]]** y el **seed** las ubican en el **Contrato**.
- **Evidencia (dato del seed):** `CV1` tiene `CT1` (cob **01** · mod **12**) y `CT2` (cob **16** · mod **01**) → sería imposible si vivieran en el Convenio (un pagador = un valor).

**Decisión:** viven en el **Contrato**. Impacto normativo: alimentan `VFE022` (pagador ↔ cobertura) y los cruces `DT1 §1.8` (cobertura × modalidad × tipoUsuario × recaudo).

## Relacionado
- [[Dónde vive cada campo — FEV × RIS]] · [[Mapa de flujos del sistema (para desarrollo)]] · [[Preguntas abiertas]]
