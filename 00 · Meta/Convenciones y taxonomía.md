---
tipo: guia
actualizado: 2026-07-16
---

# Convenciones y taxonomía

## Nomenclatura de notas
- Título claro en lenguaje natural (español). Ej.: `Resolución 948 de 2026`.
- MOC de área: `_MOC <Área>`. Índices: `_Índice de <…>`.
- Fichas de fuente: nombre descriptivo de la fuente.
- Plantillas: `Plantilla · <Tipo>`.

## Carpetas
| Carpeta | Uso |
| --- | --- |
| `00 · Meta` | Cómo usar, convenciones, estado |
| `01 · Contexto del proyecto` | Visión, alcance, actores, preguntas |
| `02 · Fuentes` | Fichas de fuente (procedencia) por categoría |
| `03 · Dominio y negocio` | Conceptos, procesos, glosario |
| `04 · Marco normativo` | Normas y cumplimiento |
| `05 · Requisitos` | Funcionales / no funcionales |
| `06 · Modelo de datos` | Entidades y diccionario |
| `07 · Arquitectura` | Vistas, componentes, ADR |
| `08 · Base de datos` | Diseño de BD |
| `09 · Flujos de información` | Flujos de datos |
| `_Plantillas` | Plantillas de nota |
| `_Adjuntos` | Imágenes, PDF, exportaciones |

## Propiedades (frontmatter) por tipo
Se usan para filtrar y para las vistas `.base`. Valores controlados:

**Común**
- `tipo`: fuente · concepto · norma · requisito · entidad · adr · proceso · moc · guia · indice
- `etiquetas`: lista (preferir las de abajo)

**fuente**
- `categoria`: figma · documento · replit · oficial · otra
- `estado`: pendiente · en-proceso · procesada · archivada
- `es_fuente_de_verdad`: true · false
- `confiabilidad`: alta · media · baja
- `areas`: dominio · normativo · requisitos · modelo-datos · arquitectura · ux

**norma**
- `emisor`, `numero`, `tema` (proteccion-datos · facturacion · salud · historia-clinica · seguridad)
- `estado`: vigente · derogada · modificada · por-verificar
- `url_oficial`

**requisito**
- `clase`: funcional · no-funcional
- `id`: RF-### / RNF-###
- `prioridad`: alta · media · baja
- `estado`: propuesto · aprobado · descartado · implementado

**entidad**
- `sensibilidad`: publica · interna · confidencial · dato-sensible-salud · financiera
- `contiene_pii`, `contiene_dato_salud`: true · false

## Etiquetas sugeridas
`#normativa` `#facturacion` `#salud` `#financiero` `#proteccion-datos` `#seguridad` `#ux` `#modelo-datos` `#integracion` `#adr` `#pregunta-abierta`

## Enlazado
- Enlaza con `[[Nombre de la nota]]`. Para alias usa `[[Nota|texto]]`.
- Dentro de tablas Markdown, escapa el pipe del alias: `\|`.
- Cada nota de síntesis enlaza a su(s) **fuente(s)** y a notas **relacionadas**.
