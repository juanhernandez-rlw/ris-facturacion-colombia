---
tipo: inicio
actualizado: 2026-07-16
---

# 🏠 Contexto · Facturación en Salud Colombia

> [!abstract] Propósito
> Repositorio central de conocimiento para diseñar la arquitectura de una aplicación web que maneja **información financiera y médica sensible** (facturación electrónica en salud, Colombia).
> **Etapa 1:** compilar, limpiar, relacionar y enlazar a *fuentes de la verdad* todo el contexto necesario para tomar decisiones de diseño.

## 📌 Documentos rectores
- 🎯 [[Objetivo]] — la esencia y el objetivo (dominar la construcción del **RIPS** campo por campo).
- 🛡️ [[Reglas]] — reglas inviolables de integridad de datos y de trabajo.

## 🧭 Navegación
|  | Sección | Qué contiene |
| --- | --- | --- |
| 🎯 | [[Visión y objetivos]] | Visión, objetivos, alcance, actores, preguntas abiertas |
| 📥 | [[_Índice de fuentes]] | Registro de fuentes con procedencia (Figma, docs, Replit, oficiales…) |
| 🧩 | [[_MOC Dominio]] | Conocimiento limpio: conceptos, procesos, glosario |
| ⚖️ | [[_MOC Normativo]] | Normativa: FEV-RIPS, Habeas Data, HCE… |
| 📋 | [[_MOC Requisitos]] | Requisitos funcionales y no funcionales |
| 🗃️ | [[_MOC Modelo de datos]] | Entidades, atributos, sensibilidad |
| 🏛️ | [[_MOC Arquitectura]] | Vistas, componentes y decisiones (ADR) |
| 💾 | [[_MOC Base de datos]] | Diseño de la base de datos |
| 🔀 | [[_MOC Flujos]] | Flujos de información |

## ▶️ Empezar aquí
1. Lee **[[Cómo usar este repositorio]]** — el flujo para incorporar fuentes.
2. Revisa **[[Convenciones y taxonomía]]** — nomenclatura, propiedades y etiquetas.
3. Empieza a compartirme fuentes (enlace + contexto). Yo creo la ficha de fuente, extraigo, limpio y enlazo a la síntesis.

## 📥 Fuentes por procesar
```base
filters:
  and:
    - 'tipo == "fuente"'
    - 'estado != "procesada"'
    - 'estado != "archivada"'
views:
  - type: table
    name: Pendientes
    order:
      - file.name
      - categoria
      - estado
      - fecha_captura
```

## 🚦 Estado
Ver **[[Estado del proyecto]]**.
