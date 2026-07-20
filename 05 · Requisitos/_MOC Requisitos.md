---
tipo: moc
area: requisitos
actualizado: 2026-07-16
---

# 📋 Requisitos

Requisitos que guían el diseño. Cada uno con `id`, `prioridad`, `estado` y **origen** (fuente/actor).

> [!tip] Vista
> Abre **`Requisitos.base`** para ver/filtrar. Usa [[Plantilla · Requisito]] para crear.

## Funcionales (RF)
```base
filters:
  and:
    - 'tipo == "requisito"'
    - 'clase == "funcional"'
views:
  - type: table
    name: Funcionales
    order:
      - id
      - file.name
      - prioridad
      - estado
```

## No funcionales (RNF)
```base
filters:
  and:
    - 'tipo == "requisito"'
    - 'clase == "no-funcional"'
views:
  - type: table
    name: No funcionales
    order:
      - id
      - file.name
      - prioridad
      - estado
```

Categorías típicas de RNF a cubrir: **seguridad**, **privacidad/cumplimiento**, disponibilidad, rendimiento, trazabilidad/auditoría, interoperabilidad (MUV/DIAN), respaldo y retención.
