---
tipo: moc
area: modelo-datos
actualizado: 2026-07-16
---

# 🗃️ Modelo de datos

Entidades del dominio, sus atributos y su **nivel de sensibilidad** (clave por manejar datos de salud y financieros).

> Usa [[Plantilla · Entidad de datos]]. Marca `sensibilidad`, `contiene_pii`, `contiene_dato_salud`.

## Entidades
```base
filters:
  and:
    - 'tipo == "entidad"'
views:
  - type: table
    name: Entidades
    order:
      - file.name
      - dominio
      - sensibilidad
      - contiene_pii
      - contiene_dato_salud
```

## Diccionario
- [[Diccionario de datos]]
- [[Diccionario de construcción de la FEV en salud]] — campos de la factura electrónica → origen de captura (qué debe disponibilizar el front del RIS).

## Catálogos
- [[Catálogo de causales de glosa, devolución y respuesta (Res 2284-2023)]] — 283 códigos de glosa (`FA/TA/SO/AU/CO/CL/SA`) + relacionamiento con campos RIPS + DE/RE; datos en `Catálogos/causales-glosa.json`.
- [[Tablas de referencia vigentes (SISPRO) — enums del RIPS]]

## Insumos
- Formularios de Figma, estructura de [[RIPS — Registro Individual de Prestación de Servicios|RIPS]] (documentos técnicos del MUV), prototipos Replit.

## Relacionado
- [[_MOC Base de datos]] · [[_MOC Flujos]]
