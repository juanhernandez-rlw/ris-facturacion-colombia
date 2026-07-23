---
tipo: moc
area: arquitectura
actualizado: 2026-07-16
---

# 🏛️ Arquitectura

Decisiones y vistas de la arquitectura objetivo. Se nutre de contexto, requisitos, normativa y modelo de datos.

## Vistas (por construir)
- Vista de contexto (sistemas y actores) — ver [[Actores y stakeholders]]
- Componentes
- Despliegue

## Decisiones (ADR)
Crear con [[Plantilla · ADR]] dentro de `Decisiones ADR`.
```base
filters:
  and:
    - 'tipo == "adr"'
views:
  - type: table
    name: ADR
    order:
      - id
      - file.name
      - estado
      - fecha
```

## Integraciones clave
- [[MUV — Mecanismo Único de Validación]] · DIAN (FEV) · **Loggro** (timbrado, API) → [[Loggro — API de facturación electrónica]]

## Facturación electrónica (FEV-RIPS)
- [[Mapa de flujos del sistema (para desarrollo)]] — **todos los flujos** (16) documentados para desarrollo; complementa los diagramas de Figma (página *Diagramas de flujo · Facturación*).
- [[Ciclo de vida de la FEV — estados y operaciones asíncronas]] — máquina de estados de dos ejes (documento + operación async) con loading, rechazos DIAN/MUV y contingencia.
- [[Notas crédito y débito (NC · ND) — flujo, campos y reglas]] — flujo de correcciones (NC/ND) con reglas y códigos **verificados** (Caja de Herramientas DIAN v1.9 + DT1/DT2 + Lineamientos v3.2).
- [[Dónde vive cada campo — FEV × RIS]] — ubicación de cada campo de la factura en el modelo Convenio/Contrato/Orden (Fase 3).
- [[Diccionario de construcción de la FEV en salud]] — campos FEV → origen de captura.
- [[Inventario del formulario de Orden × RIPS-FEV]] — qué captura el form de Orden vs. lo que exigen RIPS/FEV (gaps).
- [[Formulario de Orden — spec reorganizada (RIPS + FEV)]] — el formulario completo reorganizado (todos los campos RIPS + FEV).

## Relacionado
- [[_MOC Requisitos]] · [[_MOC Modelo de datos]] · [[_MOC Base de datos]] · [[_MOC Flujos]]
