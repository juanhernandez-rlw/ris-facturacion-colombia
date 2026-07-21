# Revalidación de enums contra SISPRO — 2026-07-20

> Cumple la Regla §4.5 (validar SIEMPRE contra la tabla viva de SISPRO). Método: consulta **en vivo** de `https://web.sispro.gov.co/WebPublico/Consultas/ConsultarDetalleReferenciaBasica.aspx?Code=<tabla>` para las tablas de mayor riesgo; el resto se contrasta con la captura viva del **2026-07-16** ([[Tablas de referencia vigentes (SISPRO) — enums del RIPS]]). Los valores se traen **tal cual** (§4.5.c).

## ✅ Verificado en vivo hoy

| Enum | Tabla SISPRO | Fecha_Actualizacion | Resultado |
|---|---|---|---|
| **RCONCEPTO** | `conceptoRecaudo` | 2025-05-16 | **5 valores** (01 Copago · 02 Cuota moderadora · 03 Pagos compartidos en planes voluntarios · 04 Anticipo · 05 No aplica). **Corregido**: faltaban 03 y 04. |
| **COBERTURA** | `coberturaPlan` | **2026-07-03** | **17 valores, incl. 16/17** (UPC Contributivo/Subsidiado). El enum de 17 es **CORRECTO** — usa la tabla **vigente**. |
| **MODALIDAD_PAGO** | `ModalidadContratoyPago` | 2022-06-16 | **12 valores** oficiales (live). → **Adoptados** como fuente de verdad; enum 4→12 y seed remapeado (C1 resuelto). |

> [!warning] Lección §4.5.b — versiones obsoletas de nombre parecido
> Existen **dos** tablas de cobertura: `CoberturaPlanBeneficios` (**15** valores, **2022**, lado RIPS) y `coberturaPlan` (**17** valores, **2026-07-03**, vigente, lado FEV-salud). El prototipo usa **coberturaPlan** (la vigente) → los códigos 16/17 son legítimos. Casi los marco como error por mirar la tabla vieja; el chequeo en vivo lo evitó.

## ✔️ Consistentes con la captura viva del 2026-07-16
`TIPO_USUARIO` (13) · `TIPO_DOCUMENTO`/TipoIDPISIS (16) · `SEXO` (el RIPS reporta **M/F/I** vía Extra_III) · `ZONA` (2) · `TIPO_DX` (3).

## ℹ️ Subconjunto intencional
`FINALIDAD`: 9 de los **34** valores de `RIPSFinalidadConsultaVersion2`; los 9 coinciden. Recorte deliberado para imagenología (no es error, pero conviene documentarlo).

## Fuera del alcance SISPRO
`FORMAPAGO`, `MEDIOPAGO`: catálogos **DIAN** (FEV), no SISPRO. `IVAOPC`, `NIVELES`: internos / Acuerdo 260.

---

## 🧾 Registro de conflictos (Regla §5) — pendientes de tu decisión

| # | Enum/campo | Conflicto | Estado |
|---|---|---|---|
| C1 | **MODALIDAD_PAGO** | El prototipo usaba 4 valores custom que no mapeaban a la tabla oficial. | ✅ **RESUELTO (2026-07-20):** adoptada la tabla SISPRO `ModalidadContratoyPago` (12 valores, live 2022-06-16) como fuente de verdad. Seed remapeado: 03 Capitación→11 · 04 Evento→12 (Pago por Servicio) · 01 Paquete se mantiene. Enum, JSON Schema y Zod actualizados a 12. |
| C2 | **RECAUDO_TU** (recaudo) | La regla nueva (concepto por **tipo de usuario**) **contradice** la nota verificada [[Cuota moderadora y copago (recaudo del usuario)]] ("el concepto se fija **por contrato**"), y **simplifica** el Acuerdo 260 (los beneficiarios pagan cuota **y** copago según servicio; P y M exentas — RVC084). Lo único firme: cuota moderadora = solo contributivo (RVC035). | Decidir el modelo de recaudo definitivo. Ver detalle en `reglas.dmn.json → mapas.RECAUDO_TU._doc`. |
| C3 | **COBERTURA** etiquetas 08/14 | Abreviadas respecto al texto exacto de SISPRO (p. ej. 14 = "Cobertura Fondo Nacional de Salud de las Personas Privadas de la Libertad"). Los **códigos** coinciden. | Cosmético; alinear etiquetas si se quiere fidelidad total de texto. |

## Método (trazabilidad)
- Consultas en vivo: `?Code=conceptoRecaudo`, `?Code=CoberturaPlanBeneficios`, `?Code=coberturaPlan`, `?Code=salud_modalidad_pago` (esta última "No Results" en el endpoint → es genericode FEV-salud; se leyó de `Lista_valores/.../salud_modalidad_pago.gc`).
- Paginación via `__doPostBack` (ddlPageSize=50) para ver todas las filas.
