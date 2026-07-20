---
tipo: fuente
categoria: figma
titulo: "RIS — Colombia (Figma)"
url: "https://www.figma.com/design/bO2DjO1sAzqsQhF7WrdXga/RIS---Colombia?node-id=1-2"
autor: "edenmed"
fecha_captura: 2026-07-19
estado: en-proceso
es_fuente_de_verdad: false
confiabilidad: alta
areas: [arquitectura, modelo-datos, requisitos]
etiquetas: [figma, ris, front, diseño]
---

# RIS — Colombia (Figma)

> [!info] Ficha de fuente · diseño (Figma)
> Diseño de producto + documentación de datos del **RIS de imagenología** de edenmed. No es solo UI: incluye el modelo **Convenio/Contrato/Orden**, gestión de RIPS, facturación, y **tablas de mapeo campo → tabla oficial → dónde vive** (RIPS verde / FEV azul).

## 🔗 Acceso
- **URL:** ver frontmatter (node `1:2` = canvas principal). 144 bloques de primer nivel.

## 🎯 Qué aporta
- **Modelo de datos del RIS** (Convenio → Contrato → Orden) — insumo central de la Fase 3.
- Flujo de orden (Ingreso paciente → Agendamiento → Estudio → Comentarios), Convenios, Contratos (CUCON), **Gestión de RIPS** (estados ok/warning/error + envío a facturador), Facturación (auditoría / listos / facturas / notas), **Prefactura**.
- Un **mapa campo→origen propio** ("Campos FEV-salud", "Campos del convenio", "Quién alimenta el plano") — gemelo del diccionario FEV.

## ⚠️ Notas / discrepancias (resueltas en [[Dónde vive cada campo — FEV × RIS]])
- Enums simplificados/viejos: cobertura "01–10" (vivo = **17**), `tipoUsuario` "05 no afiliado" (**no** oficial).
- **"Plano software facturación" = versión de Loggro sin API → descartado**; integración real = **API de Loggro**.
- Es un RIS de **imagenología** (estudio = CUPS).
- Numeración DIAN: el diseño se preguntaba quién numera → **decisión: el RIS** (validado).

## 🧠 Conocimiento derivado
- [[Dónde vive cada campo — FEV × RIS]] (Fase 3) · [[Diccionario de construcción de la FEV en salud]].

## 🕓 Procedencia
- Revisado 2026-07-19: estructura completa (144 nodos, vía metadata), **todas las anotaciones de texto**, y capturas de *Ingreso del paciente*, *Nuevo convenio* y *Campos FEV-salud*. Vistas basadas en imágenes aplanadas no revisadas una a una.

## 🔗 Relacionado
- [[Dónde vive cada campo — FEV × RIS]] · [[Diccionario de construcción de la FEV en salud]] · [[FEV-RIPS — Facturación electrónica en salud]]
