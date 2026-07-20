---
tipo: concepto
area: dominio
tema: facturacion
estado: verificado
fuentes: ["[[SISPRO — Micrositio FEV-RIPS]]"]
relacionado: ["[[Diccionario de construcción de la FEV en salud]]", "[[Dónde vive cada campo — FEV × RIS]]", "[[Cuota moderadora y copago (recaudo del usuario)]]"]
etiquetas: [dominio, facturacion, insumos, medicamentos, contraste]
actualizado: 2026-07-19
---

# Insumos (medicamentos y otros servicios)

## Definición
**Insumo** = lo que se consume en la atención **además del estudio**: medio de **contraste**, medicamentos, dispositivos médicos, materiales. En imagenología el caso central es el **medio de contraste**.

## El RIPS lo maneja por DOS vías (según qué sea) — DT1 v002
| Insumo | Arreglo RIPS | `codTecnologiaSalud` (regla DT1) |
|---|---|---|
| **Medicamento** (incl. **medio de contraste**) | `medicamentos[]` | **IUM**; si no tiene, **CUM** (tablas `IUM` / `CatalogoCUMs`). Campo **M08** |
| **Dispositivo médico e insumo** (`tipoOS` = 01) | `otrosServicios[]` | **IDM** (Res. **1405 de 2022**); transitorio **UDI**; si no hay UDI, **código interno** del facturador. Campo **S06** |

*(Otras subcategorías de `otrosServicios` — referencia DT1: traslados/estancias → **CUPS** · honorarios → **CUPS** del procedimiento · servicios complementarios → **MIPRES**.)*

## Estructura — el insumo cuelga del USUARIO, no del estudio
`medicamentos[]` y `otrosServicios[]` son **arreglos hermanos** de `procedimientos[]` bajo `usuarios[].servicios`. **No hay ningún campo** que ligue un insumo al `consecutivo` de un procedimiento → el insumo es **por orden/usuario**. La relación clínica (contraste ↔ TAC contrastado) es **implícita** (mismo dx / fecha / factura), no estructural.
> Capturar el insumo "por estudio" en la UI es **solo comodidad visual**; al generar el RIPS/FEV sale como **línea del usuario**.

## En la FEV y el cuadre
Cada insumo es una **`InvoiceLine`** propia (código + descripción + cantidad + precio) y **suma al valor de servicios**. Su **valor en el RIPS** (`vrUnit…`/`vrServicio`) debe **cuadrar** con su línea en la FEV (mismo cruce que los estudios). Cada línea lleva su propio `conceptoRecaudo` / `valorPagoModerador`.

## Cómo lo modela el RIS (decisión de diseño)
- La **tarifa del insumo** vive en el **Contrato** (precio **unitario** × convenio), **igual que los estudios**. El **código** es nacional (IUM/CUM/UDI); el **precio** lo pone el contrato.
- La **Orden** agrega el insumo desde la tarifa del contrato (con **cantidad**) → valor = unitario × cantidad → línea en el RIPS (`medicamentos[]` / `otrosServicios[]`) y en la FEV.
- **Matiz doc/diseño:** el RIPS/FEV **contienen** el insumo y su **valor** (norma); que ese valor **venga del contrato** es nuestro modelo (el RIPS no sabe de "contratos").

## Preguntas abiertas
- Contraste: ¿**línea propia** (medicamento CUM/IUM) o **bundled** en el CUPS "contrastado"? ¿lleva **recaudo propio** o solo el estudio? → [[Preguntas abiertas|#23]].

## Relacionado
- [[Diccionario de construcción de la FEV en salud]] · [[Dónde vive cada campo — FEV × RIS]] · [[Cuota moderadora y copago (recaudo del usuario)]] · [[Preguntas abiertas]]

## Fuentes
- **DT1 v002** — campos **M08** (medicamentos) y **S05/S06** (otrosServicios), en [[SISPRO — Micrositio FEV-RIPS]].
- **Resolución 1405 de 2022** — estandarización y codificación de dispositivos médicos (IDM/UDI).
