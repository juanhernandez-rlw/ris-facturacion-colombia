---
tipo: concepto
area: dominio
estado: revisado
relacionado: []
etiquetas: [salud, datos, facturacion]
actualizado: 2026-07-16
---

# RIPS — Registro Individual de Prestación de Servicios de Salud

## Definición
Conjunto de datos **clínico-administrativos** que soporta cada prestación de servicios de salud (usuarios, consultas, procedimientos, medicamentos, urgencias, hospitalización, etc.). En el modelo actual es el **soporte de la Factura Electrónica de Venta en salud** y viaja/valida junto a ella. Ver [[FEV-RIPS — Facturación electrónica en salud]].

## Por qué importa para la arquitectura
- Contiene **datos sensibles de salud** (diagnósticos, procedimientos) → máximo nivel de protección. Ver [[Ley 1581 de 2012 — Protección de datos personales]].
- Su **estructura (JSON) está normalizada** por los documentos técnicos del MUV → base para el [[_MOC Modelo de datos|modelo de datos]].

## Relacionado
- [[MUV — Mecanismo Único de Validación]]

## Fuentes
- *(Pendiente: enlazar documentos técnicos de estructura RIPS en SISPRO)*
