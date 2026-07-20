---
tipo: objetivo
estado: vigente
actualizado: 2026-07-16
etiquetas: [rector, rips]
---

# 🎯 Objetivo

> [!abstract] Documento rector
> Captura la **esencia** y el **objetivo** del proyecto. Es la brújula: toda decisión y todo trabajo deben servir a lo aquí definido. Las reglas de **cómo** trabajamos están en [[Reglas]].

## La esencia
Diseñar la **arquitectura de una aplicación web** para el manejo de **flujos sensibles de información financiera y médica** en Colombia, en el contexto de la **facturación electrónica en salud** (modelo [[FEV-RIPS — Facturación electrónica en salud|FEV-RIPS]]).

Antes de construir la aplicación necesitamos **entender y dominar el dato**: qué exige el RIPS, de qué tipo es cada campo, de dónde sale y cómo se arma. Esa comprensión es la base de la arquitectura, el modelo de datos y la base de datos.

## Objetivo general
Construir un **repositorio de contexto** (este vault) que compile, limpie, relacione y ligue a *fuentes de la verdad* toda la información necesaria para **tomar decisiones de arquitectura** con evidencia y trazabilidad. Ver [[Inicio]].

## Objetivo operativo: dominar la construcción del RIPS
El foco de trabajo concreto es **el RIPS campo por campo**. Para **cada campo requerido** debemos determinar:

1. **Tipo de dato** — tipo, formato, longitud y dominio de valores permitidos (incluidos catálogos de referencia: CUPS, CIE-10, etc.), según el documento técnico que lo define.
2. **Desde dónde lo capturamos** — el origen del dato en nuestra solución: qué pantalla/formulario, integración, cálculo o valor por defecto lo produce. *(¿Lo digita un usuario? ¿viene de una integración? ¿se calcula?)*
3. **Cómo se construye** — la regla que transforma el dato capturado en el valor final que exige el RIPS (mapeo, formato, transformación, catálogo).
4. **Validaciones cruzadas entre TODOS los documentos técnicos** — verificar que cada campo es **consistente y coherente** en todos los documentos/estructuras que lo mencionan, y **registrar cualquier discrepancia** entre ellos en vez de resolverla en silencio.

> **Meta final:** poder **construir el RIPS correctamente y de forma trazable**, sabiendo de dónde sale cada dato y por qué tiene el valor que tiene.

## Cómo se ve el entregable
Un **mapa de construcción del RIPS** (diccionario *campo → origen*), una fila por campo. Vivirá en [[_MOC Modelo de datos|Modelo de datos]] / [[Diccionario de datos]]. Columnas mínimas:

| Columna | Qué contiene |
| --- | --- |
| Campo | Nombre exacto según el documento técnico |
| Estructura / sección | A qué parte del RIPS pertenece (usuarios, consultas, procedimientos, medicamentos…) |
| Documento técnico | Documento/estructura oficial que lo define (fuente de la verdad) |
| Tipo de dato | Tipo, formato, longitud |
| Obligatoriedad | Obligatorio / condicional / opcional (y la condición) |
| Dominio de valores | Catálogo o rango permitido (CUPS, CIE-10, tablas de referencia) |
| **Fuente de captura** | De dónde sale el dato en nuestra app (pantalla, integración, cálculo, default) |
| **Regla de construcción** | Cómo se transforma lo capturado en el valor final |
| Validaciones | Propias del campo + **cruzadas** con otros campos/documentos |
| Estado | `verificado` · `inferido` · `por-verificar` (+ fuente) |

## Criterios de éxito
- Todo campo del RIPS tiene: tipo, origen de captura, regla de construcción y validaciones, **con su fuente**.
- Las **validaciones cruzadas** entre documentos técnicos están hechas y las **discrepancias quedan registradas**, no ocultas.
- Cero datos "inventados": lo no confirmado se marca `por-verificar` (ver [[Reglas]]).

## Alcance de esta etapa
- **Incluye:** entender, mapear y validar el dato del RIPS y su origen; compilar el contexto.
- **No incluye (aún):** construir la aplicación. Primero el conocimiento y el diseño.

## Relacionado
- [[Reglas]] · [[FEV-RIPS — Facturación electrónica en salud]] · [[RIPS — Registro Individual de Prestación de Servicios]] · [[_MOC Modelo de datos]] · [[Diccionario de datos]] · [[Visión y objetivos]]
