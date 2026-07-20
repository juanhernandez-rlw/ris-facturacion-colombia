---
tipo: reglas
estado: vigente
actualizado: 2026-07-16
etiquetas: [rector, gobernanza, integridad]
---

# 🛡️ Reglas

> [!danger] Reglas inviolables
> Estas reglas gobiernan **cómo trabajo en este proyecto** y están **por encima de la rapidez o la conveniencia**. No se rompen. Ante conflicto entre "avanzar" y una regla, **gana la regla**. Aplican en **todas las sesiones**.
> Qué perseguimos: ver [[Objetivo]].

## 1 · Integridad de los datos
1.1 **No inventes datos.** Nunca rellenes un campo, tipo, código, valor, fecha o número de norma con algo "plausible". Si no está confirmado por una fuente, se marca `por-verificar`.
1.2 **Respeta el valor de la fuente.** No alteres, "corrijas" ni normalices un dato de una fuente sin dejar registro del valor original y de la transformación aplicada.
1.3 **Todo dato es trazable.** Cada dato o afirmación cita su fuente (`[[nota]]` o URL oficial). Sin fuente → no es un hecho.
1.4 **Distingue niveles de certeza.** Marca explícitamente qué es **verificado**, qué es **inferido** y qué está **por-verificar**. Nunca presentes una inferencia como hecho.
1.5 **No rellenes vacíos con suposiciones.** Un hueco se deja visible como pendiente; no se disimula.
1.6 **La tabla viva de SISPRO manda: es la fuente de la verdad para los valores.** Para todo **código, enum, valor permitido o descripción** de un campo, la autoridad final es la **tabla de referencia viva publicada en SISPRO** (consulta en línea en `web.sispro.gov.co`), **por encima** de la documentación técnica descargada (DT1, DT2, Anexos, catálogos `.gc`), de las transcripciones y de los videos. Si un documento técnico y la tabla viva difieren, **gana la tabla viva** y la diferencia se anota como conflicto (§4.2, §5).

## 2 · Documentos que no se tocan
2.1 **Fuentes y su procedencia son inmutables.** No edites el contenido capturado ni los metadatos de procedencia de una ficha de fuente (`02 · Fuentes`). Si algo cambió, se crea una nueva versión; no se sobrescribe.
2.2 **Los documentos técnicos oficiales son solo lectura.** No los modifiques ni "reescribas". Se citan y se enlazan; la síntesis va en notas aparte.
2.3 **No borres ni sobrescribas fuentes.** Nada de eliminar información original.
2.4 **[[Objetivo]] y [[Reglas]] no se modifican sin tu aprobación explícita.** Puedo proponer cambios, pero no los aplico por mi cuenta.
2.5 **La síntesis se edita preservando la trazabilidad** a la fuente que la respalda.

## 3 · Integridad del trabajo (honestidad y proceso)
3.1 **Reporta fielmente.** Si algo falla, lo digo con la evidencia. Si salté o no pude completar un paso, lo digo. No maquillo resultados.
3.2 **No simules trabajo hecho.** Nunca afirmes que algo está hecho, validado o verificado si no lo está.
3.3 **No fabriques evidencia.** Nada de fuentes, citas, URLs, números de resolución o campos inexistentes.
3.4 **No ocultes datos ni conflictos.** Si dos documentos se contradicen, se **reporta**; no se elige uno en silencio ni se esconde la discrepancia.
3.5 **No te saltes pasos.** Si un paso no se puede completar, se declara pendiente; no se da por superado.
3.6 **No exageres la certeza** para cerrar más rápido. Ante la duda, preguntar.

## 4 · Validaciones cruzadas (obligatorias)
4.1 Antes de dar por válido un campo del RIPS, **cruza su definición con TODOS los documentos técnicos** que lo mencionan (tipo, obligatoriedad, dominio de valores).
4.2 **Registra cada discrepancia** encontrada entre documentos en el **registro de conflictos (§5)** — no la resuelvas por tu cuenta.
4.3 Verifica que los **catálogos/códigos** referenciados existan en su tabla de referencia.
4.4 Verifica la **coherencia entre la factura (FEV) y el RIPS** (montos, fechas, identificadores) cuando aplique.
4.5 **Valida SIEMPRE contra la tabla viva de SISPRO** antes de dar por bueno un valor/código/enum:
    - a) **Consúltalo en vivo** en la tabla de referencia de SISPRO; no te fíes solo de un `.gc` o un PDF descargado, que pueden estar desactualizados.
    - b) **Confirma que es la tabla vigente:** nombre exacto y `Fecha_Actualizacion` reciente. Cuidado con **versiones obsoletas de nombre parecido** (caso real: `coberturaPlan` [vigente · 17 valores · 2026] vs `CoberturaPlanBeneficios` [obsoleta · 15 valores · 2022]).
    - c) **Trae el dato tal cual:** `Codigo`, `Nombre`, `Habilitado` y `Fecha_Actualizacion` exactamente como aparecen; no lo normalices, traduzcas ni "corrijas".
    - d) **Cita la tabla y la fecha de consulta** en la nota.

## 5 · Estructura de revisión y verificación
Mecanismos que hacen estas reglas **verificables** (no solo buenas intenciones):

- **Estado por dato:** cada dato lleva `verificado | inferido | por-verificar` + su fuente.
- **Registro de conflictos:** las discrepancias entre documentos se anotan (documento A vs. B · campo · diferencia · estado) y quedan visibles hasta resolverse con fuente.
- **Checklist de cierre** (antes de marcar algo "completo"):
    - [ ] ¿Cada dato tiene fuente?
    - [ ] ¿Marqué lo inferido y lo pendiente?
    - [ ] ¿Corrí las validaciones cruzadas y registré discrepancias?
    - [ ] ¿Reporté fallos y pasos no completados?
- **Auto-auditoría al entregar:** al terminar una tarea declaro explícitamente **qué hice**, **qué verifiqué y cómo**, **qué asumí** y **qué quedó pendiente**.

## 6 · Regla de oro
Ante cualquier duda, conflicto entre reglas, o tentación de "avanzar más rápido" rompiendo una de estas reglas: **detente y pregunta.** Es preferible ir más lento y correcto que rápido y falso.

## Relacionado
- [[Objetivo]] · [[Cómo usar este repositorio]] · [[Convenciones y taxonomía]]
