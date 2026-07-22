---
tipo: concepto
area: dominio
tema: facturacion
estado: verificado
fuentes: ["[[Acuerdo 260 de 2004 — Cuotas moderadoras y copagos]]"]
relacionado: ["[[Diccionario de construcción de la FEV en salud]]", "[[Dónde vive cada campo — FEV × RIS]]"]
etiquetas: [dominio, facturacion, recaudo, copago, cuota-moderadora]
actualizado: 2026-07-19
---

# Cuota moderadora y copago (recaudo del usuario)

## Definición
**Recaudo del usuario** = lo que el paciente paga de su bolsillo por la atención. Son dos figuras que dependen del **nivel de contribución** del afiliado (su Ingreso Base de Cotización, IBC). Reguladas por el **[[Acuerdo 260 de 2004 — Cuotas moderadoras y copagos|Acuerdo 260 de 2004]]** (CNSSS).

## Nivel de contribución (3 rangos)
Clasificación del afiliado por IBC en salarios mínimos (régimen contributivo):
- **Nivel 1** — IBC < 2 SMLMV
- **Nivel 2** — IBC 2–5 SMLMV
- **Nivel 3** — IBC > 5 SMLMV

Base de cálculo: el IBC del **cotizante**; si hay varios en el núcleo, el **menor ingreso**. En **régimen subsidiado** el nivel sale del **SISBEN** (reglas propias).

## Las dos figuras — ⚠️ una es FIJA y otra es PORCENTAJE
| | **Cuota moderadora** | **Copago** |
|---|---|---|
| Naturaleza | **Valor FIJO** por nivel | **PORCENTAJE del valor del servicio** por nivel |
| ¿Depende del valor del servicio? | No | Sí |
| Referencia contributivo | 11.7 / 46.1 / 121.5% **del salario mínimo diario** → monto fijo | 11.5 / 17.3 / 23% **de la tarifa** |
| Tope | — | **Sí:** por evento (28.7 / 115 / 230% del SMLMV) y anual |
| Para qué | Moderar el uso (consultas, ayudas dx) | Cofinanciar el sistema |

> **2026:** la unidad de referencia pasó de SMLMV a **UVB** (Unidad de Valor Básico). Los valores/topes se **actualizan cada año** por MinSalud → ver [[Preguntas abiertas|#22]].

## Dónde vive en el FEV-RIPS
**No es un campo** de la factura ni del RIPS. El FEV/RIPS solo guardan el **resultado**: `conceptoRecaudo` (01 copago · 02 cuota moderadora), el **valor** en `valorPagoModerador` (RIPS) y en `cac:PrepaidPayment` (FEV). El nivel es un **insumo de cálculo**; no viaja al documento.

## Cómo lo modela el RIS (decisión de diseño)
- El **Contrato** define el recaudo **por nivel**: **copago** (% por nivel + tope) o **cuota moderadora** (valor fijo por nivel). El concepto se fija **por contrato**.
- La **Orden** elige el **nivel del paciente** → el recaudo se **calcula/autocompleta** (ya no se digita en caja):
  - **Cuota moderadora:** valor fijo del nivel, **una vez por atención**.
  - **Copago:** **% del nivel × tarifa de cada estudio**, limitado al **tope por evento**.
- La **tarifa** (valor del servicio al pagador) es aparte y **no** varía por nivel.
- Prototipo: `generador-rips/prototipos/prototipo-convenio-contrato-orden.html` (repo hermano).

## Relacionado
- [[Acuerdo 260 de 2004 — Cuotas moderadoras y copagos]] · [[Diccionario de construcción de la FEV en salud]] · [[Dónde vive cada campo — FEV × RIS]] · [[Preguntas abiertas]]

## Fuentes
- [[Acuerdo 260 de 2004 — Cuotas moderadoras y copagos]] (CNSSS / MinSalud)
