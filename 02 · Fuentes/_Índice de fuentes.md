---
tipo: indice
actualizado: 2026-07-16
---

# 📥 Índice de fuentes

Registro de todas las fuentes con su **procedencia** y estado. Cada fuente = una ficha (plantilla [[Plantilla · Fuente]]) guardada en su subcarpeta por categoría.

> [!tip] Vista de base de datos
> Abre **`Fuentes.base`** (en esta carpeta) para ver/filtrar todas las fuentes como tabla.

## Todas las fuentes
```base
filters:
  and:
    - 'tipo == "fuente"'
views:
  - type: table
    name: Todas
    order:
      - file.name
      - categoria
      - estado
      - es_fuente_de_verdad
      - fecha_captura
```

## Qué capturar según la categoría
| Carpeta | `categoria` | Qué compartir y qué capturo |
| --- | --- | --- |
| `Figma` | `figma` | Enlace + qué pantallas/flujos mirar. Extraigo flujos, pantallas y **campos de formularios** (insumo de modelo de datos). Puedo leer Figma directamente desde el enlace. |
| `Documentos` | `documento` | Archivo/enlace (PDF, Word, Excel, slides) + qué contiene. Resumo y extraigo lo relevante; original a `_Adjuntos`. |
| `Prototipos Replit` | `replit` | Enlace al Repl/app + qué demuestra. Extraigo flujo, datos y lógica relevante. |
| `Fuentes oficiales` | `oficial` | Enlace oficial (MinSalud, DIAN, SIC, SISPRO…). Son **fuentes de la verdad** (`es_fuente_de_verdad: true`); las enlazo en [[_MOC Normativo]]. |
| `Otras fuentes` | `otra` | Correos, reuniones, artículos, benchmarks. Indico origen y confiabilidad. |

## Índice manual (respaldo)
| Fuente | Categoría | Estado | Fuente de verdad |
| --- | --- | --- | --- |
| [[Facturación RIS - Colombia]] | documento | procesada | No (interno; cita fuentes oficiales) |
| [[SISPRO — Micrositio FEV-RIPS]] | oficial | procesada | Sí |
| [[Video — Análisis DT1 Resolución 948]] | otra | procesada | No (terceros) |
| [[DIAN — Anexo Técnico de Factura Electrónica de Venta v1.9]] | oficial | procesada | Sí |
| [[Loggro — API de facturación electrónica]] | otra | en-proceso | No (proveedor) |
| [[RIS — Colombia (Figma)]] | figma | en-proceso | No (diseño interno) |
| [[Acuerdo 260 de 2004 — Cuotas moderadoras y copagos]] | oficial | procesada | Sí |
