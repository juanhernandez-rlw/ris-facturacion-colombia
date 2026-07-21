---
tipo: analisis
area: modelo-datos
tema: recaudo
estado: por-validar
fuentes: ["[[Acuerdo 260 de 2004 — Cuotas moderadoras y copagos]]", "DT1 v002 (RVC035/036/084)", "[[Cuota moderadora y copago (recaudo del usuario)]]"]
relacionado: ["[[Modelo formal declarativo (reglas como dato)]]", "[[Preguntas abiertas]]"]
etiquetas: [recaudo, copago, cuota-moderadora, acuerdo-260, auditoria, por-validar]
actualizado: 2026-07-20
---

# Recaudo — hoja de validación (Acuerdo 260 · por validar)

> [!abstract] Qué es y por qué existe
> La auditoría 2026-07-20 halló que **el recaudo es la capa peor modelada** (hallazgos R-01…R-08). La decisión fue **validar primero, codificar después**: aquí se fija **qué dice la norma (verificado)** y **qué falta confirmar (por validar)** antes de tocar `recaudoDe()` / `RECAUDO_TU`. **Ningún valor se codifica hasta que esta hoja quede validada** (Regla §1.1/§1.6). No hay montos inventados en este documento.

## A · Verificado contra fuentes de la verdad

| # | Regla | Fuente | Nivel |
|---|---|---|---|
| A1 | **Cuota moderadora = valor FIJO por nivel**; **copago = % del valor del servicio** por nivel | Acuerdo 260 (ficha, art. 8–11) | — |
| A2 | El copago tiene **tope por evento Y tope anual** por paciente/núcleo | Acuerdo 260 (ficha) | — |
| A3 | **Nivel** por **IBC** (contributivo: <2 / 2–5 / >5 SMLMV) y por **SISBÉN** (subsidiado, reglas propias) | Acuerdo 260 (ficha) | — |
| A4 | Base de cálculo = **IBC del cotizante** (menor ingreso del núcleo) | Acuerdo 260 (ficha) | — |
| A5 | **La cuota moderadora solo se cobra a afiliados del régimen contributivo** | DT1 v002 · **RVC035** | Notificación |
| A6 | El `valorPagoModerador` de la FEV **= sumatoria** de los detalles de pago moderador del RIPS | DT1 v002 · **RVC036** | **Rechazo** |
| A7 | Finalidades de **P y M / materno-perinatal ⇒ "No aplica pago moderador"** | DT1 v002 · **RVC084** | **Rechazo** |
| A8 | `conceptoRecaudo` oficial = **01 Copago · 02 Cuota moderadora · 03 Pagos compartidos (PVS) · 04 Anticipo · 05 No aplica** | tabla viva SISPRO | — |
| A9 | Desde **2026** la unidad de referencia es la **UVB** (no SMLMV); montos anuales | Acuerdo 260 (ficha) · #22 | — |

## B · Qué hace el modelo hoy vs la regla (gaps de la auditoría)

| Hallazgo | Modelo hoy | Choca con | Qué falta |
|---|---|---|---|
| **R-01** | `recaudoDe()` cobra sobre **todos** los estudios; no lee `fin` | A7 (RVC084) | leer `fin` y exentar P y M / materno-perinatal → `conceptoRecaudo=05`, valor 0 |
| **R-02** | `RECAUDO_TU` da **una** figura por `tipoUsuario` | A1/A5 | permitir copago **y** cuota; cuota solo contributivo |
| **R-03** | copago validado **0–100 %** | A1 (topes) | aplicar techos por nivel (UVB) + tope por evento |
| **R-04** | subsidiado usa bandas **IBC**; sin exención Sisbén | A3 | nivel del subsidiado por **Sisbén**; exenciones |
| **R-05** | solo **tope por evento** | A2 | **acumulador anual** por paciente/núcleo (requiere persistencia) |
| **R-06** | copago **por línea** con tope global | A6 (RVC036) | consolidar `valorPagoModerador` según DT1 P18 |
| **R-07 / C-05** | concepto derivado nunca se emite como código; 03/04 inalcanzables | A8 | mapa `derivado → 01/02/05` (+ 03 para PVS); emitirlo |
| **R-08** | copago solo sobre estudios | (pregunta #23) | decidir si insumos/contraste generan recaudo |

## C · Mapeo `conceptoRecaudo` — listo para codificar (valores verificados)
Este es el **único** bloque con valores ya verificados (tabla viva A8), listo para implementar cuando se apruebe la hoja:

```
derivado "copago"  → conceptoRecaudo "01"
derivado "cuota"   → conceptoRecaudo "02"
derivado "no"      → conceptoRecaudo "05"
(PVS / planes voluntarios → "03"  — la derivación aún no existe, ver D3)
(anticipo "04" → solo FEV, no se deriva del paciente)
```

## D · POR VALIDAR (bloquea la codificación — necesito tu confirmación)

> [!warning] Nada de esto se codifica hasta validarlo. No inventar (Regla §1.1/§1.6).

1. **D1 · Regla figura × tipoUsuario/servicio (#24).** Confirmar contra Acuerdo 260 art. 5–9 + tabla viva: ¿qué `tipoUsuario` paga copago, cuál cuota, cuál ambos, cuál ninguno — y cómo influye la **finalidad** del servicio? (Hoy `RECAUDO_TU` es una suposición marcada POR VALIDAR.)
2. **D2 · Conjunto exacto de finalidades/causas EXENTAS (RVC084).** ¿`11` PyM, `12`/`13` detección temprana, `14` protección específica, materno-perinatal? Traer la lista de la tabla viva antes de codificar la exención.
3. **D3 · Régimen ↔ concepto.** RVC035 dice cuota **solo** contributivo. ¿El modelo debe derivar el **régimen** del `tipoUsuario`/cobertura para bloquear cuota en subsidiado? ¿Y `03` pagos compartidos para planes voluntarios (`tipoUsuario 11`)?
4. **D4 · Montos y topes UVB 2026 (#22).** Traer de la Guía MinSalud los valores del año (cuota fija por nivel, % copago por nivel, tope por evento, **tope anual**). Sin esto no hay cálculo correcto.
5. **D5 · Nivel del subsidiado.** ¿De dónde sale el nivel Sisbén en el flujo? ¿Se captura, se hereda del RIS, o se consulta?
6. **D6 · Acumulador anual (R-05).** ¿El tope anual es por **individuo** o por **núcleo familiar**? Define la entidad de persistencia (depende de P0/P3).
7. **D7 · Insumos (#23).** ¿El contraste/insumo genera recaudo propio o el recaudo es solo del estudio?

## E · Cómo seguimos
1. Validas A (o corriges) y respondes D1–D7 (algunas necesitan la tabla viva / Guía MinSalud → captura en vivo, Regla §1.6).
2. Con eso, se codifica: `recaudoDe()` por servicio + exención por finalidad + mapa `conceptoRecaudo` + consolidación DT1 P18. El acumulador anual (D6) depende del diseño de persistencia (P0 fusión / P3 BD).

## Relacionado
- [[Acuerdo 260 de 2004 — Cuotas moderadoras y copagos]] · [[Cuota moderadora y copago (recaudo del usuario)]] · [[Modelo formal declarativo (reglas como dato)]] · [[Preguntas abiertas]] (#22, #23, #24)
