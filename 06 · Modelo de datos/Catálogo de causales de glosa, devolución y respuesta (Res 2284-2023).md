---
tipo: referencia
area: modelo-datos
tema: catalogo-causales
estado: procesada
fuentes: ["[[Manual Único de Devoluciones, Glosas y Respuestas (Res 2284-2023 · 1885-2024)]]"]
relacionado: ["[[Modelo de persistencia (fusión P0 · Fase 5 · P3)]]", "[[Tablas de referencia vigentes (SISPRO) — enums del RIPS]]", "[[Requisitos funcionales — glosas y devoluciones (RF-GL)]]"]
etiquetas: [modelo-datos, catalogo, glosa, devolucion, respuesta, rips, causales]
actualizado: 2026-07-22
datos: "Catálogos/causales-glosa.json"
---

# Catálogo de causales de glosa, devolución y respuesta (Res. 2284/2023)

> [!abstract] Qué es
> El **catálogo de códigos** con que una entidad responsable de pago (ERP) objeta una factura radicada, y su **relacionamiento con los campos del RIPS**. Los datos vivos están en **`Catálogos/causales-glosa.json`** (versionado); esta nota documenta su origen, estructura y conteos. Alimenta las entidades **Glosa / Devolución / Respuesta** de [[Modelo de persistencia (fusión P0 · Fase 5 · P3)]] (§2.10-2.13).

## 1 · Fuentes y fidelidad
| Familia | Fuente | Fidelidad |
|---|---|---|
| **Glosa** (283 códigos) | `tabla-relacionamiento-glosas-vs-campo-rips-31-mayo-2024.xlsx` (SISPRO) | **Alta** — parseo estructurado, verificado |
| **Devolución** (`DE…`) | Res. 2284 Anexo Técnico 3 (PDF) | Provisional — extraído best-effort (**ruido OCR**) |
| **Respuesta** (`RE…`) | Res. 2284 Anexo Técnico 3 (PDF) | Provisional — extraído best-effort (**ruido OCR**) |

> [!warning] Las listas DE/RE son provisionales
> Se extrajeron del PDF por línea; hay ruido OCR y algún encabezado se pierde (p. ej. **`DE50`** no se capturó como padre, aunque sí sus sub-códigos `DE5001`/`DE5002`). **La autoridad es el Anexo Técnico 3 del PDF.** Deben revisarse antes de usarse en producción.

## 2 · Glosas — estructura y conteos (alta fidelidad)
**283 códigos** en 3 niveles: **7 grupos** (General) → **99 subcategorías** (Específico) → **184 causales aplicables** (Aplicación — las que se imputan a un servicio).

> [!note] Reconciliación "332 filas"
> El xlsx dice *"332 filas"*: son **283 códigos + 7 grupos + ~42 filas** de definición/nota/cabecera. **No hay 332 causales; hay 283 códigos (184 aplicables).**

| Grupo | Nombre | Códigos |
|---|---|---|
| **FA** | Facturación | 71 |
| **TA** | Tarifas | 31 |
| **SO** | Soportes | 80 |
| **AU** | Autorizaciones | 38 |
| **CO** | Cobertura | 26 |
| **CL** | Calidad | 26 |
| **SA** | Seguimiento a acuerdos | 11 |

Cada entrada de glosa en el JSON:
```json
{ "codigo": "FA0101", "grupo": "FA", "nivel": "Aplicación", "aplicable": true,
  "descripcion": "El cargo por estancia u observación de urgencias … presenta diferencia con las cantidades facturadas",
  "camposRIPS": ["R02","R11","H03","H14","S08","S12"] }
```

## 3 · Relacionamiento con campos RIPS
El aporte central del xlsx: qué **campo(s) del RIPS** quedan implicados en cada glosa. **348 marcas** (`X`) sobre **135 campos** RIPS (T01…S16), **capturadas al 100 %** (auditoría: 348 en el archivo = 348 en el catálogo). **144 de 283** códigos traen ≥1 campo (el resto son subcategorías o aplicables sin campo marcado en la fuente).
> Esto conecta con la **envolvente transaccional** (Anexo 3, numeral 2): la glosa viaja con `campo U10` + `consecutivo del servicio`, que **anclan la objeción a la línea RIPS exacta**. El `camposRIPS[]` del catálogo dice *cuál* de esos campos se disputa.

## 4 · Devolución (DE) y Respuesta (RE) — listas provisionales
- **DE (devolución, factura completa):** `DE16` otro responsable de pago · `DE44` prestador fuera de red · `DE50` factura ya pagada / en trámite · **`DE56`** no radicación de soportes en 22 días hábiles (+ sub-códigos).
- **RE (respuesta del prestador):** `RE22` respuesta extemporánea · `RE95` glosa/devolución extemporánea · `RE96` injustificada · `RE97` **aceptada total** (⇒ nota crédito) · `RE98` **parcial subsanada** · `RE99` no aceptada subsanada.

## 5 · Cómo lo consume el sistema
- El enum `CAUSAL_GLOSA` del modelo declarativo (`generador-rips/modelo-formal/enums.json`) ya lleva los **7 grupos**; el gate de glosa valida contra ellos.
- Las **184 aplicables** son las que el usuario selecciona al formular una glosa; el prototipo puede cargar `causales-glosa.json` para el selector detallado y para prellenar `camposRIPS[]` (guía de subsanación).
- Al conectar el modelo con el código, este JSON es la **fuente única**: copiar/enlazar a `generador-rips` en vez de duplicar la lista a mano.

## Relacionado
- [[Modelo de persistencia (fusión P0 · Fase 5 · P3)]] (§2.10-2.13) · [[Manual Único de Devoluciones, Glosas y Respuestas (Res 2284-2023 · 1885-2024)]] · [[Tablas de referencia vigentes (SISPRO) — enums del RIPS]] · [[Requisitos funcionales — glosas y devoluciones (RF-GL)]]
